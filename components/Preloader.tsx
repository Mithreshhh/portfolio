'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const NAME = 'MITHRESH';
const SESSION_KEY = 'portfolio:preloader-shown';
// Hard ceiling: the overlay always comes down, even if an animation stalls.
const SAFETY_MS = 4500;

const Preloader = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useGSAP(
        () => {
            const root = rootRef.current;
            if (!root) return;

            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            let seen = false;
            try {
                seen = sessionStorage.getItem(SESSION_KEY) === '1';
                sessionStorage.setItem(SESSION_KEY, '1');
            } catch {
                /* storage can be unavailable; just play the intro */
            }

            const finish = () => setIsVisible(false);

            // Repeat visits in the same session, or reduced motion: a quick fade, no show.
            if (seen || reduced) {
                gsap.to(root, { autoAlpha: 0, duration: 0.35, ease: 'power1.out', onComplete: finish });
                return;
            }

            const counter = { value: 0 };
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish });

            // The letters start translated below their clipping box via the CSS class;
            // GSAP reads that as a pixel offset, so animate `y`, not `yPercent`.
            tl.to('.pl-letter', { y: 0, duration: 0.7, stagger: 0.045 })
                .to('.pl-meta', { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.45')
                .to(
                    counter,
                    {
                        value: 100,
                        duration: 1.2,
                        ease: 'power2.inOut',
                        onUpdate: () => {
                            if (countRef.current) countRef.current.textContent = Math.round(counter.value) + '%';
                        },
                    },
                    '<',
                )
                .to('.pl-bar', { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, '<')
                // Lift the content away, then split the curtain to reveal the page.
                .to('.pl-content', { autoAlpha: 0, y: -40, duration: 0.45, ease: 'power2.in' }, '+=0.15')
                .to('.pl-glow', { autoAlpha: 0, duration: 0.4 }, '<')
                .to('.pl-panel-top', { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '-=0.15')
                .to('.pl-panel-bottom', { yPercent: 100, duration: 0.8, ease: 'power4.inOut' }, '<');
        },
        { scope: rootRef },
    );

    useEffect(() => {
        const id = window.setTimeout(() => setIsVisible(false), SAFETY_MS);
        return () => window.clearTimeout(id);
    }, []);

    // Lock scrolling while the intro plays.
    useEffect(() => {
        document.body.style.overflow = isVisible ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            ref={rootRef}
            role="status"
            aria-live="polite"
            aria-label="Loading portfolio"
            className="fixed inset-0 z-[100] overflow-hidden"
        >
            {/* Curtain: two panels that part at the end. */}
            <div className="pl-panel-top absolute inset-x-0 top-0 h-1/2 bg-background will-change-transform" />
            <div className="pl-panel-bottom absolute inset-x-0 bottom-0 h-1/2 bg-background will-change-transform" />

            {/* Ambient glow behind the wordmark. */}
            <div
                className="pl-glow pointer-events-none absolute left-1/2 top-1/2 size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
                style={{
                    background:
                        'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.22), hsl(var(--secondary) / 0.08) 40%, transparent 65%)',
                }}
            />

            <div className="pl-content absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
                <p
                    aria-hidden="true"
                    className="flex overflow-hidden font-anton text-[17vw] leading-[0.9] sm:text-[120px] lg:text-[150px]"
                >
                    {NAME.split('').map((letter, i) => (
                        <span
                            key={i}
                            className="pl-letter inline-block translate-y-[110%] bg-gradient-to-b from-foreground to-foreground/55 bg-clip-text text-transparent"
                        >
                            {letter}
                        </span>
                    ))}
                </p>

                <div className="pl-meta w-[min(72vw,440px)] translate-y-3 opacity-0">
                    <div className="flex items-end justify-between text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                        <span>Full stack developer</span>
                        <span ref={countRef} className="font-medium tabular-nums text-foreground">
                            0%
                        </span>
                    </div>
                    <div className="mt-3 h-px w-full overflow-hidden bg-border/70">
                        <div className="pl-bar h-full w-full origin-left scale-x-0 bg-gradient-to-r from-primary via-secondary to-accent" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
