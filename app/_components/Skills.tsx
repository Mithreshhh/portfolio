'use client';
import SectionTitle from '@/components/SectionTitle';
import SkillMatrix, { TechIcon } from '@/components/SkillMatrix';
import { MY_STACK } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type StackKey = keyof typeof MY_STACK;

const ORDER: StackKey[] = ['languages', 'frontend', 'backend', 'database', 'cloud & tools'];

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const allItems = ORDER.flatMap((key) => MY_STACK[key]);

    useGSAP(
        () => {
            // Reduced motion gets the final state straight away.
            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
                gsap.from('.skill-matrix', {
                    y: 24,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: '.skill-matrix', start: 'top 88%', once: true },
                });
                // Table rows don't transform reliably, so groups only fade in.
                gsap.from('.skill-row', {
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: '.skill-matrix', start: 'top 80%', once: true },
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

                {/* The matrix replaces the category tiles: each skill is proved by where it shipped. */}
                <SkillMatrix />
            </div>
        </section>
    );
};

export default Skills;
