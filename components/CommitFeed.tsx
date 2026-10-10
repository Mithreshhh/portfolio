import RelativeTime from '@/components/RelativeTime';
import { SOCIAL_LINKS } from '@/lib/data';
import { fetchRecentCommits, GITHUB_USER, relativeTime } from '@/lib/github';
import { ArrowUpRight, GitCommitHorizontal } from 'lucide-react';

const absoluteTime = (iso: string): string =>
    new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'UTC',
        timeZoneName: 'short',
    }).format(new Date(iso));

const CommitFeed = async () => {
    const commits = await fetchRecentCommits(3);
    // Rate limits and private-only weeks both yield nothing; the section simply omits the card.
    if (!commits || commits.length === 0) return null;

    const github = SOCIAL_LINKS.find((l) => l.name === 'github')?.url ?? `https://github.com/${GITHUB_USER}`;
    const now = Date.now();

    return (
        <div className="mt-4 rounded-2xl border border-border/50 bg-background-light/20 p-5 backdrop-blur-sm sm:p-6">
            <header className="flex items-center justify-between gap-4">
                <h3 className="font-anton text-xl uppercase leading-none tracking-wide sm:text-2xl">Latest commits</h3>
                <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Public repos</span>
            </header>

            <ol className="mt-4 divide-y divide-border/50" aria-label="Latest public commits">
                {commits.map((c) => (
                    <li key={c.sha} className="py-3 first:pt-0 last:pb-0">
                        <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                        >
                            <GitCommitHorizontal
                                size={16}
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-muted-foreground sm:mt-0"
                            />

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span className="rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">
                                        {c.repo}
                                    </span>
                                    <time
                                        dateTime={c.at}
                                        title={absoluteTime(c.at)}
                                        className="text-xs tabular-nums text-muted-foreground"
                                    >
                                        {/* Server label is a hydration-safe seed; the client refreshes it from `iso`. */}
                                        <RelativeTime iso={c.at} initial={relativeTime(c.at, now)} />
                                    </time>
                                </div>
                                <p className="mt-1 truncate text-sm text-foreground/85 underline-offset-4 group-hover:underline">
                                    {c.message || 'No commit message'}
                                </p>
                            </div>

                            <span className="col-start-2 font-mono text-xs tabular-nums text-muted-foreground sm:col-start-auto">
                                {c.sha.slice(0, 7)}
                            </span>
                        </a>
                    </li>
                ))}
            </ol>

            <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
                All activity on GitHub
                <ArrowUpRight size={13} aria-hidden="true" />
            </a>
        </div>
    );
};

export default CommitFeed;
