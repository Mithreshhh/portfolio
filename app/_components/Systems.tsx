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
import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

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

    // Depth: the card tilts toward the pointer and its layers sit at different z-depths, so the
    // grid, the diagram and the chrome parallax against each other. Mouse only; touch and
    // reduced-motion visitors get the flat card.
    const cardRef = useRef<HTMLDivElement>(null);
    const raf = useRef(0);
    const [canTilt, setCanTilt] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
        const on = () => setCanTilt(mq.matches && !reduced);
        on();
        mq.addEventListener('change', on);
        return () => mq.removeEventListener('change', on);
    }, [reduced]);

    const onPointerMove = useCallback(
        (e: PointerEvent<HTMLDivElement>) => {
            if (!canTilt || !cardRef.current) return;
            const r = cardRef.current.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            cancelAnimationFrame(raf.current);
            raf.current = requestAnimationFrame(() => {
                const el = cardRef.current;
                if (!el) return;
                el.style.transform = `rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
                el.style.setProperty('--glare-x', `${((px + 0.5) * 100).toFixed(1)}%`);
                el.style.setProperty('--glare-y', `${((py + 0.5) * 100).toFixed(1)}%`);
            });
        },
        [canTilt],
    );
    const resetTilt = useCallback(() => {
        cancelAnimationFrame(raf.current);
        const el = cardRef.current;
        if (el) el.style.transform = '';
    }, []);
    useEffect(() => () => cancelAnimationFrame(raf.current), []);

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
    const lift = (z: number) => (canTilt ? { transform: `translateZ(${z}px)` } : undefined);

    return (
        <section className="py-16 md:py-section" id="systems">
            <div className="container" ref={container}>
                <SectionTitle title="Under the hood" />

                <p className="sys-in mb-8 max-w-[560px] text-base text-muted-foreground md:text-lg">
                    How the things above are actually put together. Every box is something that shipped; hover one to
                    trace what it talks to.
                </p>

                <div
                    className="sys-in grid gap-6 lg:grid-cols-12 lg:gap-8"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
                    }}
                >
                    {/* Selector: one row per system, the active one carrying the auto-advance hairline.
                        Below lg it sits above the card as a 2×2 block so the diagram keeps the full width. */}
                    <ol
                        role="tablist"
                        aria-label="Systems I've built"
                        className="grid grid-cols-2 gap-x-6 border-b border-border/50 sm:grid-cols-4 lg:col-span-4 lg:block lg:self-start"
                    >
                        {BLUEPRINTS.map((b, i) => {
                            const active = i === index;
                            return (
                                <li key={b.key} className="relative border-t border-border/50">
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setIndex(i)}
                                        className={cn(
                                            'group flex w-full items-baseline justify-between gap-4 py-3.5 text-left transition-colors duration-150 ease-out lg:py-4',
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

                    {/* The glass card: tilts toward the pointer, with the grid behind and the diagram in front. */}
                    <div className="min-w-0 lg:col-span-8">
                        <div className="[perspective:1400px]">
                            <div
                                ref={cardRef}
                                className={cn(
                                    'relative overflow-hidden rounded-2xl border border-border/60 bg-background/90 shadow-[0_30px_80px_-40px_hsl(var(--foreground)/0.25)] transition-transform duration-500 ease-out will-change-transform',
                                    canTilt && '[transform-style:preserve-3d]',
                                )}
                                style={{ '--glare-x': '50%', '--glare-y': '30%' } as CSSProperties}
                                onPointerMove={onPointerMove}
                                onPointerLeave={resetTilt}
                            >
                                {/* Faint grid, like paper, pushed back so it drifts behind the diagram on tilt. */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]"
                                    style={canTilt ? { transform: 'translateZ(-40px) scale(1.04)' } : undefined}
                                />
                                {/* Glare that follows the pointer, like light on a glass panel. */}
                                {canTilt && (
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(300px_circle_at_var(--glare-x)_var(--glare-y),hsl(var(--foreground)/0.09),transparent_70%)]"
                                        style={{ transform: 'translateZ(60px)' }}
                                    />
                                )}

                                <div
                                    className="relative flex items-start justify-between gap-4 px-4 pt-4 sm:px-5"
                                    style={lift(16)}
                                >
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

                                {/* Remounted per blueprint so nodes replay their entrance. Capped width so it never
                                    stretches thin on a tablet; scrolls sideways on phones. Deliberately no
                                    data-lenis-prevent-wheel: that swallows the page scroll under the pointer. */}
                                <div
                                    key={bp.key}
                                    className="relative overflow-x-auto px-2 pt-1 [scrollbar-width:thin]"
                                    style={lift(44)}
                                >
                                    <Diagram
                                        bp={bp}
                                        animate={!reduced && inView}
                                        uid={`${uid}-${bp.key}`}
                                        highlight={highlight}
                                        onHoverNode={setHovered}
                                        className="mx-auto min-w-[560px] max-w-[760px] sm:min-w-0"
                                    />
                                </div>

                                <ul
                                    className="relative flex flex-wrap gap-x-4 gap-y-1 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground sm:px-5"
                                    style={lift(16)}
                                >
                                    {bp.facts.map((f) => (
                                        <li key={f} className="flex items-center gap-1.5">
                                            <span className="size-1 rounded-full bg-foreground/70" aria-hidden="true" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
