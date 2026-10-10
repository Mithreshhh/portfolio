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

// --- Recent commits ----------------------------------------------------------

export interface RecentCommit {
    sha: string;
    /** First line of the commit message, trimmed to ~80 chars. */
    message: string;
    /** Repository name without the owner. */
    repo: string;
    repoUrl: string;
    url: string;
    /** ISO timestamp of the commit (author date). */
    at: string;
}

// Public, token-free. The events API no longer lists commits inside PushEvents, so the
// commit search endpoint is the one-call source: author, newest first, with repo and URL.
// Only public repos are returned; private work never shows up here.
const SEARCH_URL = `https://api.github.com/search/commits?q=author:${GITHUB_USER}&sort=author-date&order=desc`;

interface GithubSearchCommit {
    sha?: string;
    html_url?: string;
    commit?: { message?: string; author?: { date?: string }; committer?: { date?: string } };
    repository?: { name?: string; html_url?: string };
}

/**
 * "just now", "2h ago", "3d ago" — enough for a feed; no locale machinery needed.
 * Pure and shared with the client so a cached page can refresh its labels.
 */
export const relativeTime = (iso: string, now = Date.now()): string => {
    const diff = Math.max(0, now - new Date(iso).getTime());
    const min = Math.floor(diff / 60_000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    if (day < 30) return `${day}d ago`;
    const mo = Math.floor(day / 30);
    if (mo < 12) return `${mo}mo ago`;
    return `${Math.floor(day / 365)}y ago`;
};

const firstLine = (message: string, max = 80): string => {
    const line = message.split('\n')[0].trim();
    return line.length > max ? `${line.slice(0, max - 1).trimEnd()}…` : line;
};

/**
 * Newest `limit` public commits by GITHUB_USER, or null if the feed is
 * unavailable. Server-only; never throws so the page can always render.
 */
export async function fetchRecentCommits(limit = 3): Promise<RecentCommit[] | null> {
    try {
        const res = await fetch(`${SEARCH_URL}&per_page=${Math.min(10, Math.max(1, limit))}`, {
            headers: {
                Accept: 'application/vnd.github+json',
                'User-Agent': `${GITHUB_USER}-portfolio`,
            },
            next: { revalidate: 900 },
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) {
            console.warn(`[github] commit search responded ${res.status}`);
            return null;
        }
        const body: { items?: GithubSearchCommit[] } = await res.json();
        if (!Array.isArray(body.items)) {
            console.warn('[github] commit search returned no items array');
            return null;
        }

        const out: RecentCommit[] = [];
        for (const it of body.items) {
            const sha = it.sha;
            const repoName = it.repository?.name;
            const repoUrl = it.repository?.html_url;
            const at = it.commit?.author?.date ?? it.commit?.committer?.date;
            if (!sha || !repoName || !repoUrl || !at) continue;
            out.push({
                sha,
                message: firstLine(it.commit?.message ?? ''),
                repo: repoName,
                repoUrl,
                url: it.html_url ?? `${repoUrl}/commit/${sha}`,
                at: new Date(at).toISOString(),
            });
            if (out.length >= limit) break;
        }
        return out.length > 0 ? out : null;
    } catch (err) {
        console.warn('[github] commit search failed:', err instanceof Error ? err.message : err);
        return null;
    }
}
