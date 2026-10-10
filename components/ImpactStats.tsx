'use client';
import { IMPACT, type ImpactStat } from '@/lib/impact';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 1200;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from 0 to `target` the first time `ref` scrolls into view.
 * Reduced-motion users get the final value straight away.
 */
const useCountUp = (ref: React.RefObject<HTMLElement>, target: number) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setDisplay(target);
            return;
        }

        let raf = 0;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry?.isIntersecting) return;
                observer.disconnect();

                const start = performance.now();
                const tick = (now: number) => {
                    const t = Math.min((now - start) / DURATION_MS, 1);
                    setDisplay(Math.round(easeOutCubic(t) * target));
                    if (t < 1) raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
            },
            { threshold: 0.4 },
        );
        observer.observe(el);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [ref, target]);

    return display;
};

const ImpactCard = ({ stat }: { stat: ImpactStat }) => {
    const ref = useRef<HTMLLIElement>(null);
    const display = useCountUp(ref, stat.value);
    const external = stat.href?.startsWith('http');

    return (
        <li
            ref={ref}
            className="group relative flex flex-col rounded-2xl border border-border/50 bg-background-light/20 p-5 backdrop-blur-sm transition-colors hover:border-border sm:p-6"
        >
            {/* The ticking number is hidden from AT; the final value is announced once instead. */}
            <p className="font-anton text-5xl leading-none tracking-wide tabular-nums sm:text-6xl">
                <span aria-hidden="true">
                    {stat.prefix && <span className="text-muted-foreground">{stat.prefix}</span>}
                    <span className="text-foreground">{display}</span>
                </span>
                <span className="sr-only">
                    {stat.prefix}
                    {stat.value}
                </span>
            </p>

            <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{stat.detail}</p>

            {stat.href && (
                <a
                    href={stat.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                    aria-label={`${stat.label}: ${external ? 'open site' : 'see it in the timeline'}`}
                    className={cn(
                        'mt-auto inline-flex items-center gap-1.5 self-start pt-4 text-xs text-muted-foreground transition-colors hover:text-foreground',
                        // Stretch the hit area over the whole card without nesting interactives.
                        'after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-1 focus-visible:after:ring-foreground/60',
                    )}
                >
                    {external ? 'Open site' : 'In the timeline'}
                    {external ? (
                        <ArrowUpRight
                            size={13}
                            aria-hidden="true"
                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    ) : (
                        <ArrowDown
                            size={13}
                            aria-hidden="true"
                            className="transition-transform group-hover:translate-y-0.5"
                        />
                    )}
                </a>
            )}
        </li>
    );
};

const ImpactStats = ({ className }: { className?: string }) => (
    <ul className={cn('grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5', className)} aria-label="Impact at a glance">
        {IMPACT.map((stat) => (
            <ImpactCard key={stat.label} stat={stat} />
        ))}
    </ul>
);

export default ImpactStats;
