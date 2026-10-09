import SectionTitle from '@/components/SectionTitle';
import ContributionSkyline, { type ContributionDay } from '@/components/ui/contribution-skyline';
import { SOCIAL_LINKS } from '@/lib/data';
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

async function fetchContributions(): Promise<ContributionDay[] | null> {
    try {
        const res = await fetch(CONTRIBUTIONS_URL, { next: { revalidate: 60 * 60 } });
        if (!res.ok) return null;
        const json: { contributions?: { date: string; count: number }[] } = await res.json();
        if (!Array.isArray(json.contributions) || json.contributions.length === 0) return null;
        return json.contributions.map(({ date, count }) => ({ date, count }));
    } catch {
        return null;
    }
}

const GithubActivity = async () => {
    const data = await fetchContributions();
    // Never show the component's generated sample year as if it were real activity.
    if (!data) return null;

    const github = SOCIAL_LINKS.find((l) => l.name === 'github')?.url ?? `https://github.com/${GITHUB_USER}`;

    return (
        <section className="py-20 md:py-section" id="github-activity">
            <div className="container">
                <SectionTitle title="GitHub Activity" />

                <div style={themeBridge}>
                    <ContributionSkyline
                        data={data}
                        palette="grape"
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
            </div>
        </section>
    );
};

export default GithubActivity;
