#!/bin/zsh
set -euo pipefail

REPO="/Users/fionn/Documents/FionnD.github.io"
NODE_BIN="/opt/homebrew/bin/node"
WORKTREE="$(mktemp -d /private/tmp/fionnd-token-activity.XXXXXX)"

cleanup() {
  git -C "$REPO" worktree remove --force "$WORKTREE" >/dev/null 2>&1 || true
}

trap cleanup EXIT

git -C "$REPO" fetch origin main
git -C "$REPO" worktree add --detach "$WORKTREE" origin/main

cd "$WORKTREE"
"$NODE_BIN" scripts/update-token-activity.js

if git diff --quiet -- index.html; then
  echo "Token activity graph already current."
  exit 0
fi

git add index.html
git commit -m "Update token usage graph"
git push origin HEAD:main
