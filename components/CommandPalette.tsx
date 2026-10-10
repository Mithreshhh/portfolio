'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';
import {
    Briefcase,
    Check,
    Copy,
    CornerDownLeft,
    FileText,
    FolderGit2,
    Github,
    GitCommitHorizontal,
    Home,
    Layers,
    Linkedin,
    Mail,
    Search,
    Sparkles,
    UserRound,
    X,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GENERAL_INFO, PROJECTS, SOCIAL_LINKS } from '@/lib/data';
import { useScrolledPast } from '@/lib/useScrolledPast';
import type { IProject } from '@/types';

type Group = 'Sections' | 'Projects' | 'Actions';

interface PaletteItem {
    id: string;
    group: Group;
    label: string;
    /** Secondary text shown after the label. */
    hint?: string;
    /** Small status chip (projects only). */
    chip?: string;
    keywords: string[];
    icon: LucideIcon;
    run: () => void;
}

const GROUP_ORDER: Group[] = ['Sections', 'Projects', 'Actions'];

const SECTIONS: { label: string; hash: string | null; keywords: string[]; icon: LucideIcon }[] = [
    { label: 'Home', hash: null, keywords: ['top', 'hero', 'start'], icon: Home },
    { label: 'Featured work', hash: 'selected-projects', keywords: ['projects', 'portfolio', 'work'], icon: FolderGit2 },
    { label: 'Experience', hash: 'my-experience', keywords: ['jobs', 'career', 'menler', 'internship'], icon: Briefcase },
    { label: 'GitHub', hash: 'github-activity', keywords: ['commits', 'activity', 'contributions'], icon: GitCommitHorizontal },
    { label: 'Stack', hash: 'my-stack', keywords: ['skills', 'tech', 'tools', 'languages'], icon: Layers },
    { label: 'About', hash: 'about-me', keywords: ['bio', 'me', 'education'], icon: UserRound },
    { label: 'Contact', hash: 'contact', keywords: ['email', 'footer', 'reach'], icon: Mail },
];

const STATUS_LABEL: Record<NonNullable<IProject['status']>, string> = {
    live: 'Live',
    'in-progress': 'In dev',
    'open-source': 'Open source',
    private: 'Private',
};

const FOCUSABLE = 'input, button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

function matches(item: PaletteItem, query: string) {
    if (!query) return true;
    const hay = [item.label, item.hint ?? '', ...item.keywords].join(' ').toLowerCase();
    // Every whitespace-separated token must appear somewhere; order doesn't matter.
    return query.split(/\s+/).every((t) => hay.includes(t));
}

/** Bolds the first substring match so the eye lands on why an item matched. */
function Highlight({ text, query }: { text: string; query: string }) {
    const token = query.split(/\s+/).find((t) => t && text.toLowerCase().includes(t));
    if (!token) return <>{text}</>;
    const i = text.toLowerCase().indexOf(token);
    return (
        <>
            {text.slice(0, i)}
            <span className="text-foreground underline decoration-foreground/40 underline-offset-4">
                {text.slice(i, i + token.length)}
            </span>
            {text.slice(i + token.length)}
        </>
    );
}

export default function CommandPalette() {
    const router = useRouter();
    const pathname = usePathname();
    const lenis = useLenis();
    const scrolled = useScrolledPast();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const [toast, setToast] = useState<string | null>(null);
    const [isMac, setIsMac] = useState(false);

    const dialogRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const restoreFocusRef = useRef<HTMLElement | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout>>();
    // Hover and keyboard both move the selection; only keyboard should scroll the list.
    const viaKeyboard = useRef(false);

    useEffect(() => {
        setIsMac(/mac|iphone|ipad/i.test(navigator.platform));
    }, []);

    const close = useCallback(() => setOpen(false), []);

    const showToast = useCallback((message: string) => {
        setToast(message);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 1600);
    }, []);

    const goToSection = useCallback(
        (hash: string | null) => {
            close();
            if (pathname !== '/') {
                router.push(hash ? `/#${hash}` : '/');
                return;
            }
            const target = hash ? `#${hash}` : 0;
            if (lenis) lenis.scrollTo(target);
            else if (hash) window.location.hash = hash;
            else window.scrollTo({ top: 0 });
        },
        [close, lenis, pathname, router],
    );

    const copyEmail = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(GENERAL_INFO.email);
            showToast('Copied');
        } catch {
            showToast("Couldn't copy");
        }
        // Palette stays open here, so keep the dialog's key handling alive.
        inputRef.current?.focus();
    }, [showToast]);

    const openExternal = useCallback(
        (url: string) => {
            close();
            window.open(url, '_blank', 'noopener,noreferrer');
        },
        [close],
    );

    const items = useMemo<PaletteItem[]>(() => {
        const github = SOCIAL_LINKS.find((s) => s.name === 'github')?.url;
        const linkedin = SOCIAL_LINKS.find((s) => s.name === 'linkedin')?.url;

        const sections: PaletteItem[] = SECTIONS.map((s) => ({
            id: `section-${s.hash ?? 'home'}`,
            group: 'Sections',
            label: s.label,
            keywords: s.keywords,
            icon: s.icon,
            run: () => goToSection(s.hash),
        }));

        const projects: PaletteItem[] = PROJECTS.map((p) => ({
            id: `project-${p.slug}`,
            group: 'Projects',
            label: p.title,
            hint: String(p.year),
            chip: p.status ? STATUS_LABEL[p.status] : undefined,
            keywords: [p.slug, p.role, ...p.techStack],
            icon: FolderGit2,
            run: () => {
                close();
                router.push(`/projects/${p.slug}`);
            },
        }));

        const actions: PaletteItem[] = [
            {
                id: 'copy-email',
                group: 'Actions',
                label: 'Copy email',
                hint: GENERAL_INFO.email,
                keywords: ['mail', 'clipboard', 'contact'],
                icon: Copy,
                run: copyEmail,
            },
            {
                id: 'resume',
                group: 'Actions',
                label: 'Open resume',
                hint: 'PDF',
                keywords: ['cv', 'download'],
                icon: FileText,
                run: () => openExternal(GENERAL_INFO.resume),
            },
            {
                id: 'hire',
                group: 'Actions',
                label: 'Hire me',
                hint: 'Internships · freelance',
                keywords: ['work', 'freelance', 'internship', 'contact'],
                icon: Sparkles,
                run: () => {
                    close();
                    router.push('/hire-me');
                },
            },
        ];
        if (github) {
            actions.push({
                id: 'github',
                group: 'Actions',
                label: 'GitHub profile',
                hint: 'github.com/Mithreshhh',
                keywords: ['code', 'repos', 'source'],
                icon: Github,
                run: () => openExternal(github),
            });
        }
        if (linkedin) {
            actions.push({
                id: 'linkedin',
                group: 'Actions',
                label: 'LinkedIn profile',
                keywords: ['social', 'network'],
                icon: Linkedin,
                run: () => openExternal(linkedin),
            });
        }

        return [...sections, ...projects, ...actions];
    }, [close, copyEmail, goToSection, openExternal, router]);

    const q = query.trim().toLowerCase();
    const visible = useMemo(() => items.filter((i) => matches(i, q)), [items, q]);
    const activeItem = visible[active];

    // Global shortcut.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Open/close side effects: reset state, lock scroll, move focus and give it back.
    useEffect(() => {
        if (!open) return;
        setQuery('');
        setActive(0);
        setToast(null);
        restoreFocusRef.current = document.activeElement as HTMLElement | null;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const focusTimer = setTimeout(() => inputRef.current?.focus(), 0);
        return () => {
            clearTimeout(focusTimer);
            document.body.style.overflow = prevOverflow;
            restoreFocusRef.current?.focus?.();
        };
    }, [open]);

    useEffect(() => () => clearTimeout(toastTimer.current), []);

    // Keep the keyboard-selected row in view.
    useEffect(() => {
        if (!viaKeyboard.current || !activeItem) return;
        viaKeyboard.current = false;
        listRef.current
            ?.querySelector<HTMLElement>(`[data-id="${activeItem.id}"]`)
            ?.scrollIntoView({ block: 'nearest' });
    }, [active, activeItem]);

    const onDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            close();
            return;
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (!visible.length) return;
            viaKeyboard.current = true;
            const dir = e.key === 'ArrowDown' ? 1 : -1;
            setActive((i) => (i + dir + visible.length) % visible.length);
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            activeItem?.run();
            return;
        }
        if (e.key === 'Tab') {
            // Focus trap: cycle between the input and the close button.
            const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
            if (!nodes?.length) return;
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    };

    const shortcut = isMac ? '⌘K' : 'Ctrl K';

    return (
        <>
            {/* Launcher: hidden over the hero so it doesn't compete with the real CTAs. */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                tabIndex={scrolled ? 0 : -1}
                aria-hidden={!scrolled}
                aria-label={`Open command palette (${shortcut})`}
                title={`Command palette · ${shortcut}`}
                className={cn(
                    'fixed bottom-6 left-6 z-50 flex size-14 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground shadow-lg backdrop-blur-sm transition-[opacity,transform,background-color,color] duration-300',
                    'hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    scrolled ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4',
                )}
            >
                <span className="font-anton text-[13px] uppercase leading-none tracking-wide">{shortcut}</span>
            </button>

            {open && (
                <div
                    data-lenis-prevent
                    className="fixed inset-0 z-[70] flex items-start justify-center px-4 pb-4 pt-[10vh] sm:pt-[14vh]"
                >
                    <button
                        type="button"
                        aria-label="Close command palette"
                        tabIndex={-1}
                        onClick={close}
                        className="absolute inset-0 bg-background/70 backdrop-blur-[2px] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150"
                    />

                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Command palette"
                        onKeyDown={onDialogKeyDown}
                        className={cn(
                            'relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/95 text-foreground shadow-2xl backdrop-blur-md',
                            'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-2 motion-safe:duration-150',
                        )}
                    >
                        {/* Input */}
                        <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
                            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                            <input
                                ref={inputRef}
                                type="text"
                                role="combobox"
                                aria-expanded="true"
                                aria-controls="cmdk-list"
                                aria-autocomplete="list"
                                aria-activedescendant={activeItem ? `cmdk-${activeItem.id}` : undefined}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setActive(0);
                                }}
                                placeholder="Jump to…"
                                autoComplete="off"
                                spellCheck={false}
                                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/70 sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={close}
                                aria-label="Close"
                                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <X className="size-4" aria-hidden />
                            </button>
                        </div>

                        {/* Results */}
                        <div
                            ref={listRef}
                            id="cmdk-list"
                            role="listbox"
                            aria-label="Results"
                            // Rows aren't focusable; without this a click would move focus to <body>
                            // and the dialog's Escape/arrow handling and focus trap would stop working.
                            onMouseDown={(e) => e.preventDefault()}
                            className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain py-2"
                        >
                            {visible.length === 0 && (
                                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                                    Nothing matches “{query.trim()}”.
                                </p>
                            )}

                            {GROUP_ORDER.map((group) => {
                                const rows = visible.filter((i) => i.group === group);
                                if (!rows.length) return null;
                                return (
                                    <div key={group} role="group" aria-labelledby={`cmdk-group-${group}`} className="px-2 pb-1">
                                        <p
                                            id={`cmdk-group-${group}`}
                                            className="px-2 pb-1 pt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                                        >
                                            {group}
                                        </p>
                                        {rows.map((item) => {
                                            const index = visible.indexOf(item);
                                            const selected = index === active;
                                            const Icon = item.icon;
                                            return (
                                                <div
                                                    key={item.id}
                                                    id={`cmdk-${item.id}`}
                                                    data-id={item.id}
                                                    role="option"
                                                    aria-selected={selected}
                                                    onMouseMove={() => {
                                                        if (!selected) setActive(index);
                                                    }}
                                                    onClick={() => item.run()}
                                                    className={cn(
                                                        'flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
                                                        selected ? 'bg-foreground/10 text-foreground' : 'text-foreground/85',
                                                    )}
                                                >
                                                    <Icon
                                                        className={cn(
                                                            'size-4 shrink-0',
                                                            selected ? 'text-foreground' : 'text-muted-foreground',
                                                        )}
                                                        aria-hidden
                                                    />
                                                    <span className="min-w-0 flex-1 truncate">
                                                        <Highlight text={item.label} query={q} />
                                                        {item.hint && (
                                                            <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
                                                                {item.hint}
                                                            </span>
                                                        )}
                                                    </span>
                                                    {item.chip && (
                                                        <span className="shrink-0 rounded-md border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                                            {item.chip}
                                                        </span>
                                                    )}
                                                    {selected && (
                                                        <CornerDownLeft
                                                            className="size-3.5 shrink-0 text-muted-foreground max-sm:hidden"
                                                            aria-hidden
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer: hints + toast */}
                        <div className="flex items-center justify-between gap-3 border-t border-border/50 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                            <span className="truncate">↑↓ navigate · ↵ open · esc close</span>
                            <span
                                role="status"
                                aria-live="polite"
                                className={cn(
                                    'flex shrink-0 items-center gap-1.5 text-foreground transition-opacity duration-200',
                                    toast ? 'opacity-100' : 'opacity-0',
                                )}
                            >
                                {toast && <Check className="size-3.5" aria-hidden />}
                                {toast}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
