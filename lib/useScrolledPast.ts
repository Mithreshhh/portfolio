'use client';
import { useEffect, useState } from 'react';

/**
 * True once the page has been scrolled past `offset` px. Used to keep the
 * floating helpers (terminal, music) out of the way of the hero's own CTAs.
 */
export function useScrolledPast(offset?: number): boolean {
    const [past, setPast] = useState(false);

    useEffect(() => {
        let raf = 0;
        // Default threshold: the bottom of the hero, so the buttons never sit over its CTAs or the blueprint.
        const threshold = () => offset ?? Math.max(240, (document.getElementById('banner')?.offsetHeight ?? 480) - 160);
        const check = () => {
            raf = 0;
            setPast(window.scrollY > threshold());
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(check);
        };
        check();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [offset]);

    return past;
}
