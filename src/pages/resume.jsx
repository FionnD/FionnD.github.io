import Head from 'next/head'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import nuiglogo from "@/images/logos/ug.png";
import gulogo from "@/images/logos/Goteborgs_universitet_seal.svg.png"
import jinalogo from "@/images/logos/jina.png"
import minddoclogo from "@/images/logos/minddoc.png"
import insightlogo from "@/images/logos/insight.jpeg"
import clsx from "clsx";
import Image from "next/future/image";



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
                title="Resume">

                <h3 className="font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl">
                    Education
                </h3>
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-right">
                                <div >
                                    <table className="min-w-full ">
                                        <thead >
                                        <tr></tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <Image
                                                    src={gulogo}
                                                    alt=""
                                                    sizes={true ? '4rem' : '2.25rem'}
                                                    className={clsx(
                                                        'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
                                                        true ? 'h-16 w-16' : 'h-9 w-9'
                                                    )}
                                                    priority
                                                />

                                            </td>
                                            <td>2017 - 2019</td>
                                            <td>MSc Applied Data Science</td>
                                        </tr>
                                        <tr>
                                            <td><Image
                                                src={nuiglogo}
                                                alt=""
                                                sizes={true ? '4rem' : '2.25rem'}
                                                className={clsx(
                                                    'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
                                                    true ? 'h-16 w-16' : 'h-9 w-9'
                                                )}
                                                priority
                                            />
                                            </td>
                                            <td>2013-2016</td>
                                            <td>BA Psychology</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
                <br></br>
                <h3 className="font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-3xl">
                    Experience
                </h3>
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-right">
                                <div >
                                    <table className="min-w-full ">
                                        <thead >
                                        <tr></tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <Image
                                                    src={nuiglogo}
                                                    alt=""
                                                    sizes={true ? '4rem' : '2.25rem'}
                                                    className={clsx(
                                                        'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
                                                        true ? 'h-16 w-16' : 'h-9 w-9'
                                                    )}
                                                    priority
                                                />
                                            </td>
                                            <td>2021-Present</td>
                                            <td><h1 className="text-m font-semibold text-gray-900">Commercialisation Lead</h1>University of Galway</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Image
                                                    src={jinalogo}
                                                    alt=""
                                                    sizes={true ? '4rem' : '2.25rem'}
                                                    className={clsx(
                                                        'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
                                                        true ? 'h-16 w-16' : 'h-9 w-9'
                                                    )}
                                                    priority
                                                />
                                            </td>
                                            <td>2021-2021</td>
                                            <td><h1 className="text-m font-semibold text-gray-900">Technical Product Manager</h1>Jina AI</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Image
                                                    src={minddoclogo}
                                                    alt=""
                                                    sizes={true ? '4rem' : '2.25rem'}
                                                    className={clsx(
                                                        'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
                                                        true ? 'h-16 w-16' : 'h-9 w-9'
                                                    )}
                                                    priority
                                                />
                                            </td>
                                            <td>2020-2021</td>
                                            <td><h1 className="text-m font-semibold text-gray-900">Technical Product Manager</h1>MindDoc</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Image
                                                    src={insightlogo}
                                                    alt=""
                                                    sizes={true ? '4rem' : '2.25rem'}
                                                    className={clsx(
                                                        'rounded-full bg-zinc-100 object-cover dark:bg-zinc-800',
                                                        true ? 'h-14 w-14' : 'h-9 w-9'
                                                    )}
                                                    priority
                                                />
                                            </td>
                                            <td>2018-2020</td>
                                            <td><h1 className="text-m font-semibold text-gray-900">Researcher in Natural Language Processing </h1>The Insight Centre for Data Analytic</td>
                                        </tr>



                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </SimpleLayout>
        </>






)
}
