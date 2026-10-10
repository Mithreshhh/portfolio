import type { ContributionDay } from '@/components/ui/contribution-skyline';

export const GITHUB_USER = 'Mithreshhh';

// Public, token-free mirror of the GitHub contribution calendar.
const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;

/**
 * Last year of contributions, or null if the feed is unavailable. Server-only.
 * Next.js dedupes identical fetches within a render, so the hero and the
 * activity section can both call this for the price of one request.
 */
export async function fetchContributions(): Promise<ContributionDay[] | null> {
    try {
        const res = await fetch(CONTRIBUTIONS_URL, {
            next: { revalidate: 60 * 60 },
            // Never let a hung upstream stall the build or a revalidation.
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) {
            console.warn(`[github] contributions API responded ${res.status}`);
            return null;
        }
        const json: { contributions?: { date: string; count: number }[] } = await res.json();
        if (!Array.isArray(json.contributions) || json.contributions.length === 0) {
            console.warn('[github] contributions API returned no days');
            return null;
        }
        return json.contributions.map(({ date, count }) => ({ date, count }));
    } catch (err) {
        console.warn('[github] contributions fetch failed:', err instanceof Error ? err.message : err);
        return null;
    }
}

export const totalContributions = (days: ContributionDay[] | null): number | undefined =>
    days ? days.reduce((sum, d) => sum + d.count, 0) : undefined;
