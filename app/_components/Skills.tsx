'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_STACK } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Cloud, Code2, Database, LayoutTemplate, Server, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type StackKey = keyof typeof MY_STACK;
type StackItem = (typeof MY_STACK)[StackKey][number];

const CATEGORY_META: Record<StackKey, { title: string; tagline: string; icon: LucideIcon; accent: string }> = {
    languages: {
        title: 'Languages',
        tagline: 'What I think in',
        icon: Code2,
        accent: 'from-primary/25 to-primary/0',
    },
    frontend: {
        title: 'Frontend',
        tagline: 'Interfaces people enjoy using',
        icon: LayoutTemplate,
        accent: 'from-secondary/25 to-secondary/0',
    },
    backend: {
        title: 'Backend',
        tagline: 'APIs and the logic behind them',
        icon: Server,
        accent: 'from-accent/25 to-accent/0',
    },
    database: {
        title: 'Databases',
        tagline: 'Relational and document stores',
        icon: Database,
        accent: 'from-primary/25 to-primary/0',
    },
    'cloud & tools': {
        title: 'Cloud & Tools',
        tagline: 'Shipping, hosting and day-to-day workflow',
        icon: Cloud,
        accent: 'from-secondary/25 to-secondary/0',
    },
};

const ORDER: StackKey[] = ['languages', 'frontend', 'backend', 'database', 'cloud & tools'];

const TechIcon = ({ src, alt, size = 28 }: { src: string; alt: string; size?: number }) => {
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

const TechTile = ({ item }: { item: StackItem }) => (
    <li className="skill-tile group">
        <div className="relative flex items-center gap-2.5 rounded-xl border border-border/50 bg-background-light/40 py-2 pl-2 pr-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-background-light/70 hover:shadow-[0_12px_32px_-14px_hsl(var(--primary)/0.55)]">
            {/* Logos sit in greyscale and regain their colour on hover. */}
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-background/70 ring-1 ring-border/60 grayscale transition-[transform,filter] duration-300 group-hover:scale-110 group-hover:grayscale-0">
                <TechIcon src={item.icon} alt={item.name} size={20} />
            </span>
            <span className="text-sm font-medium leading-tight text-foreground/90 transition-colors group-hover:text-foreground">
                {item.name}
            </span>
        </div>
    </li>
);

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const allItems = ORDER.flatMap((key) => MY_STACK[key]);

    useGSAP(
        () => {
            const rows = gsap.utils.toArray<HTMLElement>('.skill-row');
            rows.forEach((row) => {
                gsap.from(row, {
                    y: 24,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: row, start: 'top 88%', once: true },
                });
                gsap.from(row.querySelectorAll('.skill-tile'), {
                    y: 12,
                    opacity: 0,
                    duration: 0.45,
                    stagger: 0.04,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: row, start: 'top 85%', once: true },
                });
            });
        },
        { scope: containerRef },
    );

    return (
        <section id="my-stack" className="py-16 md:py-section" ref={containerRef}>
            <div className="container">
                <SectionTitle title="My Stack" />

                {/* Logo marquee: every tool at a glance. Pauses on hover; static with reduced motion. */}
                <div
                    className="group/marquee relative mb-8 overflow-hidden rounded-2xl border border-border/40 bg-background-light/30 py-4"
                    style={{
                        maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
                        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
                    }}
                    aria-hidden="true"
                >
                    <div className="animate-marquee flex w-max gap-10 px-5 group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
                        {[...allItems, ...allItems].map((item, i) => (
                            <span key={`${item.name}-${i}`} className="flex items-center gap-2.5 text-sm text-muted-foreground grayscale">
                                <TechIcon src={item.icon} alt={item.name} size={22} />
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* One row per category: label on the left, tiles wrap on the right. No boxes, no holes. */}
                <div className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/50 bg-background-light/20 backdrop-blur-sm">
                    {ORDER.map((key) => {
                        const meta = CATEGORY_META[key];
                        const Icon = meta.icon;
                        const items = MY_STACK[key];
                        return (
                            <article
                                key={key}
                                className="skill-row relative grid grid-cols-1 gap-x-8 gap-y-4 p-5 md:grid-cols-[220px_1fr] md:items-start sm:px-6 md:py-6"
                            >
                                <div
                                    className={cn(
                                        'pointer-events-none absolute -left-10 -top-10 size-40 rounded-full bg-gradient-to-br blur-3xl',
                                        meta.accent,
                                    )}
                                />

                                <header className="relative flex items-center gap-3">
                                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                                        <Icon size={18} />
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className="font-anton text-xl uppercase leading-none tracking-wide sm:text-2xl">
                                            {meta.title}
                                            <span className="ml-2 align-middle font-roboto-flex text-xs font-normal normal-case tabular-nums text-muted-foreground">
                                                {items.length}
                                            </span>
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{meta.tagline}</p>
                                    </div>
                                </header>

                                <ul className="relative flex flex-wrap gap-2">
                                    {items.map((item) => (
                                        <TechTile key={item.name} item={item} />
                                    ))}
                                </ul>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Skills;
