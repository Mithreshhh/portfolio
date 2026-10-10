import SectionTitle from '@/components/SectionTitle';
import ScrollTriggerRefresh from '@/components/ScrollTriggerRefresh';
import ContributionSkyline, { type ContributionDay } from '@/components/ui/contribution-skyline';
import { SOCIAL_LINKS } from '@/lib/data';
import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';

const GITHUB_USER = 'Mithreshhh';

// Public, token-free mirror of the GitHub contribution calendar.
const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`;

// The skyline reads Tailwind v4-style `--color-*` tokens; map the site's
// shadcn HSL variables onto them so it picks up the dark theme.
const themeBridge = {
    '--color-background': 'hsl(var(--card))',
    '--color-foreground': 'hsl(var(--foreground))',
    '--color-border': 'hsl(var(--border))',
    '--color-muted-foreground': 'hsl(var(--muted-foreground))',
} as CSSProperties;

// Site purple (the component's "grape" preset). The preset's darkest step is too
// close to an empty day on the near-black card, so the low end is lifted. Values
// are inlined because only components cross the server → client boundary.
const PALETTE = {
    light: ['#e4d4fb', '#b794f4', '#805ad5', '#44337a'],
    dark: ['#3d2b78', '#5d3fb8', '#8b5cf6', '#c4b5fd'],
};

async function fetchContributions(): Promise<ContributionDay[] | null> {
    try {
        const res = await fetch(CONTRIBUTIONS_URL, {
            next: { revalidate: 60 * 60 },
            // Never let a hung upstream stall the build or a revalidation.
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) {
            console.warn(`[GithubActivity] contributions API responded ${res.status}`);
            return null;
        }
        const json: { contributions?: { date: string; count: number }[] } = await res.json();
        if (!Array.isArray(json.contributions) || json.contributions.length === 0) {
            console.warn('[GithubActivity] contributions API returned no days');
            return null;
        }
        return json.contributions.map(({ date, count }) => ({ date, count }));
    } catch (err) {
        console.warn('[GithubActivity] contributions fetch failed:', err instanceof Error ? err.message : err);
        return null;
    }
}

const GithubActivity = async () => {
    const data = await fetchContributions();
    const github = SOCIAL_LINKS.find((l) => l.name === 'github')?.url ?? `https://github.com/${GITHUB_USER}`;

    return (
        <section className="py-20 md:py-section" id="github-activity">
            <div className="container">
                <SectionTitle title="GitHub Activity" />

                {data ? (
                    <ScrollTriggerRefresh>
                        <div style={themeBridge}>
                            <ContributionSkyline
                                data={data}
                                palette={PALETTE}
                                footer={
                                    <a
                                        href={github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-primary smooth-transition"
                                    >
                                        @{GITHUB_USER} on GitHub →
                                    </a>
                                }
                            />
                        </div>
                    </ScrollTriggerRefresh>
                ) : (
                    // The feed is a third-party mirror; if it is down, keep the anchor and point at the source.
                    <a
                        href={github}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-border/50 bg-background-light/20 p-6 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground sm:p-7"
                    >
                        <span>
                            The contribution graph couldn&apos;t be loaded right now — see my activity directly on
                            GitHub.
                        </span>
                        <ArrowUpRight className="shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                )}
            </div>
        </section>
    );
};

export default GithubActivity;
