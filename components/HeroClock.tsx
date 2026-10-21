'use client';
import { buildDots, CITIES, type GlobeDot } from '@/lib/globe';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

/**
 * Where I am, right now: three rings of ticks (hours, minutes, seconds) turn so the current
 * Hyderabad time sits under the blue markers, around a dotted globe pinned with the time zones
 * a remote team would check overlap against. Rings are SVG, the globe is one canvas, the
 * labels are HTML so they stay crisp and selectable.
 */

// Sized so the outer numbers and the lowest city label both fit inside the box: nothing is cropped.
const VB = { w: 640, h: 540 };
const C = { x: 320, y: 326 };
const RINGS = { hours: 190, minutes: 236, seconds: 282 };
const LABEL_GAP = 16;
const GLOBE_R = 150;
// IST has no daylight saving, so a fixed offset is exact and avoids Intl on every frame.
const IST_OFFSET_MS = 330 * 60_000;
const GLOBE_LAT0 = (14 * Math.PI) / 180;
const GLOBE_LON0 = (78.5 * Math.PI) / 180;
const SWAY_RAD = (16 * Math.PI) / 180;
const SWAY_PERIOD_MS = 26_000;
const GLOBE_FRAME_MS = 40;

const istNow = () => new Date(Date.now() + IST_OFFSET_MS);

const cityTime = (tz: string) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(
        new Date(),
    );

let DOTS: GlobeDot[] | null = null;

/**
 * One ring of ticks and numbers. The parent rotates the group through its ref: the seconds ring
 * glides (attribute transform, every frame), the others step once a value changes (CSS transform,
 * so the turn can ease).
 */
const Ring = ({
    r,
    count,
    step = 1,
    current,
    groupRef,
    stepped,
    reduced,
}: {
    r: number;
    count: number;
    step?: number;
    current: number;
    groupRef: React.RefObject<SVGGElement>;
    stepped?: boolean;
    reduced?: boolean;
}) => {
    const ticks = Array.from({ length: count }, (_, i) => i);
    // Node and the browser disagree in the last digit of sin/cos, which React reports as a
    // hydration mismatch; two decimals are more than the SVG can show anyway.
    const fx = (n: number) => Math.round(n * 100) / 100;
    return (
        <g>
            <circle cx={C.x} cy={C.y} r={r} className="fill-none stroke-border/70" strokeWidth="1" />
            <g
                ref={groupRef}
                style={
                    stepped
                        ? {
                              transformOrigin: `${C.x}px ${C.y}px`,
                              transformBox: 'view-box',
                              transition: reduced ? 'none' : 'transform 600ms var(--ease-out)',
                          }
                        : undefined
                }
            >
                {ticks.map((i) => {
                    const theta = (i * 2 * Math.PI) / count;
                    const sin = Math.sin(theta);
                    const cos = Math.cos(theta);
                    const tx = fx(C.x + (r + LABEL_GAP) * sin);
                    const ty = fx(C.y - (r + LABEL_GAP) * cos);
                    const live = i === current;
                    return (
                        <g key={i}>
                            <circle
                                cx={fx(C.x + r * sin)}
                                cy={fx(C.y - r * cos)}
                                r={live ? 2.4 : 1.6}
                                className={live ? 'fill-live' : 'fill-muted-foreground/55'}
                            />
                            <text
                                x={tx}
                                y={ty}
                                transform={`rotate(${(i * 360) / count} ${tx} ${ty})`}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="11.5"
                                className={cn(
                                    'hidden tabular-nums lg:block',
                                    live ? 'fill-live font-medium' : 'fill-muted-foreground',
                                )}
                            >
                                {i * step}
                            </text>
                        </g>
                    );
                })}
            </g>
        </g>
    );
};

const HeroClock = ({ className }: { className?: string }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hoursRef = useRef<SVGGElement>(null);
    const minutesRef = useRef<SVGGElement>(null);
    const secondsRef = useRef<SVGGElement>(null);
    const pinRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [reduced, setReduced] = useState(false);
    const [inView, setInView] = useState(true);
    // The highlighted number on each ring; changes once a second at most.
    const [now, setNow] = useState({ h: 0, m: 0, s: 0 });
    const [times, setTimes] = useState<Record<string, string>>({});

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const on = () => setReduced(mq.matches);
        on();
        mq.addEventListener('change', on);
        return () => mq.removeEventListener('change', on);
    }, []);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => setInView(entries.some((e) => e.isIntersecting)), {
            threshold: 0.05,
        });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // City clocks only need minute precision.
    useEffect(() => {
        const update = () => setTimes(Object.fromEntries(CITIES.map((c) => [c.name, cityTime(c.tz)])));
        update();
        const id = window.setInterval(update, 30_000);
        return () => window.clearInterval(id);
    }, []);

    // Rings and globe share one frame loop; it sleeps when the hero is off-screen or the tab is hidden.
    useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        if (!root || !canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        DOTS ??= buildDots();
        const dots = DOTS;

        let scale = 1;
        const ro = new ResizeObserver(([entry]) => {
            const w = entry.contentRect.width;
            scale = w / VB.w;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(((w * VB.h) / VB.w) * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            lastGlobe = 0;
        });
        ro.observe(root);

        let raf = 0;
        let lastGlobe = 0;
        let lastSec = -1;
        // Stepped rings keep a running total so 59 → 0 turns one notch forward, not a full lap back.
        let turnM = -1;
        let turnH = -1;
        let lastM = -1;
        let lastH = -1;

        const drawGlobe = (t: number) => {
            const cx = C.x * scale;
            const cy = C.y * scale;
            const R = GLOBE_R * scale;
            const lon0 = GLOBE_LON0 + (reduced ? 0 : SWAY_RAD * Math.sin((t / SWAY_PERIOD_MS) * 2 * Math.PI));
            const sinLat0 = Math.sin(GLOBE_LAT0);
            const cosLat0 = Math.cos(GLOBE_LAT0);

            ctx.clearRect(0, 0, VB.w * scale, VB.h * scale);

            // Body, lit from the upper left.
            const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
            body.addColorStop(0, 'hsl(0 0% 7%)');
            body.addColorStop(1, 'hsl(0 0% 1.5%)');
            ctx.fillStyle = body;
            ctx.beginPath();
            ctx.arc(cx, cy, R, 0, Math.PI * 2);
            ctx.fill();

            // Atmosphere: a thin blue rim that fades both ways.
            const rim = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.12);
            rim.addColorStop(0, 'hsla(217, 91%, 60%, 0)');
            rim.addColorStop(0.42, 'hsla(217, 91%, 60%, 0.55)');
            rim.addColorStop(0.55, 'hsla(217, 91%, 60%, 0.22)');
            rim.addColorStop(1, 'hsla(217, 91%, 60%, 0)');
            ctx.fillStyle = rim;
            ctx.beginPath();
            ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
            ctx.fill();

            // Dots, bucketed by brightness so the canvas does a handful of fills, not thousands.
            const BUCKETS = 6;
            const land = Array.from({ length: BUCKETS }, () => new Path2D());
            const sea = new Path2D();
            const ls = 2.4 * scale;
            const ss = 1.5 * scale;
            for (const d of dots) {
                const dlon = d.lon - lon0;
                const cosLat = Math.cos(d.lat);
                const sinLat = Math.sin(d.lat);
                const cosDlon = Math.cos(dlon);
                const cosc = sinLat0 * sinLat + cosLat0 * cosLat * cosDlon;
                if (cosc <= 0.03) continue;
                const x = cx + R * cosLat * Math.sin(dlon);
                const y = cy - R * (cosLat0 * sinLat - sinLat0 * cosLat * cosDlon);
                if (d.land) {
                    const b = Math.min(BUCKETS - 1, Math.floor(cosc * BUCKETS));
                    land[b].rect(x - ls / 2, y - ls / 2, ls, ls);
                } else if (cosc > 0.2) {
                    sea.rect(x - ss / 2, y - ss / 2, ss, ss);
                }
            }
            ctx.fillStyle = 'hsla(0, 0%, 100%, 0.07)';
            ctx.fill(sea);
            land.forEach((p, b) => {
                ctx.fillStyle = `hsla(0, 0%, 100%, ${(0.22 + (0.7 * (b + 1)) / BUCKETS).toFixed(2)})`;
                ctx.fill(p);
            });

            // Pins ride the same projection; behind the limb they fade out.
            CITIES.forEach((c, i) => {
                const el = pinRefs.current[i];
                if (!el) return;
                const lat = (c.lat * Math.PI) / 180;
                const dlon = (c.lon * Math.PI) / 180 - lon0;
                const cosLat = Math.cos(lat);
                const sinLat = Math.sin(lat);
                const cosDlon = Math.cos(dlon);
                const cosc = sinLat0 * sinLat + cosLat0 * cosLat * cosDlon;
                const x = cx + R * cosLat * Math.sin(dlon);
                const y = cy - R * (cosLat0 * sinLat - sinLat0 * cosLat * cosDlon);
                el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
                el.style.opacity = cosc <= 0.05 ? '0' : Math.min(1, (cosc - 0.05) * 4).toFixed(2);
                el.style.pointerEvents = cosc <= 0.05 ? 'none' : '';
            });
        };

        const frame = (t: number) => {
            const d = istNow();
            const ms = d.getUTCMilliseconds();
            const s = d.getUTCSeconds();
            const m = d.getUTCMinutes();
            const h = d.getUTCHours();

            // Seconds glide at a constant rate; it's a dial, not an element arriving.
            const sf = reduced ? s : s + ms / 1000;
            secondsRef.current?.setAttribute('transform', `rotate(${(-sf * 6).toFixed(3)} ${C.x} ${C.y})`);

            // Minutes and hours step, so the current number sits exactly under its marker.
            if (m !== lastM) {
                turnM = turnM < 0 ? m : turnM + ((m - lastM + 60) % 60);
                lastM = m;
                if (minutesRef.current) minutesRef.current.style.transform = `rotate(${-turnM * 6}deg)`;
            }
            if (h !== lastH) {
                turnH = turnH < 0 ? h : turnH + ((h - lastH + 24) % 24);
                lastH = h;
                if (hoursRef.current) hoursRef.current.style.transform = `rotate(${-turnH * 15}deg)`;
            }

            if (s !== lastSec) {
                lastSec = s;
                setNow({ h, m, s });
            }
            if (t - lastGlobe >= GLOBE_FRAME_MS) {
                lastGlobe = t;
                drawGlobe(t);
            }
        };

        let timer = 0;
        const loop = (t: number) => {
            frame(t);
            raf = requestAnimationFrame(loop);
        };
        const start = () => {
            stop();
            if (reduced) {
                // Discrete ticks are enough, and the globe holds still.
                frame(performance.now());
                timer = window.setInterval(() => frame(performance.now()), 1000);
            } else {
                raf = requestAnimationFrame(loop);
            }
        };
        const stop = () => {
            cancelAnimationFrame(raf);
            window.clearInterval(timer);
        };
        const onVisibility = () => (document.hidden || !inView ? stop() : start());

        if (inView) start();
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            stop();
            ro.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [reduced, inView]);

    const ist = times.Hyderabad;

    return (
        <div
            ref={rootRef}
            className={cn(
                'relative w-full select-none',
                className,
            )}
            style={{ aspectRatio: `${VB.w} / ${VB.h}` }}
        >
            {/* The numbers and pins are decoration around one fact, stated once for assistive tech. */}
            <p className="sr-only">{ist ? `It is ${ist} in Hyderabad (IST).` : 'Current time in Hyderabad (IST).'}</p>

            <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

            <svg
                viewBox={`0 0 ${VB.w} ${VB.h}`}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full overflow-visible"
            >
                <Ring r={RINGS.hours} count={24} current={now.h} groupRef={hoursRef} stepped reduced={reduced} />
                <Ring r={RINGS.minutes} count={60} current={now.m} groupRef={minutesRef} stepped reduced={reduced} />
                <Ring r={RINGS.seconds} count={60} current={now.s} groupRef={secondsRef} />
                {/* Fixed markers: the rings turn underneath them. */}
                {Object.values(RINGS).map((r) => (
                    <circle key={r} cx={C.x} cy={C.y - r} r="4" className="fill-live" />
                ))}
                <text
                    x={C.x}
                    y={C.y - GLOBE_R - 16}
                    textAnchor="middle"
                    fontSize="10"
                    className="hidden fill-muted-foreground uppercase lg:block"
                    style={{ letterSpacing: '0.22em' }}
                >
                    Hyderabad · IST
                </text>
            </svg>

            {/* City pins, positioned by the frame loop. */}
            {CITIES.map((c, i) => (
                <div
                    key={c.name}
                    ref={(el) => {
                        pinRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    className="absolute left-0 top-0 opacity-0 transition-opacity duration-300 will-change-transform"
                >
                    <span
                        className={cn(
                            'absolute left-0 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground',
                            c.home
                                ? 'shadow-[0_0_0_4px_hsl(var(--live)/0.35),0_0_16px_hsl(var(--foreground)/0.9)]'
                                : 'shadow-[0_0_10px_hsl(var(--foreground)/0.7)]',
                        )}
                    />
                    <span
                        className={cn('absolute bg-foreground/50', {
                            'bottom-1 left-0 h-3 w-px': c.side === 'top',
                            'left-0 top-1 h-3 w-px': c.side === 'bottom',
                            'right-1 top-0 h-px w-3': c.side === 'left',
                            'left-1 top-0 h-px w-3': c.side === 'right',
                        })}
                    />
                    <span
                        className={cn(
                            'absolute flex items-baseline gap-2 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[13px] leading-none sm:text-sm',
                            c.home
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border/70 bg-background/85 text-foreground',
                            {
                                'bottom-4 left-0 -translate-x-1/2': c.side === 'top',
                                'left-0 top-4 -translate-x-1/2': c.side === 'bottom',
                                'right-4 top-0 -translate-y-1/2': c.side === 'left',
                                'left-4 top-0 -translate-y-1/2': c.side === 'right',
                            },
                        )}
                    >
                        {c.name}
                        <span
                            className={cn(
                                'text-[11px] tabular-nums',
                                c.home ? 'text-background/70' : 'text-muted-foreground',
                            )}
                        >
                            {times[c.name] ?? '--:--'}
                        </span>
                    </span>
                </div>
            ))}
        </div>
    );
};

export default HeroClock;
