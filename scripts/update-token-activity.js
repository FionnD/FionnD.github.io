#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { execFileSync } = require('child_process')

const repoRoot = path.resolve(__dirname, '..')
const indexPath = path.join(repoRoot, 'index.html')
const home = process.env.HOME
const timeZone = 'Europe/Dublin'
const args = new Set(process.argv.slice(2))

function dateKey(timestamp) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(timestamp))

  const values = Object.fromEntries(
    parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value])
  )

  return `${values.year}-${values.month}-${values.day}`
}

function parseDate(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function startOfThreeMonthWindow(through) {
  const date = parseDate(through)
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 2, 1))
    .toISOString()
    .slice(0, 10)
}

function walk(dir) {
  let files = []

  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const next = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        files = files.concat(walk(next))
      } else if (entry.isFile() && next.endsWith('.jsonl')) {
        files.push(next)
      }
    }
  } catch {
    return files
  }

  return files
}

async function readJsonLines(file, onLine) {
  const stream = fs.createReadStream(file)
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity })

  for await (const line of rl) {
    if (!line) continue

    try {
      await onLine(JSON.parse(line))
    } catch {
      // Ignore corrupt or partial JSONL rows.
    }
  }
}

function addDaily(daily, day, tokens) {
  daily[day] = (daily[day] || 0) + tokens
}

async function parseCodexUsage() {
  const files = [
    ...walk(path.join(home, '.codex', 'sessions')),
    ...walk(path.join(home, '.codex', 'archived_sessions')),
  ]
  const seenFiles = new Set()
  const daily = {}
  const sessions = new Map()
  let calls = 0

  for (const file of files) {
    const base = path.basename(file)
    if (seenFiles.has(base)) continue
    seenFiles.add(base)

    let previousTotal = null
    let firstTimestamp = null
    let lastTimestamp = null

    await readJsonLines(file, (row) => {
      if (row.type !== 'event_msg' || row.payload?.type !== 'token_count') return

      const usage = row.payload.info?.total_token_usage
      if (!usage) return

      firstTimestamp ||= row.timestamp
      lastTimestamp = row.timestamp

      const currentTotal = usage.total_tokens || 0
      let delta = 0

      if (previousTotal === null || currentTotal < previousTotal) {
        delta = currentTotal
      } else if (currentTotal > previousTotal) {
        delta = currentTotal - previousTotal
      }

      previousTotal = currentTotal

      if (delta > 0) {
        addDaily(daily, dateKey(row.timestamp), delta)
        calls += 1
      }
    })

    if (firstTimestamp && lastTimestamp) {
      sessions.set(base, new Date(lastTimestamp) - new Date(firstTimestamp))
    }
  }

  return {
    calls,
    daily,
    files: seenFiles.size,
    longestMs: Math.max(0, ...sessions.values()),
  }
}

async function parseClaudeUsage() {
  const files = walk(path.join(home, '.claude', 'projects'))
  const seenRequests = new Set()
  const daily = {}
  const sessions = new Map()
  let calls = 0

  for (const file of files) {
    await readJsonLines(file, (row) => {
      const usage = row.message?.usage
      if (!usage || !row.timestamp) return

      const requestKey =
        row.requestId ||
        [
          row.sessionId || '',
          row.message.id || '',
          usage.input_tokens || 0,
          usage.cache_creation_input_tokens || 0,
          usage.cache_read_input_tokens || 0,
          usage.output_tokens || 0,
        ].join('|')

      if (seenRequests.has(requestKey)) return
      seenRequests.add(requestKey)

      const cacheCreation =
        usage.cache_creation_input_tokens ??
        (usage.cache_creation?.ephemeral_5m_input_tokens || 0) +
          (usage.cache_creation?.ephemeral_1h_input_tokens || 0)
      const total =
        (usage.input_tokens || 0) +
        cacheCreation +
        (usage.cache_read_input_tokens || 0) +
        (usage.output_tokens || 0)

      addDaily(daily, dateKey(row.timestamp), total)
      calls += 1

      const sessionId = row.sessionId || `file:${file}`
      const timestamp = Number(new Date(row.timestamp))
      const session = sessions.get(sessionId) || { min: timestamp, max: timestamp }
      session.min = Math.min(session.min, timestamp)
      session.max = Math.max(session.max, timestamp)
      sessions.set(sessionId, session)
    })
  }

  return {
    calls,
    daily,
    files: files.length,
    longestMs: Math.max(0, ...[...sessions.values()].map((session) => session.max - session.min)),
  }
}

function filterDaily(daily, start, end) {
  return Object.fromEntries(
    Object.entries(daily)
      .filter(([day]) => day >= start && day <= end)
      .sort(([a], [b]) => a.localeCompare(b))
  )
}

function mergeDaily(...sources) {
  const merged = {}

  for (const source of sources) {
    for (const [day, value] of Object.entries(source)) {
      addDaily(merged, day, value)
    }
  }

  return merged
}

function statsFor(daily, start, end, longestMs, calls, files) {
  const activeDays = []
  let total = 0
  let peak = 0
  let peakDate = null

  for (const [day, value] of Object.entries(daily)) {
    if (day < start || day > end) continue

    total += value
    activeDays.push(day)

    if (value > peak) {
      peak = value
      peakDate = day
    }
  }

  activeDays.sort()

  let longest = 0
  let run = 0
  let previousTime = null

  for (const day of activeDays) {
    const time = Number(parseDate(day))
    run = previousTime !== null && time - previousTime === 86400000 ? run + 1 : 1
    longest = Math.max(longest, run)
    previousTime = time
  }

  let current = 0
  let cursor = Number(parseDate(end))
  const activeSet = new Set(activeDays)

  while (activeSet.has(new Date(cursor).toISOString().slice(0, 10))) {
    current += 1
    cursor -= 86400000
  }

  return { total, peak, peakDate, current, longest, longestMs, calls, files }
}

function tokenUsageSource(tokenUsage) {
  return `        const tokenUsage = ${JSON.stringify(tokenUsage, null, 4)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `        ${line}`))
    .join('\n')}`
}

function updateIndex(tokenUsage) {
  const html = fs.readFileSync(indexPath, 'utf8')
  const updated = html.replace(
    /        const tokenUsage = [\s\S]*?\n\n        const monthNames/,
    `${tokenUsageSource(tokenUsage)}\n\n        const monthNames`
  )

  if (updated === html) return false
  if (updated === html.replace(/\r\n/g, '\n')) return false

  fs.writeFileSync(indexPath, updated)
  return true
}

function runGit(argsList) {
  return execFileSync('git', argsList, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function maybeCommitAndPush(changed) {
  if (!args.has('--commit') && !args.has('--push')) return

  if (!changed) {
    try {
      runGit(['diff', '--quiet', '--', 'index.html'])
      console.log('No token activity changes to commit.')
      return
    } catch {
      // Continue and commit the existing index.html diff.
    }
  }

  try {
    runGit(['add', 'index.html'])
    runGit(['diff', '--cached', '--quiet', '--', 'index.html'])
    console.log('No token activity changes to commit.')
    return
  } catch {
    runGit(['commit', '-m', 'Update token usage graph', '--', 'index.html'])
  }

  if (args.has('--push')) {
    runGit(['push'])
  }
}

async function main() {
  const [codex, claude] = await Promise.all([parseCodexUsage(), parseClaudeUsage()])
  const through = dateKey(new Date())
  const periodStart = startOfThreeMonthWindow(through)
  const codexDaily = filterDaily(codex.daily, periodStart, through)
  const claudeDaily = filterDaily(claude.daily, periodStart, through)
  const allDaily = mergeDaily(codexDaily, claudeDaily)

  const tokenUsage = {
    periodStart,
    through,
    stats: {
      all: statsFor(
        allDaily,
        periodStart,
        through,
        Math.max(codex.longestMs, claude.longestMs),
        codex.calls + claude.calls,
        codex.files + claude.files
      ),
      codex: statsFor(codexDaily, periodStart, through, codex.longestMs, codex.calls, codex.files),
      claude: statsFor(claudeDaily, periodStart, through, claude.longestMs, claude.calls, claude.files),
    },
    daily: {
      codex: codexDaily,
      claude: claudeDaily,
    },
  }

  const changed = updateIndex(tokenUsage)
  maybeCommitAndPush(changed)

  console.log(
    `${changed ? 'Updated' : 'Already current'} token activity: ${periodStart} to ${through}, ${tokenUsage.stats.all.total.toLocaleString(
      'en-IE'
    )} tokens.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
