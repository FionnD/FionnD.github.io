import Head from 'next/head'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function SpeakingSection({ children, ...props }) {
    return (
        <Section {...props}>
            <div className="space-y-16">{children}</div>
        </Section>
    )
}

function Appearance({ title, description, event, cta, href }) {
    return (
        <Card as="article">
            <Card.Title as="h3" href={href}>
                {title}
            </Card.Title>
            <Card.Eyebrow decorate>{event}</Card.Eyebrow>
            <Card.Description>{description}</Card.Description>
            <Card.Cta>{cta}</Card.Cta>
        </Card>
    )
}

export default function Speaking() {
    return (
        <>
            <Head>
                <title>Publications - Fionn Delahunty</title>
                <meta
                    name="description"
                    content="Academic publications and conferences I've spoken at. "
                />
            </Head>
            <SimpleLayout
                title="Academic publications and conferences i've spoken at"
            >
                <div className="space-y-20">
                    <SpeakingSection title="Publications">
                        <Appearance
                            href="#"
                            title="Passive Diagnosis of Mental Health Disorders Incorporating an Empathic Dialogue System"
                            description="Depression and anxiety are the two most prevalent mental health disorders worldwide, impacting the lives of millions of people each year. Current screening methods require individuals to manually complete psychometric questionnaires. In this work we develop a deep learning approach to predict psychometric scores given textual data through the use of psycholinguistics features. Data is collected via a dialogue system, were we develop and incorporate an approach to model empathy. Which aims to allow for appropriate use of these systems in a clinical setting. Following a public evaluation, we demonstrate that our approach to model empathy can out perform a similarly trained non empathic approach. Additionally, we show that our deep learning prediction approach performed well on evaluation data, but has diﬃculty generalizing to experimentally collected data. Limitations and implications as a result of this work are discussed."
                            event="Pending Publication"
                        />
                        <Appearance
                            href="https://aclanthology.org/W19-3205/"
                            title="Passive Diagnosis incorporating the PHQ-4 for Depression and Anxiety"
                            description="Depression and anxiety are the two most prevalent mental health disorders worldwide, impacting the lives of millions of people each year. In this work, we develop and evaluate a multilabel, multidimensional deep neural network designed to predict PHQ-4 scores based on individuals written text. Our system outperforms random baseline metrics and provides a novel approach to how we can predict psychometric scores from written text. Additionally, we explore how this architecture can be applied to analyse social media data."
                            event="ACL 2019"
                            cta="Access"
                        />
                    </SpeakingSection>
                    <SpeakingSection title="Conferences">
                        <Appearance
                            href="#"
                            title="Passive prediction of Mental health illness through Artificial Intelligence"
                            description=""
                            event="European conference on Mental Health"
                            cta=""
                        />
                        <Appearance
                            href="#"
                            title="Passive Diagnosis incorporating the PHQ-4 for Depression and Anxiety"
                            description=""
                            event="ACL,2019"
                            cta=""
                        />
                        <Appearance
                            href="#"
                            title="Using clickers to predict students final courses grades, an artificial intelligence approach"
                            description=""
                            event="8th Conference on teaching and learning in Chalmers, 2019"
                            cta=""
                        />
                        <Appearance
                            href="#"
                            title="First Insights on a Passive Major Depressive Disorder Prediction System with Incorporated Conversational Chatbot"
                            description=""
                            event="26th Irish Conference on Artificial Intelligence and Cognitive Science"
                            cta=""
                        />
                        <Appearance
                            href="#"
                            title="Assessing the effects of internet-related drug urges on inhibition using an anti-saccade task"
                            description=""
                            event="Psychological Society of Ireland, Student Conference,2016"
                            cta=""
                        />
                    </SpeakingSection>
                </div>
            </SimpleLayout>
        </>
    )
}
