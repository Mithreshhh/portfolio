'use client';
import { useEffect, useState } from 'react';

/**
 * True once the page has been scrolled past `offset` px. Used to keep the
 * floating helpers (terminal, music) out of the way of the hero's own CTAs.
 */
export function useScrolledPast(offset = 240): boolean {
    const [past, setPast] = useState(false);

    useEffect(() => {
        let raf = 0;
        const check = () => {
            raf = 0;
            setPast(window.scrollY > offset);
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
