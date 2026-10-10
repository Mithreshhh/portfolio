'use client';
import TransitionLink from '@/components/TransitionLink';
import { MY_STACK } from '@/lib/data';
import { NO_USAGE_NOTE, SKILL_SYSTEMS, countUsage, getUsage, type SkillSystem } from '@/lib/skill-usage';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useState, type UIEvent } from 'react';

type StackKey = keyof typeof MY_STACK;
type StackItem = (typeof MY_STACK)[StackKey][number];

const ORDER: StackKey[] = ['languages', 'frontend', 'backend', 'database', 'cloud & tools'];

const GROUP_LABEL: Record<StackKey, string> = {
    languages: 'Languages',
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Databases',
    'cloud & tools': 'Cloud & Tools',
};

export const TechIcon = ({ src, alt, size = 28 }: { src: string; alt: string; size?: number }) => {
    const [failed, setFailed] = useState(false);
    if (!src || failed) {
        return (
            <span className="text-sm font-semibold text-muted-foreground" aria-hidden="true">
                {alt.charAt(0)}
            </span>
        );
    }
    return (
        <Image
            src={src}
            alt=""
            width={size}
            height={size}
            className="object-contain"
            style={{ width: size, height: size }}
            onError={() => setFailed(true)}
        />
    );
};

// Hash links scroll in place; routes go through the page transition.
const HeaderLink = ({ system }: { system: SkillSystem }) => {
    const title = system.note ? `${system.title} · ${system.note}` : system.title;
    const className =
        'group/head inline-flex items-center gap-0.5 rounded-sm text-[11px] uppercase tracking-[0.18em] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-1 focus-visible:ring-foreground/60';
    const content = (
        <>
            <span className="sm:hidden">{system.abbr}</span>
            <span className="hidden sm:inline">{system.short}</span>
            <ArrowUpRight
                size={11}
                aria-hidden="true"
                className="hidden opacity-0 transition-opacity group-hover/head:opacity-100 group-focus-visible/head:opacity-100 sm:inline"
            />
        </>
    );
    if (system.href.startsWith('/')) {
        return (
            <TransitionLink href={system.href} title={title} aria-label={`${system.title} case study`} className={className}>
                {content}
            </TransitionLink>
        );
    }
    return (
        <a href={system.href} title={title} aria-label={`${system.title}, see experience`} className={className}>
            {content}
        </a>
    );
};

const UsageCell = ({
    tech,
    system,
    note,
    align,
}: {
    tech: string;
    system: SkillSystem;
    note?: string;
    align: 'left' | 'center' | 'right';
}) => {
    // Hover has no equivalent on touch, so a tap pins the popover open.
    const [pinned, setPinned] = useState(false);

    if (!note) {
        return (
            <td className="px-1 py-2.5 text-center sm:px-2">
                <span aria-hidden="true" className="mx-auto block size-1 rounded-full bg-border/70" />
            </td>
        );
    }

    return (
        <td className="relative px-1 py-2.5 text-center sm:px-2">
            <button
                type="button"
                title={`${system.title}: ${note}`}
                aria-label={`${tech} used in ${system.title}: ${note}`}
                aria-pressed={pinned}
                onClick={() => setPinned((p) => !p)}
                onBlur={() => setPinned(false)}
                className="group/cell relative inline-grid size-7 place-items-center rounded-full outline-none focus-visible:ring-1 focus-visible:ring-foreground/60"
            >
                <span
                    aria-hidden="true"
                    className="block size-2 rounded-full bg-foreground transition-transform duration-300 group-hover/cell:scale-125 group-focus-visible/cell:scale-125"
                />
                {/* Kept out of layout until shown: an absolutely positioned popover still
                    widens the overflow-x-auto wrapper, which caused phantom scroll at 390px. */}
                <span
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute bottom-full z-20 mb-1.5 hidden w-max max-w-[180px] rounded-md border border-border/60 bg-background px-2.5 py-1.5 text-left text-[11px] normal-case leading-snug tracking-normal text-foreground/85 shadow-[0_12px_32px_-12px_hsl(var(--foreground)/0.25)] group-hover/cell:block group-focus-visible/cell:block',
                        pinned && 'block',
                        align === 'left' && 'left-0',
                        align === 'right' && 'right-0',
                        align === 'center' && 'left-1/2 -translate-x-1/2',
                    )}
                >
                    <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{system.short}</span>
                    {note}
                </span>
            </button>
        </td>
    );
};

const SkillRow = ({ item, scrolled }: { item: StackItem; scrolled: boolean }) => {
    const usage = getUsage(item.name);
    const count = countUsage(item.name);
    const last = SKILL_SYSTEMS.length - 1;

    return (
        <tr className="group/row border-t border-border/40 transition-colors hover:bg-foreground/[0.035]">
            <th
                scope="row"
                className={cn(
                    'sticky left-0 z-10 py-2 pl-4 pr-3 text-left font-normal transition-shadow sm:pl-5',
                    scrolled && 'bg-background shadow-[8px_0_16px_-8px_hsl(var(--background))]',
                )}
            >
                <div className="flex items-center gap-2.5">
                    {/* Logos stay greyscale and regain colour when the row is hovered. */}
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-background/70 ring-1 ring-border/60 grayscale transition-[filter] duration-300 group-hover/row:grayscale-0">
                        <TechIcon src={item.icon} alt={item.name} size={16} />
                    </span>
                    <div className="min-w-0">
                        <p className="whitespace-nowrap text-sm leading-tight text-foreground/90">{item.name}</p>
                        <p className="whitespace-nowrap text-[10px] leading-tight text-muted-foreground/70 sm:hidden">
                            {count > 0 ? `used in ${count}` : `— ${NO_USAGE_NOTE}`}
                        </p>
                    </div>
                </div>
            </th>
            {SKILL_SYSTEMS.map((system, i) => (
                <UsageCell
                    key={system.key}
                    tech={item.name}
                    system={system}
                    note={usage[system.key]}
                    // Last two columns anchor right so an open popover never exceeds the table width.
                    align={i === 0 ? 'left' : i >= last - 1 ? 'right' : 'center'}
                />
            ))}
            <td className="hidden whitespace-nowrap py-2 pl-2 pr-4 text-right text-[11px] tabular-nums text-muted-foreground/70 sm:table-cell sm:pr-5">
                {count > 0 ? `used in ${count}` : `— ${NO_USAGE_NOTE}`}
            </td>
        </tr>
    );
};

const SkillMatrix = ({ className }: { className?: string }) => {
    const [scrolled, setScrolled] = useState(false);
    const onScroll = (e: UIEvent<HTMLDivElement>) => setScrolled(e.currentTarget.scrollLeft > 2);

    return (
        <div
            className={cn(
                'skill-matrix overflow-hidden rounded-2xl border border-border/50 bg-background-light/20 backdrop-blur-sm',
                className,
            )}
        >
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-4 pt-5 sm:px-5">
                <div>
                    <h3 className="font-anton text-xl uppercase leading-none tracking-wide sm:text-2xl">Where I used it</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        Each dot is a system the résumé ties the tool to. Hover or focus one for what it did.
                    </p>
                </div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {SKILL_SYSTEMS.length} systems
                </p>
            </div>

            <div onScroll={onScroll} className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className={cn(
                                    'sticky left-0 z-10 py-3 pl-4 pr-3 text-left text-[11px] font-normal uppercase tracking-[0.22em] text-muted-foreground sm:pl-5',
                                    scrolled && 'bg-background shadow-[8px_0_16px_-8px_hsl(var(--background))]',
                                )}
                            >
                                Skill
                            </th>
                            {SKILL_SYSTEMS.map((system) => (
                                <th
                                    key={system.key}
                                    scope="col"
                                    className="w-8 px-0.5 py-3 text-center font-normal sm:w-24 sm:px-2"
                                >
                                    <HeaderLink system={system} />
                                </th>
                            ))}
                            <th
                                scope="col"
                                className="hidden py-3 pl-2 pr-4 text-right text-[11px] font-normal uppercase tracking-[0.22em] text-muted-foreground sm:table-cell sm:pr-5"
                            >
                                Proof
                            </th>
                        </tr>
                    </thead>
                    {ORDER.map((key) => (
                        <tbody key={key} className="skill-row">
                            <tr className="border-t border-border/60 bg-background/30">
                                <th
                                    scope="rowgroup"
                                    className={cn(
                                        'sticky left-0 z-10 py-1.5 pl-4 pr-3 text-left text-[10px] font-normal uppercase tracking-[0.22em] text-muted-foreground/80 sm:pl-5',
                                        scrolled && 'bg-background',
                                    )}
                                >
                                    {GROUP_LABEL[key]}
                                </th>
                                <td colSpan={SKILL_SYSTEMS.length + 1} />
                            </tr>
                            {MY_STACK[key].map((item) => (
                                <SkillRow key={item.name} item={item} scrolled={scrolled} />
                            ))}
                        </tbody>
                    ))}
                </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border/40 px-4 py-3 text-[11px] text-muted-foreground sm:px-5">
                {/* Abbreviated headers need a key on narrow screens. */}
                <ul className="flex flex-wrap gap-x-3 gap-y-1 sm:hidden" aria-label="Column key">
                    {SKILL_SYSTEMS.map((s) => (
                        <li key={s.key}>
                            <span className="font-medium uppercase tracking-[0.14em] text-foreground/80">{s.abbr}</span> {s.title}
                        </li>
                    ))}
                </ul>
                <p>
                    {SKILL_SYSTEMS.filter((s) => s.note)
                        .map((s) => `${s.title}: ${s.note?.toLowerCase()}`)
                        .join(' · ')}
                    . Rows marked — are from coursework, not shipped work.
                </p>
            </div>
        </div>
    );
};

export default SkillMatrix;
