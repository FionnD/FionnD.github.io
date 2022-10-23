import Head from 'next/head'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({ children, ...props }) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({ title, href, children }) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export default function Uses() {
  return (
    <>
      <Head>
        <title>Resume - Fionn Delahunty</title>
        <meta
          name="description"
          content="My current resume."
        />
      </Head>
      <SimpleLayout
        title="Resume"
      >
        <div className="space-y-20">
          <ToolsSection title="Education">
            <Tool title="MSc Applied Data Science">
              2017 - 2019. University of Gothenburg | Chalmers University of Technology.
            </Tool>
            <Tool title="BA Psychology">
              2013 - 2016. University of Galway, Ireland
            </Tool>
          </ToolsSection>
          <ToolsSection title="Experience">
            <Tool title="Co-founder (product lead)">
              2021 (August) - Current. University of Galway
            </Tool>
            <Tool title=" Technical Product Manager">
              2021 - 2021 (August). Jina AI
            </Tool>
            <Tool title="Product Manager / Data Scientist">
              2020-2021. MindDoc (formerly Moodpath)
            </Tool>
              <Tool title="Researcher Scientist">
                  2018 - 2020. Insight Centre for Data Analytics
              </Tool>
          </ToolsSection>
          <ToolsSection title="Researcher Scientist">
            <Tool title="Figma">
              2018 - 2020. Insight Centre for Data Analytics
            </Tool>
          </ToolsSection>
          <ToolsSection title="Productivity">
            <Tool title="Alfred">
              It’s not the newest kid on the block but it’s still the fastest.
              The Sublime Text of the application launcher world.
            </Tool>
            <Tool title="Reflect">
              Using a daily notes system instead of trying to keep things
              organized by topics has been super powerful for me. And with
              Reflect, it’s still easy for me to keep all of that stuff
              discoverable by topic even though all of my writing happens in the
              daily note.
            </Tool>
            <Tool title="SavvyCal">
              Great tool for scheduling meetings while protecting my calendar
              and making sure I still have lots of time for deep work during the
              week.
            </Tool>
            <Tool title="Focus">
              Simple tool for blocking distracting websites when I need to just
              do the work and get some momentum going.
            </Tool>
          </ToolsSection>
        </div>
      </SimpleLayout>
    </>
  )
}
