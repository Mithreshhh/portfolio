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
        <div className="relative flex items-center gap-3 rounded-xl border border-border/50 bg-background-light/40 px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-background-light/70 hover:shadow-[0_12px_32px_-14px_hsl(var(--primary)/0.55)]">
            {/* Logos sit in greyscale and regain their colour on hover. */}
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-background/70 ring-1 ring-border/60 grayscale transition-[transform,filter] duration-300 group-hover:scale-110 group-hover:grayscale-0">
                <TechIcon src={item.icon} alt={item.name} />
            </span>
            <span className="text-[15px] font-medium leading-tight text-foreground/90 transition-colors group-hover:text-foreground">
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
            const cards = gsap.utils.toArray<HTMLElement>('.skill-card');
            cards.forEach((card) => {
                gsap.from(card, {
                    y: 48,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: card, start: 'top 85%', once: true },
                });
                gsap.from(card.querySelectorAll('.skill-tile'), {
                    y: 16,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: card, start: 'top 80%', once: true },
                });
            });
        },
        { scope: containerRef },
    );

    return (
        <section id="my-stack" className="py-20 md:py-section" ref={containerRef}>
            <div className="container">
                <SectionTitle title="My Stack" />

                {/* Logo marquee: every tool at a glance. Pauses on hover; static with reduced motion. */}
                <div
                    className="group/marquee relative mb-14 overflow-hidden rounded-2xl border border-border/40 bg-background-light/30 py-5"
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

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {ORDER.map((key, index) => {
                        const meta = CATEGORY_META[key];
                        const Icon = meta.icon;
                        const items = MY_STACK[key];
                        const wide = index === ORDER.length - 1 && ORDER.length % 2 === 1;
                        return (
                            <article
                                key={key}
                                className={cn(
                                    'skill-card relative overflow-hidden rounded-2xl border border-border/50 bg-background-light/20 p-6 backdrop-blur-sm sm:p-7',
                                    wide && 'md:col-span-2',
                                )}
                            >
                                <div
                                    className={cn(
                                        'pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gradient-to-br blur-3xl',
                                        meta.accent,
                                    )}
                                />

                                <header className="relative mb-6 flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                                            <Icon size={20} />
                                        </span>
                                        <div>
                                            <h3 className="font-anton text-2xl uppercase leading-none tracking-wide sm:text-3xl">
                                                {meta.title}
                                            </h3>
                                            <p className="mt-1.5 text-sm text-muted-foreground">{meta.tagline}</p>
                                        </div>
                                    </div>
                                    <span className="shrink-0 rounded-full border border-border/60 px-2.5 py-1 text-xs tabular-nums text-muted-foreground">
                                        {items.length}
                                    </span>
                                </header>

                                <ul
                                    className={cn(
                                        'relative grid gap-3',
                                        wide ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2',
                                    )}
                                >
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
