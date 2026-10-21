'use client';
import { Diagram, useReducedMotion } from '@/components/HeroBlueprint';
import SectionTitle from '@/components/SectionTitle';
import { BLUEPRINTS, EXPERIENCE, PROJECTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { AppWindow, ArrowUpRight, Cloud, Database, Server, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CYCLE_MS = 9000;

// What the shapes in a diagram mean, so a reader can follow one without a key in their head.
const LEGEND = [
    { icon: Users, label: 'People', hint: 'who uses it' },
    { icon: AppWindow, label: 'App', hint: 'what they touch' },
    { icon: Server, label: 'Service', hint: 'what I wrote' },
    { icon: Database, label: 'Store', hint: 'where data lives' },
    { icon: Cloud, label: 'Third party', hint: 'dashed: not mine' },
];

/** The tools behind a blueprint, taken from the matching project or job rather than retyped. */
const stackFor = (href?: string) => {
    if (!href) return [];
    if (href.startsWith('/projects/'))
        return PROJECTS.find((p) => p.slug === href.slice('/projects/'.length))?.techStack ?? [];
    if (href === '#my-experience') return EXPERIENCE[0].stack;
    return [];
};

const Systems = () => {
    const container = useRef<HTMLDivElement>(null);
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const reduced = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [inView, setInView] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);
    const bp = BLUEPRINTS[index];
    const stack = stackFor(bp.href);
    const external = bp.href?.startsWith('http');

    // Hovering a node lights it and everything one hop away, so the data path reads at a glance.
    const highlight = useMemo(() => {
        if (!hovered) return undefined;
        const ids = new Set([hovered]);
        bp.edges.forEach((e) => {
            if (e.from === hovered) ids.add(e.to);
            if (e.to === hovered) ids.add(e.from);
        });
        return [...ids];
    }, [hovered, bp]);

    useEffect(() => {
        const el = container.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => setInView(entries.some((e) => e.isIntersecting)), {
            threshold: 0.15,
        });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Auto-advance only while on screen and unattended.
    useEffect(() => {
        if (reduced || paused || !inView || hovered) return;
        const t = window.setTimeout(() => {
            if (!document.hidden) setIndex((i) => (i + 1) % BLUEPRINTS.length);
        }, CYCLE_MS);
        return () => window.clearTimeout(t);
    }, [reduced, paused, inView, hovered, index]);

    useGSAP(
        () => {
            gsap.from('.sys-in', {
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

    const cycling = !reduced && !paused && inView && !hovered;

    return (
        <section className="py-16 md:py-section" id="systems">
            <div className="container" ref={container}>
                <SectionTitle title="Under the hood" />

                <p className="sys-in mb-8 max-w-[560px] text-base text-muted-foreground md:text-lg">
                    How the things above are actually put together. Every box is something that shipped; hover one to
                    trace what it talks to.
                </p>

                <div
                    className="sys-in grid gap-6 md:grid-cols-12 md:gap-8"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
                    }}
                >
                    {/* Selector: one row per system, the active one carrying the auto-advance hairline. */}
                    <ol role="tablist" aria-label="Systems I've built" className="md:col-span-4 md:self-start">
                        {BLUEPRINTS.map((b, i) => {
                            const active = i === index;
                            return (
                                <li key={b.key} className="relative border-t border-border/50 last:border-b">
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setIndex(i)}
                                        className={cn(
                                            'group flex w-full items-baseline justify-between gap-4 py-3.5 text-left transition-colors duration-150 ease-out md:py-4',
                                            active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        <span className="min-w-0">
                                            <span className="block font-anton text-xl uppercase leading-none tracking-wide sm:text-2xl">
                                                {b.title}
                                            </span>
                                            <span className="mt-1.5 block text-xs">{b.tag}</span>
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'size-1.5 shrink-0 self-center rounded-full transition-transform duration-200 ease-out',
                                                active
                                                    ? 'scale-100 bg-foreground'
                                                    : 'scale-0 bg-foreground/40 group-hover:scale-100',
                                            )}
                                        />
                                    </button>
                                    {active && cycling && (
                                        <span
                                            key={`${b.key}-bar`}
                                            aria-hidden="true"
                                            className="absolute bottom-0 left-0 h-px w-full origin-left bg-foreground/70"
                                            style={{ animation: `bp-progress ${CYCLE_MS}ms linear forwards` }}
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ol>

                    {/* The diagram, big enough to read, on faint paper. */}
                    <div className="min-w-0 md:col-span-8">
                        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/70">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]"
                            />
                            <div className="relative flex items-start justify-between gap-4 px-4 pt-4 sm:px-5">
                                <div className="min-w-0">
                                    <h3 className="font-anton text-2xl uppercase leading-none tracking-wide sm:text-3xl">
                                        {bp.title}
                                    </h3>
                                    <p className="mt-1.5 text-xs text-muted-foreground">{bp.tag}</p>
                                </div>
                                {bp.href && (
                                    <Link
                                        href={bp.href}
                                        target={external ? '_blank' : undefined}
                                        rel={external ? 'noreferrer' : undefined}
                                        className="inline-flex shrink-0 items-center gap-1 text-xs text-foreground underline-offset-4 hover:underline"
                                    >
                                        {external ? 'Open' : bp.href.startsWith('#') ? 'In the timeline' : 'Case study'}
                                        <ArrowUpRight size={12} aria-hidden="true" />
                                    </Link>
                                )}
                            </div>

                            {/* Remounted per blueprint so nodes replay their entrance; scrolls sideways on phones. */}
                            <div
                                key={bp.key}
                                className="relative overflow-x-auto px-2 pt-1 [scrollbar-width:thin]"
                                data-lenis-prevent-wheel
                            >
                                <Diagram
                                    bp={bp}
                                    animate={!reduced && inView}
                                    uid={`${uid}-${bp.key}`}
                                    highlight={highlight}
                                    onHoverNode={setHovered}
                                    className="min-w-[560px] sm:min-w-0"
                                />
                            </div>

                            <ul className="relative flex flex-wrap gap-x-4 gap-y-1 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground sm:px-5">
                                {bp.facts.map((f) => (
                                    <li key={f} className="flex items-center gap-1.5">
                                        <span className="size-1 rounded-full bg-foreground/70" aria-hidden="true" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4 flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
                            {stack.length > 0 && (
                                <ul className="flex flex-wrap gap-1.5" aria-label={`${bp.title} stack`}>
                                    {stack.map((tech) => (
                                        <li
                                            key={tech}
                                            className="rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground"
                                        >
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <ul
                                className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground"
                                aria-label="Diagram key"
                            >
                                {LEGEND.map(({ icon: Icon, label, hint }) => (
                                    <li key={label} className="flex items-center gap-1.5" title={hint}>
                                        <Icon size={13} strokeWidth={1.6} aria-hidden="true" />
                                        {label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Systems;
