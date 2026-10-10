'use client';
import SectionTitle from '@/components/SectionTitle';
import { ACHIEVEMENTS, EDUCATION, EXPERIENCE, OTHER_WORK, type ExperienceEntry, type ExperienceType } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowUpRight, Briefcase, GraduationCap, Trophy, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef, type ReactNode } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TYPE_STYLE: Record<ExperienceType, string> = {
    Current: 'border-primary/40 bg-primary/10 text-primary',
    Internship: 'border-secondary/40 bg-secondary/10 text-secondary',
    Leadership: 'border-accent/40 bg-accent/10 text-accent',
};

const TimelineItem = ({ entry }: { entry: ExperienceEntry }) => {
    const current = entry.end === null;
    return (
        <li className="exp-item relative grid grid-cols-[auto_1fr] gap-x-5 gap-y-0 sm:gap-x-8">
            {/* Dot on the rail */}
            <div className="relative flex w-4 justify-center pt-7 sm:w-6">
                <span
                    className={cn(
                        'relative z-10 block size-3 rounded-full',
                        current
                            ? 'bg-primary shadow-[0_0_0_4px_hsl(var(--background)),0_0_0_10px_hsl(var(--primary)/0.2)]'
                            : 'bg-border ring-4 ring-background',
                    )}
                >
                    {current && (
                        <span className="absolute inset-0 animate-ping rounded-full bg-primary/70 motion-reduce:animate-none" />
                    )}
                </span>
            </div>

            <article
                className={cn(
                    'relative mb-8 overflow-hidden rounded-2xl border bg-background-light/20 p-5 backdrop-blur-sm transition-colors sm:p-7',
                    current ? 'border-primary/40' : 'border-border/50 hover:border-border',
                )}
            >
                {current && (
                    <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-gradient-to-br from-primary/25 to-transparent blur-3xl" />
                )}

                <header className="relative flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-anton text-2xl uppercase leading-none tracking-wide sm:text-3xl">
                                {entry.role}
                            </h3>
                            <span
                                className={cn(
                                    'rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider',
                                    TYPE_STYLE[entry.type],
                                )}
                            >
                                {entry.type}
                            </span>
                        </div>
                        <p className="mt-2 text-base text-foreground/90">
                            {entry.url ? (
                                <a
                                    href={entry.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group hover:text-primary smooth-transition"
                                >
                                    {entry.company}
                                    <ArrowUpRight
                                        size={15}
                                        aria-hidden="true"
                                        className="ml-1 inline-block align-[-2px] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </a>
                            ) : (
                                entry.company
                            )}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{entry.summary}</p>
                    </div>

                    <p
                        className={cn(
                            'shrink-0 rounded-full border px-3 py-1 text-sm tabular-nums',
                            current ? 'border-primary/40 text-foreground' : 'border-border/60 text-muted-foreground',
                        )}
                    >
                        {entry.start} – {entry.end ?? 'Present'}
                    </p>
                </header>

                <ul className="relative mt-5 space-y-2.5">
                    {entry.highlights.map((h, i) => (
                        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-foreground/85">
                            <span
                                aria-hidden="true"
                                className="mt-[0.7em] block size-1.5 shrink-0 rounded-full bg-primary/70"
                            />
                            <span>{h}</span>
                        </li>
                    ))}
                </ul>

                {entry.stack.length > 0 && (
                    <ul className="relative mt-5 flex flex-wrap gap-2">
                        {entry.stack.map((s) => (
                            <li
                                key={s}
                                className="rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground"
                            >
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </article>
        </li>
    );
};

const InfoCard = ({
    icon: Icon,
    title,
    children,
    className,
}: {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
    className?: string;
}) => (
    <article
        className={cn(
            'exp-card relative overflow-hidden rounded-2xl border border-border/50 bg-background-light/20 p-6 backdrop-blur-sm',
            className,
        )}
    >
        <header className="mb-5 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Icon size={18} />
            </span>
            <h3 className="font-anton text-2xl uppercase leading-none tracking-wide">{title}</h3>
        </header>
        {children}
    </article>
);

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLOListElement>(null);

    useGSAP(
        () => {
            // The rail draws itself as the timeline scrolls through the viewport.
            gsap.fromTo(
                '.exp-rail',
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: timelineRef.current,
                        start: 'top 75%',
                        end: 'bottom 70%',
                        scrub: 0.6,
                    },
                },
            );

            gsap.utils.toArray<HTMLElement>('.exp-item').forEach((item) => {
                gsap.from(item, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: item, start: 'top 85%', once: true },
                });
            });

            gsap.from('.exp-card', {
                y: 32,
                opacity: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: { trigger: '.exp-cards', start: 'top 85%', once: true },
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="py-20 md:py-section" id="my-experience">
            <div className="container" ref={containerRef}>
                <SectionTitle title="My Experience" />

                <div className="relative">
                    {/* Rail: sits behind the dots, drawn by scroll. */}
                    <div
                        aria-hidden="true"
                        className="exp-rail absolute bottom-8 left-[7px] top-7 w-0.5 origin-top bg-gradient-to-b from-primary via-secondary/70 to-border sm:left-[11px]"
                    />
                    <ol ref={timelineRef} className="relative" aria-label="Work experience">
                        {EXPERIENCE.map((entry) => (
                            <TimelineItem key={entry.company + entry.role} entry={entry} />
                        ))}
                    </ol>
                </div>

                <div className="exp-cards mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoCard icon={GraduationCap} title="Education" className="sm:col-span-2 lg:col-span-1">
                        <ol className="space-y-4">
                            {EDUCATION.map((e) => (
                                <li key={e.degree} className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-medium leading-snug">{e.degree}</p>
                                        <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{e.school}</p>
                                        <p className="mt-0.5 text-xs tabular-nums text-muted-foreground/80">{e.period}</p>
                                    </div>
                                    <span className="shrink-0 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
                                        {e.score}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </InfoCard>

                    <InfoCard icon={Trophy} title="Achievements">
                        <ul className="space-y-3.5">
                            {ACHIEVEMENTS.map((a) => (
                                <li key={a.title} className="flex gap-3">
                                    <span
                                        aria-hidden="true"
                                        className="mt-[0.55em] block size-1.5 shrink-0 rounded-full bg-secondary"
                                    />
                                    <div>
                                        <p className="font-medium leading-snug">{a.title}</p>
                                        <p className="text-sm text-muted-foreground">{a.detail}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </InfoCard>

                    <InfoCard icon={Briefcase} title="Also">
                        <ul className="space-y-3.5">
                            {OTHER_WORK.map((o) => (
                                <li key={o.title} className="flex gap-3">
                                    <span
                                        aria-hidden="true"
                                        className="mt-[0.55em] block size-1.5 shrink-0 rounded-full bg-accent"
                                    />
                                    <div>
                                        <p className="font-medium leading-snug">{o.title}</p>
                                        <p className="text-sm text-muted-foreground">{o.detail}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-5 text-sm text-muted-foreground">
                            Open to internships and freelance work —{' '}
                            <Link href="/hire-me" className="text-primary underline-offset-4 hover:underline">
                                let&apos;s talk
                            </Link>
                            .
                        </p>
                    </InfoCard>
                </div>
            </div>
        </section>
    );
};

export default Experiences;
