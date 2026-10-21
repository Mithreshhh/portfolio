'use client';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowUpRight, Check, Copy, FileText, Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const TIME_ZONE = 'Asia/Kolkata';
// Half a minute keeps the clock honest without waking the tab every second.
const TICK_MS = 30_000;

const SOCIAL_ICONS = {
    github: Github,
    linkedin: Linkedin,
} as const;

const formatHyderabadTime = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hour12: false }).format(
        new Date(),
    );

const MAILTO = `mailto:${GENERAL_INFO.email}?subject=${encodeURIComponent(GENERAL_INFO.emailSubject)}&body=${encodeURIComponent(GENERAL_INFO.emailBody)}`;

const HireCard = ({
    className,
    primaryAction = 'hire',
}: {
    className?: string;
    /** On /hire-me itself the card can't link to /hire-me, so its lead action becomes an email. */
    primaryAction?: 'hire' | 'email';
}) => {
    // Null until mount so server and first client render agree.
    const [time, setTime] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [canCopy, setCanCopy] = useState(false);

    useEffect(() => {
        setTime(formatHyderabadTime());
        setCanCopy(typeof navigator !== 'undefined' && !!navigator.clipboard?.writeText);
        const id = window.setInterval(() => setTime(formatHyderabadTime()), TICK_MS);
        return () => window.clearInterval(id);
    }, []);

    useEffect(() => {
        if (!copied) return;
        const id = window.setTimeout(() => setCopied(false), 1500);
        return () => window.clearTimeout(id);
    }, [copied]);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(GENERAL_INFO.email);
            setCopied(true);
        } catch {
            // Permission denied or insecure context: hand off to the mail client instead.
            window.location.href = `mailto:${GENERAL_INFO.email}`;
        }
    };

    const emailClasses =
        'group flex w-full items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2.5 text-left text-sm transition-[border-color,transform] duration-150 ease-out hover:border-foreground/40 active:scale-[0.99]';
    const primaryClasses =
        'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-4 font-anton text-base uppercase tracking-widest text-primary-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-primary/85 active:scale-[0.97]';

    return (
        <div
            className={cn(
                'rounded-2xl border border-border/50 bg-background-light/20 p-5 backdrop-blur-sm sm:p-6',
                className,
            )}
        >
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="inline-flex items-center gap-2.5 text-sm text-foreground">
                    <span className="relative flex size-2.5 shrink-0" aria-hidden="true">
                        <span className="absolute inset-0 animate-ping rounded-full bg-foreground/60 motion-reduce:animate-none" />
                        <span className="relative size-2.5 rounded-full bg-foreground" />
                    </span>
                    Open to internships · freelance
                </p>
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Hyderabad ·{' '}
                    <time className="tabular-nums text-foreground/85" suppressHydrationWarning dateTime={time ?? undefined}>
                        {time ?? '--:--'}
                    </time>{' '}
                    IST
                </p>
            </div>

            {/* Side-by-side only where a cell can hold "WORK WITH ME" on one line; the md aside is too narrow. */}
            <div className="mt-5 grid grid-cols-1 gap-2.5 xs:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                {primaryAction === 'email' ? (
                    <a href={MAILTO} className={primaryClasses}>
                        <Mail size={16} aria-hidden="true" />
                        Email me
                    </a>
                ) : (
                    <Link href="/hire-me" className={primaryClasses}>
                        Work with me
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                )}
                <a
                    href={GENERAL_INFO.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border/60 bg-background/60 px-4 font-anton text-base uppercase tracking-widest text-foreground transition-[border-color,transform] duration-150 ease-out hover:border-foreground/40 active:scale-[0.97]"
                >
                    <FileText size={16} aria-hidden="true" />
                    Resume
                </a>
            </div>

            <div className="mt-2.5">
                {canCopy ? (
                    <button type="button" onClick={copyEmail} className={emailClasses} aria-label={`Copy email ${GENERAL_INFO.email}`}>
                        <span className="truncate text-foreground/85">{GENERAL_INFO.email}</span>
                        <span
                            aria-live="polite"
                            className="inline-flex shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-foreground"
                        >
                            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                            {copied ? 'Copied' : 'Copy'}
                        </span>
                    </button>
                ) : (
                    <a href={`mailto:${GENERAL_INFO.email}`} className={emailClasses}>
                        <span className="truncate text-foreground/85">{GENERAL_INFO.email}</span>
                        <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-foreground">
                            <ArrowUpRight size={13} aria-hidden="true" />
                            Email
                        </span>
                    </a>
                )}
            </div>

            <ul className="mt-4 flex items-center gap-2" aria-label="Social profiles">
                {SOCIAL_LINKS.map((link) => {
                    const Icon = SOCIAL_ICONS[link.name as keyof typeof SOCIAL_ICONS];
                    if (!Icon) return null;
                    return (
                        <li key={link.name}>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={link.name === 'github' ? 'GitHub profile' : 'LinkedIn profile'}
                                className="inline-flex size-9 items-center justify-center rounded-md border border-border/60 bg-background/60 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                            >
                                <Icon size={16} aria-hidden="true" />
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default HireCard;
