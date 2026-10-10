'use client';
import Button from '@/components/Button';
import MusicVisualizer from '@/components/MusicVisualizer';
import { GENERAL_INFO, PROJECTS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowDown, FileText, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// three.js is ~150 kB gzipped; keep it out of the first paint.
const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false });

const Banner = ({ contributionsLastYear }: { contributionsLastYear?: number }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const liveProjects = PROJECTS.filter((p) => p.status === 'live');
    const liveCount = liveProjects.length;

    // The scene is a map, not a decoration: one orbiting satellite per product that is live today.
    const satellites = liveProjects.map((p) => ({ label: p.title, sub: 'live', href: `/projects/${p.slug}` }));

    // Proof strip: hard facts a visitor can verify, not adjectives.
    const proof: { label: string; value: string; href?: string; live?: boolean }[] = [
        { label: 'Now', value: 'Full Stack Dev @ Menler', href: '#my-experience', live: true },
        { label: 'Shipped', value: `${liveCount} live products`, href: '#selected-projects' },
        ...(contributionsLastYear
            ? [{ label: 'GitHub', value: `${contributionsLastYear.toLocaleString('en-US')} contributions · last year`, href: '#github-activity' }]
            : []),
        { label: 'Open to', value: 'Internships · Freelance', href: '/hire-me' },
    ];

    useGSAP(
        () => {
            // Intro: copy rises in once the preloader is gone.
            gsap.from('.hero-in', {
                y: 28,
                opacity: 0,
                duration: 0.9,
                stagger: 0.08,
                ease: 'power3.out',
                delay: 0.2,
            });

            // Exit: fade the copy as the hero scrolls away.
            gsap.to('.hero-copy', {
                y: -120,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 75%',
                    end: 'bottom 15%',
                    scrub: 1,
                },
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-black via-black/60 to-transparent" id="banner">
            {/* 3D scene: right half on desktop, full-bleed and dimmed on phones. Only the labels take pointer events. */}
            <div className="pointer-events-none absolute inset-0 md:left-auto md:w-[58%]">
                <HeroScene
                    satellites={satellites}
                    className="absolute inset-0"
                    canvasClassName="absolute inset-0 opacity-35 md:opacity-100 [mask-image:radial-gradient(ellipse_70%_75%_at_60%_50%,black_45%,transparent_100%)]"
                />
                {liveCount > 0 && (
                    <p className="absolute bottom-10 right-6 hidden max-w-[220px] text-right text-[11px] uppercase leading-relaxed tracking-[0.22em] text-muted-foreground md:block lg:right-10">
                        In orbit: {liveCount} live {liveCount === 1 ? 'product' : 'products'}.
                        <br />
                        Click one to see how it was built.
                    </p>
                )}
            </div>

            <div
                ref={containerRef}
                className="container relative z-10 flex min-h-[560px] flex-col justify-center pb-36 pt-28 md:h-[100svh] md:pb-20 md:pt-24"
            >
                <div className="hero-copy max-w-[640px]">
                    <p className="hero-in flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                        <span className="text-foreground/90">Mithresh Uttarwar</span>
                        <span aria-hidden="true">·</span>
                        <span>B.Tech CS &apos;27 · CGPA 8.66</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                            <MapPin size={12} aria-hidden="true" />
                            Hyderabad, India
                        </span>
                    </p>

                    <h1 className="hero-in mt-6 font-anton text-[58px] leading-[0.92] sm:text-[80px] md:text-[96px] lg:text-[110px]">
                        <span className="block text-foreground text-glow">FULL STACK</span>
                        <span className="text-outline block">DEVELOPER</span>
                    </h1>

                    <p className="hero-in mt-7 max-w-[520px] text-base leading-relaxed text-muted-foreground md:text-lg">
                        Hi, I&apos;m <span className="font-medium text-foreground">Mithresh</span>. I build with React,
                        Next.js, Node.js and REST APIs — currently shipping production LMS infrastructure at an
                        early-stage AI EdTech startup.
                    </p>

                    <div className="hero-in mt-9 flex flex-wrap items-center gap-3">
                        <Button as="link" href="/hire-me" variant="primary" className="px-8">
                            Hire me
                        </Button>
                        <Button
                            as="link"
                            href={GENERAL_INFO.resume}
                            target="_blank"
                            variant="no-color"
                            className="border border-foreground/40 px-6 text-foreground hover:border-foreground hover:bg-foreground/10 hover:text-foreground"
                        >
                            <span className="inline-flex items-center gap-2 whitespace-nowrap">
                                <FileText size={16} aria-hidden="true" />
                                Resume
                            </span>
                        </Button>
                        <Button as="link" href="/#selected-projects" variant="link" className="px-4 hover:text-foreground">
                            <span className="inline-flex items-center gap-2 whitespace-nowrap">
                                See live work
                                <ArrowDown size={16} aria-hidden="true" className="transition-transform group-hover:translate-y-0.5" />
                            </span>
                        </Button>
                    </div>

                    <ul className="hero-in mt-12 flex flex-wrap gap-2.5" aria-label="At a glance">
                        {proof.map((s) => {
                            const inner = (
                                <>
                                    {s.live ? (
                                        <span className="relative flex size-2">
                                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/60 motion-reduce:animate-none" />
                                            <span className="relative inline-flex size-2 rounded-full bg-foreground" />
                                        </span>
                                    ) : (
                                        <span className="size-2 rounded-full bg-muted-foreground/60" />
                                    )}
                                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</span>
                                    <span className="text-foreground/90">{s.value}</span>
                                </>
                            );
                            const cls =
                                'flex items-center gap-2.5 rounded-full border border-border/70 bg-background/60 px-3.5 py-1.5 text-sm backdrop-blur-sm transition-colors hover:border-foreground/60';
                            return (
                                <li key={s.label}>
                                    {s.href ? (
                                        <a href={s.href} className={cls}>
                                            {inner}
                                        </a>
                                    ) : (
                                        <span className={cls}>{inner}</span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <a
                    href="#about-me"
                    className="hero-in absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground md:flex"
                >
                    Scroll
                    <span className="block h-10 w-px overflow-hidden bg-border">
                        <span className="block h-full w-full origin-top animate-[scrollhint_1.8s_ease-in-out_infinite] bg-foreground motion-reduce:animate-none" />
                    </span>
                </a>
            </div>

            <MusicVisualizer youtubeVideoId="vfnAYipqj1k" />
        </section>
    );
};

export default Banner;
