import CommitFeed from '@/components/CommitFeed';
import SectionTitle from '@/components/SectionTitle';
import ScrollTriggerRefresh from '@/components/ScrollTriggerRefresh';
import ContributionSkyline from '@/components/ui/contribution-skyline';
import { SOCIAL_LINKS } from '@/lib/data';
import { fetchContributions, GITHUB_USER } from '@/lib/github';
import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';

// The skyline reads Tailwind v4-style `--color-*` tokens; map the site's
// shadcn HSL variables onto them so it picks up the dark theme.
const themeBridge = {
    '--color-background': 'hsl(var(--card))',
    '--color-foreground': 'hsl(var(--foreground))',
    '--color-border': 'hsl(var(--border))',
    '--color-muted-foreground': 'hsl(var(--muted-foreground))',
} as CSSProperties;

// Monochrome ramp to match the site. The lowest step is lifted well clear of an
// empty day on the near-black card. Values are inlined because only components
// cross the server → client boundary.
const PALETTE = {
    light: ['#d4d4d4', '#a3a3a3', '#525252', '#171717'],
    dark: ['#3a3a3a', '#6b6b6b', '#a8a8a8', '#f5f5f5'],
};

const GithubActivity = async () => {
    const data = await fetchContributions();
    const github = SOCIAL_LINKS.find((l) => l.name === 'github')?.url ?? `https://github.com/${GITHUB_USER}`;

    return (
        <section className="py-16 md:py-section" id="github-activity">
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

                {/* Renders nothing (not even its margin) when the events feed is empty or rate-limited. */}
                <CommitFeed />
            </div>
        </section>
    );
};

export default GithubActivity;
