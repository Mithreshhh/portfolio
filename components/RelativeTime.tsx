'use client';

import { relativeTime } from '@/lib/github';
import { useEffect, useState } from 'react';

interface RelativeTimeProps {
    iso: string;
    /** Server-rendered label; used for the first client render so hydration matches. */
    initial: string;
}

/**
 * The page is statically cached, so a server-computed "2h ago" can be days old
 * by the time someone reads it. Recompute from the absolute timestamp once
 * mounted and keep it ticking while the tab is open.
 */
const RelativeTime = ({ iso, initial }: RelativeTimeProps) => {
    const [label, setLabel] = useState(initial);

    useEffect(() => {
        const tick = () => setLabel(relativeTime(iso));
        tick();
        const id = window.setInterval(tick, 60_000);
        return () => window.clearInterval(id);
    }, [iso]);

    return <>{label}</>;
};

export default RelativeTime;
