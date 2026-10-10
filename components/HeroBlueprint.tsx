'use client';
import { BLUEPRINTS, type Blueprint, type BlueprintKind, type BlueprintNode } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useId, useMemo, useState } from 'react';

/**
 * Animated blueprints of the systems Mithresh has actually built, cycling
 * through the entries in BLUEPRINTS. Pure SVG + CSS: no WebGL, no canvas.
 * Requests travel the edges with <animateMotion>; under reduced motion the
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

const useReducedMotion = () => {
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

const Diagram = ({ bp, animate, uid }: { bp: Blueprint; animate: boolean; uid: string }) => {
    const byId = useMemo(() => Object.fromEntries(bp.nodes.map((n) => [n.id, n])), [bp]);

    return (
        <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            className="block h-auto w-full"
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
                    <g key={id}>
                        <path id={id} d={d} className="fill-none stroke-border" strokeWidth="1" markerEnd={`url(#${uid}-arrow)`} />
                        {animate && (
                            <circle r="2.6" className="fill-foreground">
                                <animateMotion dur="2.6s" begin={`${(i * 0.45).toFixed(2)}s`} repeatCount="indefinite" calcMode="linear">
                                    <mpath href={`#${id}`} />
                                </animateMotion>
                            </circle>
                        )}
                    </g>
                );
            })}

            {/* Nodes */}
            {bp.nodes.map((n, i) => {
                const s = size(n);
                const note = n.kind === 'note';
                const dark = n.kind === 'app';
                // Position on the outer group; the entrance animation lives on an inner group, because a
                // CSS transform would otherwise override the SVG transform attribute and pile every node up.
                return (
                    <g key={n.id} transform={`translate(${n.x - s.w / 2}, ${n.y - s.h / 2})`}>
                      <g className="bp-node" style={{ animationDelay: `${i * 70}ms` }}>
                        <rect width={s.w} height={s.h} rx="8" className={cn(KIND_CLASS[n.kind])} strokeWidth="1" />
                        {n.kind === 'data' && <line x1="0" y1="8" x2={s.w} y2="8" className="stroke-foreground/60" strokeWidth="1" />}
                        {note && <circle cx="10" cy={s.h / 2} r="2.5" className="fill-muted-foreground" />}
                        <text
                            x={note ? 20 : 12}
                            y={n.sub ? s.h / 2 - 3 : s.h / 2 + 4}
                            className={cn('font-medium', dark ? 'fill-background' : 'fill-foreground')}
                            fontSize="12.5"
                        >
                            {n.label}
                        </text>
                        {n.sub && (
                            <text x={note ? 20 : 12} y={s.h / 2 + 12} className={dark ? 'fill-background/70' : 'fill-muted-foreground'} fontSize="10">
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

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-2xl border border-border/60 bg-background/70 backdrop-blur-md',
                className,
            )}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
            }}
        >
            {/* Faint grid, like paper. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]"
            />

            {/* Tabs */}
            <div role="tablist" aria-label="Systems I've built" className="relative flex flex-wrap gap-1 border-b border-border/60 p-2">
                {BLUEPRINTS.map((b, i) => (
                    <button
                        key={b.key}
                        role="tab"
                        aria-selected={i === index}
                        onClick={() => setIndex(i)}
                        className={cn(
                            'rounded-md px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] transition-colors',
                            i === index ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {b.title}
                    </button>
                ))}
            </div>

            {/* Header */}
            <div className="relative flex items-start justify-between gap-4 px-4 pt-4">
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

            {/* Diagram (remounted per blueprint so nodes replay their entrance). */}
            <div key={bp.key} className="relative px-2 pt-1">
                <Diagram bp={bp} animate={!reduced} uid={`${uid}-${bp.key}`} />
            </div>

            {/* Facts */}
            <ul className="relative flex flex-wrap gap-x-4 gap-y-1 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
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
    );
};

export default HeroBlueprint;
