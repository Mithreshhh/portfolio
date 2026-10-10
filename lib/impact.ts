// Résumé-backed numbers for the impact cards above the experience timeline.
// Every value here must trace to a highlight in EXPERIENCE (lib/data.ts).
export interface ImpactStat {
    /** Final number the card counts up to. */
    value: number;
    /** Rendered in muted text before the number, e.g. "48 → " or "~". */
    prefix?: string;
    label: string;
    detail: string;
    /** Hash anchor on this page or an external URL. */
    href?: string;
}

export const IMPACT: ImpactStat[] = [
    {
        value: 91,
        prefix: '48 → ',
        label: 'Page speed score',
        detail: 'PNG → WebP conversion across the Menler LMS',
        href: '#experience-timeline',
    },
    {
        value: 150,
        prefix: '~',
        label: 'Event passes issued',
        detail: 'IIC event-pass system, React + payments',
        href: 'https://iic.mlritm.ac.in/',
    },
    {
        value: 30,
        prefix: '~',
        label: 'LMS users',
        detail: '3 core modules shipped at Menler',
        href: '#experience-timeline',
    },
];
