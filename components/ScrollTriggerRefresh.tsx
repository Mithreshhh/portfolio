'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useEffect, useRef, type ReactNode } from 'react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wrap content whose height changes after mount (e.g. a chart that grows when
 * it animates in). GSAP's ScrollTrigger caches element positions, so sections
 * further down would otherwise animate at the wrong scroll offsets.
 */
const ScrollTriggerRefresh = ({ children, className }: { children: ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let last = el.offsetHeight;
        let timer = 0;
        const ro = new ResizeObserver(() => {
            const h = el.offsetHeight;
            if (Math.abs(h - last) < 1) return;
            last = h;
            window.clearTimeout(timer);
            // Debounced: the morph changes height every frame for ~1.3 s.
            timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
        });
        ro.observe(el);
        return () => {
            ro.disconnect();
            window.clearTimeout(timer);
        };
    }, []);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

export default ScrollTriggerRefresh;
