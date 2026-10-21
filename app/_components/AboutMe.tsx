'use client';
import HireCard from '@/components/HireCard';
import SectionTitle from '@/components/SectionTitle';
import { ACHIEVEMENTS, EDUCATION, EXPERIENCE, PRINCIPLES, PROJECTS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Gauge, ShieldCheck, Users } from 'lucide-react';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One icon per principle in lib/data.ts, in the same order.
const PRINCIPLE_ICONS = [Users, Gauge, ShieldCheck];

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);
    const current = EXPERIENCE.find((e) => e.end === null);
    const degree = EDUCATION[0];
    const liveCount = PROJECTS.filter((p) => p.status === 'live').length;

    const facts: { label: string; value: React.ReactNode }[] = [
        { label: 'Based in', value: 'Hyderabad, India' },
        { label: 'Studying', value: `${degree.degree.replace(' — ', ', ')} · ${degree.period.split(' – ')[1]}` },
        ...(current ? [{ label: 'Now', value: `${current.role} @ ${current.company.split(' ')[0]}` }] : []),
        { label: 'Shipped', value: `${liveCount} live products` },
        { label: 'Wins', value: ACHIEVEMENTS[0].title + ' · ' + ACHIEVEMENTS[0].detail },
        { label: 'Open to', value: 'Internships · Freelance' },
    ];

    useGSAP(
        () => {
            gsap.from('.about-in', {
                y: 28,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: { trigger: container.current, start: 'top 80%', once: true },
            });
        },
        { scope: container },
    );

    return (
        <section className="pb-16 md:pb-section" id="about-me">
            <div className="container" ref={container}>
                <SectionTitle title="About me" />

                <div className="grid gap-10 md:grid-cols-12 md:gap-8">
                    {/* Who I am, in three short paragraphs that don't repeat the hero. */}
                    <div className="md:col-span-7">
                        <h3 className="about-in font-anton text-3xl uppercase leading-none tracking-wide sm:text-4xl">
                            Hi, I&apos;m Mithresh.
                        </h3>
                        <div className="mt-5 max-w-[560px] space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                            <p className="about-in">
                                I&apos;m a final-year computer science student who would rather ship something to real
                                people than build another demo. Most of what I know, I learned by putting a product in
                                front of users and fixing what broke.
                            </p>
                            <p className="about-in">
                                Right now that means LMS infrastructure at Menler: a PDF reader, Google Drive
                                automation, and assessment scoring, used by around 30 people so far. Before that, client
                                sites at Sleek Sky, and my major project: a browser agent that blacks out faces and
                                personal data on-device before any AI sees the page.
                            </p>
                            <p className="about-in">
                                Next, I want to work on products that make learning measurably better, with a team that
                                cares about the details.
                            </p>
                        </div>

                        <ul className="about-in mt-8 grid gap-3 sm:grid-cols-3" aria-label="How I work">
                            {PRINCIPLES.map(({ title, detail }, i) => {
                                const Icon = PRINCIPLE_ICONS[i];
                                return (
                                    <li
                                        key={title}
                                        className="rounded-xl border border-border/50 bg-background-light/20 p-4 backdrop-blur-sm"
                                    >
                                        <Icon size={18} className="text-foreground" aria-hidden="true" />
                                        <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
                                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* The facts a recruiter scans for, in one column. */}
                    <aside className="about-in md:col-span-5 md:pl-6 lg:pl-12">
                        <dl className="divide-y divide-border/50 border-y border-border/50">
                            {facts.map((f) => (
                                <div key={f.label} className="grid grid-cols-[96px_1fr] gap-4 py-3 text-sm">
                                    <dt className="text-[11px] uppercase leading-6 tracking-[0.2em] text-muted-foreground">
                                        {f.label}
                                    </dt>
                                    <dd className="leading-6 text-foreground/90">{f.value}</dd>
                                </div>
                            ))}
                        </dl>

                        <HireCard className="mt-6" />
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
