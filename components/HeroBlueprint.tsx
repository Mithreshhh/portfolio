'use client';
import { type Blueprint, type BlueprintKind, type BlueprintNode } from '@/lib/data';
import { cn } from '@/lib/utils';
import { AppWindow, Cloud, Database, Server, Users, type LucideIcon } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';

/**
 * Architecture diagrams of the systems Mithresh has actually built, drawn from BLUEPRINTS.
 * Pure SVG + CSS: no WebGL, no canvas. Requests travel the edges with a CSS offset-path
 * animation; under reduced motion the diagram is static.
 */

const VB = { w: 640, h: 360 };
const NODE = { w: 134, h: 46 };
const NOTE = { w: 150, h: 38 };

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
    /** Called with a node id while the pointer is over it, and null when it leaves. */
    onHoverNode?: (_id: string | null) => void;
    className?: string;
}

/** The bare architecture diagram, shared by the systems section and the case-study stepper. */
export const Diagram = ({ bp, animate = true, uid: uidProp, highlight, onHoverNode, className }: DiagramProps) => {
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
                <marker
                    id={`${uid}-arrow`}
                    viewBox="0 0 8 8"
                    refX="7"
                    refY="4"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                >
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
                        <path
                            id={id}
                            d={d}
                            className="fill-none stroke-border"
                            strokeWidth="1"
                            markerEnd={`url(#${uid}-arrow)`}
                        />
                        {animate && (
                            // Halo and dot share one group so the compositor moves a single layer per edge.
                            <g
                                className="bp-dot"
                                style={{ offsetPath: `path("${d}")`, animationDelay: `${(i * 0.45).toFixed(2)}s` }}
                            >
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
                        onPointerEnter={onHoverNode && !note ? () => onHoverNode(n.id) : undefined}
                        onPointerLeave={onHoverNode && !note ? () => onHoverNode(null) : undefined}
                    >
                        <g className="bp-node" style={{ animationDelay: `${i * 70}ms` }}>
                            <rect width={s.w} height={s.h} rx="8" className={cn(KIND_CLASS[n.kind])} strokeWidth="1" />
                            {n.kind === 'data' && (
                                <line x1="0" y1="8" x2={s.w} y2="8" className="stroke-foreground/60" strokeWidth="1" />
                            )}
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
                                <text
                                    x={tx}
                                    y={s.h / 2 + 12}
                                    className={dark ? 'fill-background/70' : 'fill-muted-foreground'}
                                    fontSize="10"
                                >
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
