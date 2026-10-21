'use client';
import SectionTitle from '@/components/SectionTitle';
import TransitionLink from '@/components/TransitionLink';
import { PROJECTS, SOCIAL_LINKS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { IProject } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowRight, ArrowUpRight, Github, Globe } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATUS_LABEL: Record<NonNullable<IProject['status']>, string> = {
    live: 'Live',
    'in-progress': 'In development',
    'open-source': 'Open source',
    private: 'Private',
};

const ProjectCard = ({
    project,
    index,
    featured,
    orphan,
}: {
    project: IProject;
    index: number;
    featured: boolean;
    /** Last card of an odd remainder: goes full-width (row layout) on md so the grid has no hole. */
    orphan: boolean;
}) => {
    const image = (project.images && project.images[0]) || project.thumbnail;
    const href = `/projects/${project.slug}`;
    const live = project.status === 'live';
    const row = featured || orphan;

    return (
        <article
            className={cn(
                'project-card group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-background-light/20 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-foreground/40 hover:shadow-[0_24px_60px_-30px_hsl(var(--foreground)/0.25)]',
                featured && 'md:col-span-2 md:flex-row',
                orphan && 'md:col-span-2 md:flex-row',
            )}
        >
            {/* Screenshot: greyscale at rest, colour on hover. */}
            <TransitionLink
                href={href}
                aria-label={`${project.title} case study`}
                className={cn(
                    'relative block shrink-0 overflow-hidden bg-background',
                    row ? 'aspect-[16/10] md:aspect-auto md:w-[56%]' : 'aspect-[16/10]',
                    featured && 'md:min-h-[360px]',
                )}
            >
                <Image
                    src={image}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes={featured ? '(min-width: 768px) 640px, 100vw' : '(min-width: 768px) 560px, 100vw'}
                    className="object-cover object-top grayscale transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </TransitionLink>

            <div className={cn('flex flex-1 flex-col p-5 sm:p-6', featured && 'md:p-7')}>
                <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="tabular-nums">
                        {String(index + 1).padStart(2, '0')} · {project.year}
                    </span>
                    {project.status && (
                        <span
                            className={cn(
                                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 tracking-[0.16em]',
                                live ? 'border-foreground/60 text-foreground' : 'border-border text-muted-foreground',
                            )}
                        >
                            {live && <span className="size-1.5 rounded-full bg-foreground motion-safe:animate-pulse" />}
                            {STATUS_LABEL[project.status]}
                        </span>
                    )}
                </div>

                <h3
                    className={cn(
                        'mt-3 font-anton uppercase leading-none tracking-wide',
                        featured ? 'text-4xl sm:text-5xl' : 'text-3xl',
                    )}
                >
                    <TransitionLink href={href} className="transition-colors hover:text-foreground/80">
                        {project.title}
                    </TransitionLink>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{project.role}</p>

                <p className={cn('mt-3 leading-relaxed text-foreground/85', featured ? 'text-[15px] md:text-base' : 'text-sm')}>
                    {project.description}
                </p>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                        <li
                            key={tech}
                            className="rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground"
                        >
                            {tech}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-sm">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-foreground underline-offset-4 hover:underline"
                        >
                            <Globe size={15} aria-hidden="true" />
                            Live site
                            <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                    )}
                    {project.sourceCode && (
                        <a
                            href={project.sourceCode}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-foreground underline-offset-4 hover:underline"
                        >
                            <Github size={15} aria-hidden="true" />
                            Code
                            <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                    )}
                    <TransitionLink
                        href={href}
                        className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Case study
                        <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                    </TransitionLink>
                </div>
            </div>
        </article>
    );
};

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const liveCount = PROJECTS.filter((p) => p.status === 'live').length;
    const github = SOCIAL_LINKS.find((l) => l.name === 'github')?.url ?? 'https://github.com/Mithreshhh';

    useGSAP(
        () => {
            gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, i) => {
                gsap.from(card, {
                    y: 48,
                    opacity: 0,
                    duration: 0.8,
                    delay: (i % 2) * 0.08,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: card, start: 'top 88%', once: true },
                });
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="py-16 md:py-section" id="selected-projects">
            <div className="container" ref={containerRef}>
                <SectionTitle title="Featured Work" />

                <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                    <p className="max-w-[560px] text-base text-muted-foreground md:text-lg">
                        Things I&apos;ve shipped — {liveCount} of {PROJECTS.length} are live right now. Click through for
                        the full story on each.
                    </p>
                    <a
                        href={github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Github size={15} aria-hidden="true" />
                        More on GitHub
                        <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                </div>

                {/* First project is the hero card; the rest sit two-up, with a lone last card going wide. */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {PROJECTS.map((project, i) => (
                        <ProjectCard
                            key={project.slug}
                            project={project}
                            index={i}
                            featured={i === 0}
                            orphan={i === PROJECTS.length - 1 && (PROJECTS.length - 1) % 2 === 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectList;
