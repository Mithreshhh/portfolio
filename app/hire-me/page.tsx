import type { Metadata } from 'next';
import HireCard from '@/components/HireCard';
import SectionTitle from '@/components/SectionTitle';
import TransitionLink from '@/components/TransitionLink';
import { EDUCATION, EXPERIENCE, PRINCIPLES, PROJECTS } from '@/lib/data';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Hire Mithresh Uttarwar - Full Stack Developer',
    description:
        'Mithresh Uttarwar is open to internships and freelance work: React, Next.js, Node.js and REST APIs, with live products to show for it.',
};

// Everything here is drawn from lib/data.ts, so this page never claims more than the résumé does.
const HireMePage = () => {
    const current = EXPERIENCE.find((e) => e.end === null);
    const degree = EDUCATION[0];
    const live = PROJECTS.filter((p) => p.status === 'live');

    const facts = [
        { label: 'Based in', value: 'Hyderabad, India' },
        ...(current ? [{ label: 'Now', value: `${current.role} @ ${current.company.split(' ')[0]}` }] : []),
        { label: 'Studying', value: `${degree.degree.replace(' — ', ', ')} · ${degree.period.split(' – ')[1]}` },
        { label: 'Open to', value: 'Internships · Freelance' },
    ];

    return (
        <section className="pb-16 pt-16 md:pb-section md:pt-24">
            <div className="container">
                <SectionTitle title="Hire me" />

                <div className="grid gap-12 md:grid-cols-12 md:gap-8">
                    <div className="min-w-0 md:col-span-7">
                        <h1 className="font-anton text-[56px] uppercase leading-[0.92] sm:text-7xl lg:text-[88px]">
                            <span className="block text-foreground">Work</span>
                            <span className="text-outline block">with me</span>
                        </h1>

                        <p className="mt-7 max-w-[560px] text-base leading-relaxed text-muted-foreground md:text-lg">
                            I&apos;m open to internships and freelance work.
                            {current && (
                                <>
                                    {' '}
                                    Right now I&apos;m a {current.role} at {current.company}, building production LMS
                                    infrastructure.
                                </>
                            )}{' '}
                            Next, I want to work on products that make learning measurably better, with a team that
                            cares about the details.
                        </p>

                        <h2 className="mt-14 font-anton text-2xl uppercase tracking-wide">How I work</h2>
                        <ul className="mt-4 divide-y divide-border/50 border-y border-border/50">
                            {PRINCIPLES.map((p) => (
                                <li key={p.title} className="grid gap-1 py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
                                    <p className="font-medium text-foreground">{p.title}</p>
                                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                                        {p.detail}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <h2 className="mt-14 font-anton text-2xl uppercase tracking-wide">Live right now</h2>
                        <ul className="mt-4 divide-y divide-border/50 border-y border-border/50">
                            {live.map((p) => (
                                <li
                                    key={p.slug}
                                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-4"
                                >
                                    <div className="min-w-0">
                                        <p className="font-anton text-xl uppercase tracking-wide sm:text-2xl">
                                            {p.title}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {p.role} · {p.year}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-5 text-sm">
                                        {p.liveUrl && (
                                            <a
                                                href={p.liveUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 text-foreground underline-offset-4 hover:underline"
                                            >
                                                Live site
                                                <ArrowUpRight size={13} aria-hidden="true" />
                                            </a>
                                        )}
                                        <TransitionLink
                                            href={`/projects/${p.slug}`}
                                            className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            Case study
                                            <ArrowRight
                                                size={14}
                                                aria-hidden="true"
                                                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                                            />
                                        </TransitionLink>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact stays in view while the evidence scrolls past it. */}
                    <aside className="min-w-0 md:col-span-5 md:pl-6 lg:pl-12">
                        <div className="md:sticky md:top-24">
                            <HireCard primaryAction="email" />

                            <dl className="mt-6 divide-y divide-border/50 border-y border-border/50">
                                {facts.map((f) => (
                                    <div key={f.label} className="grid grid-cols-[96px_1fr] gap-4 py-3 text-sm">
                                        <dt className="text-[11px] uppercase leading-6 tracking-[0.2em] text-muted-foreground">
                                            {f.label}
                                        </dt>
                                        <dd className="leading-6 text-foreground/90">{f.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default HireMePage;
