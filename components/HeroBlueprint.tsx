'use client';
import { BLUEPRINTS, type Blueprint, type BlueprintKind, type BlueprintNode } from '@/lib/data';
import { cn } from '@/lib/utils';
import { AppWindow, ArrowUpRight, Cloud, Database, Server, Users, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

/**
 * Animated blueprints of the systems Mithresh has actually built, cycling
 * through the entries in BLUEPRINTS. Pure SVG + CSS: no WebGL, no canvas.
 * Requests travel the edges with a CSS offset-path animation; under reduced motion the
 * diagram is static and the cycling stops.
 */

const VB = { w: 640, h: 360 };
const NODE = { w: 134, h: 46 };
const NOTE = { w: 150, h: 38 };
const CYCLE_MS = 8000;

const KIND_CLASS: Record<BlueprintKind, string> = {
    actor: 'fill-background stroke-muted-foreground',
    app: 'fill-foreground stroke-foreground',
    service: 'fill-background stroke-foreground',
    data: 'fill-background stroke-foreground',
    external: 'fill-background stroke-muted-foreground [stroke-dasharray:4_3]',
    note: 'fill-transparent stroke-transparent',
};

// A glyph per node kind, so a reader can tell people, apps, services, stores and third parties apart at a glance.
const KIND_ICON: Partial<Record<BlueprintKind, LucideIcon>> = {
    actor: Users,
    app: AppWindow,
    service: Server,
    data: Database,
    external: Cloud,
};

const size = (n: BlueprintNode) => (n.kind === 'note' ? NOTE : NODE);

/** Where an edge leaves/enters a node: the side facing the other node. */
const anchor = (from: BlueprintNode, to: BlueprintNode) => {
    const s = size(from);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (Math.abs(dx) * s.h > Math.abs(dy) * s.w) {
        return { x: from.x + Math.sign(dx) * (s.w / 2), y: from.y };
    }
    return { x: from.x, y: from.y + Math.sign(dy) * (s.h / 2) };
};

/** Orthogonal-ish path: horizontal run, then vertical, then horizontal. */
const edgePath = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    if (Math.abs(a.y - b.y) < 1 || Math.abs(a.x - b.x) < 1) return `M${a.x},${a.y} L${b.x},${b.y}`;
    const mx = (a.x + b.x) / 2;
    return `M${a.x},${a.y} L${mx},${a.y} L${mx},${b.y} L${b.x},${b.y}`;
};

export const useReducedMotion = () => {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const on = () => setReduced(mq.matches);
        on();
        mq.addEventListener('change', on);
        return () => mq.removeEventListener('change', on);
    }, []);
    return reduced;
};

export interface DiagramProps {
    bp: Blueprint;
    /** Run the request dots along the edges. Defaults to true; pass false under reduced motion. */
    animate?: boolean;
    /** Prefix for SVG ids so several diagrams can share a page. */
    uid?: string;
    /** Node ids to emphasise. Everything else fades; edges touching a highlighted node stay full. */
    highlight?: string[];
    className?: string;
}

/** The bare architecture diagram, shared by the hero and the case-study stepper. */
export const Diagram = ({ bp, animate = true, uid: uidProp, highlight, className }: DiagramProps) => {
    const byId = useMemo(() => Object.fromEntries(bp.nodes.map((n) => [n.id, n])), [bp]);
    const autoId = useId().replace(/[^a-zA-Z0-9]/g, '');
    const uid = uidProp ?? autoId;
    const focused = highlight && highlight.length > 0 ? new Set(highlight) : null;
    const dimNode = (id: string) => focused !== null && !focused.has(id);
    const dimEdge = (e: { from: string; to: string }) => focused !== null && !focused.has(e.from) && !focused.has(e.to);

    return (
        <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            className={cn('block h-auto w-full', className)}
            role="img"
            aria-label={`${bp.title} architecture: ${bp.nodes.map((n) => n.label).join(', ')}`}
        >
            <defs>
                <marker id={`${uid}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0.5 L7,4 L0,7.5" className="fill-none stroke-muted-foreground" strokeWidth="1" />
                </marker>
            </defs>

            {/* Edges */}
            {bp.edges.map((e, i) => {
                const a = byId[e.from];
                const b = byId[e.to];
                if (!a || !b) return null;
                const d = edgePath(anchor(a, b), anchor(b, a));
                const id = `${uid}-e${i}`;
                return (
                    <g key={id} className={cn('transition-opacity duration-300', dimEdge(e) && 'opacity-[0.35]')}>
                        <path id={id} d={d} className="fill-none stroke-border" strokeWidth="1" markerEnd={`url(#${uid}-arrow)`} />
                        {animate && (
                            // Halo and dot share one group so the compositor moves a single layer per edge.
                            <g className="bp-dot" style={{ offsetPath: `path("${d}")`, animationDelay: `${(i * 0.45).toFixed(2)}s` }}>
                                <circle r="7" className="fill-foreground/20" />
                                <circle r="2.6" className="fill-foreground" />
                            </g>
                        )}
                    </g>
                );
            })}

            {/* Nodes */}
            {bp.nodes.map((n, i) => {
                const s = size(n);
                const note = n.kind === 'note';
                const dark = n.kind === 'app';
                const Icon = KIND_ICON[n.kind];
                const tx = note ? 20 : Icon ? 34 : 12;
                // Position on the outer group; the entrance animation lives on an inner group, because a
                // CSS transform would otherwise override the SVG transform attribute and pile every node up.
                // Highlight dimming is plain opacity, so it is safe on the outer group.
                return (
                    <g
                        key={n.id}
                        transform={`translate(${n.x - s.w / 2}, ${n.y - s.h / 2})`}
                        className={cn('transition-opacity duration-300', dimNode(n.id) && 'opacity-[0.35]')}
                    >
                      <g className="bp-node" style={{ animationDelay: `${i * 70}ms` }}>
                        <rect width={s.w} height={s.h} rx="8" className={cn(KIND_CLASS[n.kind])} strokeWidth="1" />
                        {n.kind === 'data' && <line x1="0" y1="8" x2={s.w} y2="8" className="stroke-foreground/60" strokeWidth="1" />}
                        {note && <circle cx="10" cy={s.h / 2} r="2.5" className="fill-muted-foreground" />}
                        {Icon && (
                            // lucide renders an <svg>, which nests fine inside the diagram.
                            <Icon
                                x={11}
                                y={s.h / 2 - 8}
                                width={16}
                                height={16}
                                strokeWidth={1.6}
                                aria-hidden="true"
                                className={dark ? 'text-background' : 'text-muted-foreground'}
                            />
                        )}
                        <text
                            x={tx}
                            y={n.sub ? s.h / 2 - 3 : s.h / 2 + 4}
                            className={cn('font-medium', dark ? 'fill-background' : 'fill-foreground')}
                            fontSize="12.5"
                        >
                            {n.label}
                        </text>
                        {n.sub && (
                            <text x={tx} y={s.h / 2 + 12} className={dark ? 'fill-background/70' : 'fill-muted-foreground'} fontSize="10">
                                {n.sub}
                            </text>
                        )}
                      </g>
                    </g>
                );
            })}
        </svg>
    );
};

const HeroBlueprint = ({ className }: { className?: string }) => {
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const reduced = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [inView, setInView] = useState(true);
    const bp = BLUEPRINTS[index];

    // Auto-advance unless hovered/focused, hidden, or the visitor prefers reduced motion.
    useEffect(() => {
        if (reduced || paused) return;
        let t = 0;
        const tick = () => {
            if (!document.hidden) setIndex((i) => (i + 1) % BLUEPRINTS.length);
            t = window.setTimeout(tick, CYCLE_MS);
        };
        t = window.setTimeout(tick, CYCLE_MS);
        return () => window.clearTimeout(t);
    }, [reduced, paused, index]);

    const external = bp.href?.startsWith('http');

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

    // SMIL dots keep running off-screen otherwise, costing frames on every other section.
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => setInView(entries.some((e) => e.isIntersecting)), { threshold: 0.05 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

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
                el.style.transform = `rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
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

    return (
        <div className={cn('min-w-0 max-w-full [perspective:1400px]', className)}>
        <div
            ref={cardRef}
            className={cn(
                'relative min-w-0 max-w-full rounded-2xl border border-border/60 bg-background/70 backdrop-blur-md transition-transform duration-500 ease-out will-change-transform',
                canTilt && '[transform-style:preserve-3d]',
            )}
            style={{ '--glare-x': '50%', '--glare-y': '30%' } as CSSProperties}
            onPointerMove={onPointerMove}
            onPointerLeave={resetTilt}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
            }}
        >
            {/* Faint grid, like paper, pushed back so it drifts behind the diagram on tilt. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.07] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]"
                style={canTilt ? { transform: 'translateZ(-40px) scale(1.04)' } : undefined}
            />
            {/* Glare that follows the pointer, like light on a glass panel. */}
            {canTilt && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-60 [background:radial-gradient(260px_circle_at_var(--glare-x)_var(--glare-y),hsl(var(--foreground)/0.09),transparent_70%)]"
                    style={{ transform: 'translateZ(60px)' }}
                />
            )}

            {/* Tabs */}
            <div role="tablist" aria-label="Systems I've built" className="relative flex gap-1 overflow-x-auto border-b border-border/60 p-2 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden" style={canTilt ? { transform: 'translateZ(16px)' } : undefined}>
                {BLUEPRINTS.map((b, i) => (
                    <button
                        key={b.key}
                        role="tab"
                        aria-selected={i === index}
                        onClick={() => setIndex(i)}
                        className={cn(
                            'shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] transition-colors sm:tracking-[0.16em]',
                            i === index ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {b.title}
                    </button>
                ))}
            </div>

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4 px-4 pt-4" style={canTilt ? { transform: 'translateZ(16px)' } : undefined}>
                <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Blueprint</p>
                    <h3 className="mt-1 font-anton text-xl uppercase leading-none tracking-wide sm:text-2xl">{bp.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{bp.tag}</p>
                </div>
                {bp.href && (
                    <Link
                        href={bp.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer' : undefined}
                        className="inline-flex shrink-0 items-center gap-1 text-xs text-foreground underline-offset-4 hover:underline"
                    >
                        {external ? 'Open' : 'Case study'}
                        <ArrowUpRight size={12} aria-hidden="true" />
                    </Link>
                )}
            </div>

            {/* Diagram (remounted per blueprint so nodes replay their entrance). Sits closest to the viewer. */}
            {/* On phones the diagram keeps a readable width and scrolls sideways inside the card. */}
            <div
                key={bp.key}
                className="relative overflow-x-auto px-2 pt-1 [scrollbar-width:thin]"
                data-lenis-prevent-wheel
                style={canTilt ? { transform: 'translateZ(44px)' } : undefined}
            >
                <Diagram bp={bp} animate={!reduced && inView} uid={`${uid}-${bp.key}`} className="min-w-[520px] sm:min-w-0" />
            </div>

            {/* Facts */}
            <ul
                className="relative flex flex-wrap gap-x-4 gap-y-1 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground"
                style={canTilt ? { transform: 'translateZ(16px)' } : undefined}
            >
                {bp.facts.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                        <span className="size-1 rounded-full bg-foreground/70" aria-hidden="true" />
                        {f}
                    </li>
                ))}
            </ul>

            {/* Progress bar for the auto-cycle. */}
            {!reduced && !paused && (
                <div
                    key={`${bp.key}-bar`}
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px origin-left bg-foreground/60"
                    style={{ width: '100%', animation: `bp-progress ${CYCLE_MS}ms linear forwards` }}
                />
            )}
        </div>
        </div>
    );
};

export default HeroBlueprint;
