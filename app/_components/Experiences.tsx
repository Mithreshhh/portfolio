'use client';
import SectionTitle from '@/components/SectionTitle';
import { EXPERIENCE_GROUPS } from '@/lib/data';
import {
    Briefcase,
    GraduationCap,
    Rocket,
    Trophy,
    Users,
    BadgeCheck,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                    end: 'bottom 50%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from('.experience-item', {
                y: 50,
                opacity: 0,
                stagger: 0.3,
            });
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 50%',
                    end: 'bottom 20%',
                    scrub: 1,
                },
            });

            tl.to(containerRef.current, {
                y: -150,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="py-section" id="my-experience">
            <div className="container" ref={containerRef}>
                <SectionTitle title="My Experience" />

                <div className="grid gap-14">
                    {EXPERIENCE_GROUPS.map((group) => {
                        const map: Record<string, any> = {
                            'Freelance / Client Work': Briefcase,
                            'College Projects': GraduationCap,
                            'Personal Projects': Rocket,
                            Competitions: Trophy,
                            'Club / Leadership Roles': Users,
                            Internships: BadgeCheck,
                        };
                        const Icon = map[group.title] || Briefcase;

                        return (
                            <div key={group.title} className="experience-item">
                                <div className="flex items-center gap-3 mb-5">
                                    <Icon className="text-primary" />
                                    <p className="text-5xl md:text-6xl font-anton leading-none">
                                        {group.title}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {group.items.map((item: any) => {
                                        const content = typeof item === 'string' ? (
                                            <span className="px-4 py-2 rounded-full border border-border/60 bg-background-light text-base md:text-lg text-foreground/90">
                                                {item}
                                            </span>
                                        ) : (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-4 py-2 rounded-full border border-border/60 bg-background-light text-base md:text-lg text-foreground/90 hover:border-primary/60 hover:text-primary"
                                            >
                                                {item.label}
                                            </a>
                                        );
                                        return (
                                            <span key={typeof item === 'string' ? item : item.label}>
                                                {content}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Experiences;
