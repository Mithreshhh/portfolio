'use client';
import { Diagram, useReducedMotion } from '@/components/HeroBlueprint';
import { BLUEPRINT_STEPS } from '@/lib/blueprint-steps';
import { BLUEPRINTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useCallback, useId, useState, type KeyboardEvent } from 'react';

interface Props {
    blueprintKey: string;
    className?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Guided tour of a blueprint: each step lights up the nodes it talks about and
 * explains the decision behind them. Renders nothing when the key has no
 * blueprint or no steps, so callers can mount it unconditionally.
 */
const BlueprintStepper = ({ blueprintKey, className }: Props) => {
    const bp = BLUEPRINTS.find((b) => b.key === blueprintKey);
    const steps = BLUEPRINT_STEPS[blueprintKey];
    const reduced = useReducedMotion();
    const [index, setIndex] = useState(0);
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

    const total = steps?.length ?? 0;
    const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
    const next = useCallback(() => setIndex((i) => Math.min(total - 1, i + 1)), [total]);

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            next();
        } else if (e.key === 'Home') {
            e.preventDefault();
            setIndex(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            setIndex(total - 1);
        }
    };

    if (!bp || !steps || total === 0) return null;

    const step = steps[Math.min(index, total - 1)];
    const atStart = index === 0;
    const atEnd = index === total - 1;

    return (
        <div
            role="region"
            aria-label={`${bp.title} architecture walkthrough. Use the left and right arrow keys to move between steps.`}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className={cn(
                'relative grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-border/50 bg-background-light/20 backdrop-blur-sm',
                'outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'lg:grid-cols-[3fr_2fr]',
                className,
            )}
        >
            {/* Diagram */}
            <div className="relative px-2 pb-2 pt-3 sm:px-3">
                {/* Faint grid, like paper, matching the hero. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:24px_24px]"
                />
                <div className="overflow-x-auto [scrollbar-width:thin]" data-lenis-prevent-wheel>
                    <Diagram bp={bp} animate={!reduced} uid={`${uid}-${bp.key}`} highlight={step.nodes} className="relative min-w-[520px] sm:min-w-0" />
                </div>
            </div>

            {/* Step panel */}
            <div className="flex flex-col border-t border-border/50 p-5 sm:p-6 lg:border-l lg:border-t-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="tabular-nums">
                        {pad(index + 1)} / {pad(total)}
                    </span>
                    <span className="mx-2" aria-hidden="true">
                        ·
                    </span>
                    {bp.title}
                </p>

                {/* The live region stays mounted so screen readers announce changes; only the inner child is keyed to re-run the entrance animation. */}
                <div aria-live="polite" aria-atomic="true" className="mt-4 flex-1">
                    <div
                        key={index}
                        className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300"
                    >
                        <h3 className="font-anton text-2xl uppercase leading-none tracking-wide sm:text-3xl">{step.title}</h3>
                        <p className="mt-3 text-sm leading-relaxed text-foreground/85 sm:text-base">{step.body}</p>

                        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Components in this step">
                            {step.nodes.map((id) => {
                                const node = bp.nodes.find((n) => n.id === id);
                                if (!node) return null;
                                return (
                                    <li key={id} className="rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-xs">
                                        {node.label}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Controls */}
                <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5" role="group" aria-label="Go to step">
                        {steps.map((s, i) => (
                            <button
                                key={s.title}
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`Step ${i + 1}: ${s.title}`}
                                aria-current={i === index ? 'step' : undefined}
                                className="group flex size-6 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-foreground/60"
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'block rounded-full transition-all duration-300',
                                        i === index
                                            ? 'h-1.5 w-5 bg-foreground'
                                            : 'size-1.5 bg-foreground/30 group-hover:bg-foreground/60',
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* aria-disabled instead of disabled: a disabled button drops keyboard focus to <body>, which would kill arrow-key navigation at either end. */}
                        <button
                            type="button"
                            onClick={() => {
                                if (!atStart) prev();
                            }}
                            aria-disabled={atStart}
                            aria-label="Previous step"
                            className="inline-flex size-10 items-center justify-center rounded-md border border-border/60 bg-background/60 text-foreground transition-colors hover:border-foreground hover:bg-foreground/10 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:border-border/60 aria-disabled:hover:bg-background/60"
                        >
                            <ArrowLeft size={16} aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (!atEnd) next();
                            }}
                            aria-disabled={atEnd}
                            aria-label="Next step"
                            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:opacity-40"
                        >
                            Next
                            <ArrowRight size={15} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlueprintStepper;
