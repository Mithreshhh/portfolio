'use client';
import parse from 'html-react-parser';
import TransitionLink from '@/components/TransitionLink';
import { PROJECTS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { IProject } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Github, Globe } from 'lucide-react';
import { useRef } from 'react';
import Image from 'next/image';

interface Props {
    project: IProject;
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATUS_LABEL: Record<NonNullable<IProject['status']>, string> = {
    live: 'Live',
    'in-progress': 'In development',
    private: 'Private',
};

const ProjectDetails = ({ project }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const index = PROJECTS.findIndex((p) => p.slug === project.slug);
    const next = PROJECTS[(index + 1) % PROJECTS.length];
    const live = project.status === 'live';

    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.set('.fade-in-later', {
                autoAlpha: 0,
                y: 30,
            });
            const tl = gsap.timeline({
                delay: 0.5,
            });

            tl.to('.fade-in-later', {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
            });
        },
        { scope: containerRef },
    );

    // Screenshots rise in as they enter the viewport.
    useGSAP(
        () => {
            gsap.utils.toArray<HTMLDivElement>('#images > div').forEach((imageDiv) => {
                gsap.from(imageDiv, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: imageDiv, start: 'top 90%', once: true },
                });
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="pt-5 pb-14">
            <div className="container" ref={containerRef}>
                <TransitionLink
                    back
                    href="/"
                    className="mb-8 inline-flex gap-2 items-center group h-12"
                >
                    <ArrowLeft className="group-hover:-translate-x-1 group-hover:text-primary transition-all duration-300" />
                    Back
                </TransitionLink>

                <div className="flex" id="info">
                    <div className="relative w-full">
                        <div className="mx-auto mb-8 max-w-[635px]">
                            <p className="fade-in-later flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                                <span className="tabular-nums">
                                    {String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')} · {project.year}
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
                            </p>
                            <h1 className="fade-in-later mt-4 font-anton text-4xl uppercase leading-none tracking-wide md:text-[60px]">
                                {project.title}
                            </h1>

                            <div className="fade-in-later mt-6 flex flex-wrap items-center gap-3">
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                                    >
                                        <Globe size={15} aria-hidden="true" />
                                        Open live site
                                        <ArrowUpRight size={13} aria-hidden="true" />
                                    </a>
                                )}
                                {project.sourceCode && (
                                    <a
                                        href={project.sourceCode}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="inline-flex h-10 items-center gap-2 rounded-md border border-foreground/40 px-4 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground/10"
                                    >
                                        <Github size={15} aria-hidden="true" />
                                        Source
                                        <ArrowUpRight size={13} aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="max-w-[635px] space-y-6 pb-12 mx-auto">
                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">
                                    Year
                                </p>

                                <div className="text-lg">{project.year}</div>
                            </div>
                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">
                                    Tech & Technique
                                </p>

                                <div className="text-lg">
                                    {project.techStack.join(', ')}
                                </div>
                            </div>
                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">
                                    Description
                                </p>

                                <div className="text-lg prose-xl markdown-text">
                                    {parse(project.description)}
                                </div>
                            </div>
                            {project.role && (
                                <div className="fade-in-later">
                                    <p className="text-muted-foreground font-anton mb-3">
                                        My Role
                                    </p>

                                    <div className="text-lg">
                                        {parse(project.role)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 max-w-[1000px] mx-auto" id="images">
                    {(project.images?.length ? project.images : [project.thumbnail]).map(
                        (image, idx) => (
                            <div
                                key={image}
                                className={
                                    idx === 0
                                        ? 'relative w-full aspect-[16/9] rounded-md overflow-hidden'
                                        : 'relative w-full aspect-[21/9] rounded-md overflow-hidden'
                                }
                            >
                                <Image
                                    src={image}
                                    alt="Project image"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 1000px"
                                    className="object-cover"
                                />
                                <a
                                    href={image}
                                    target="_blank"
                                    className="absolute top-3 right-3 bg-background/70 text-foreground size-10 inline-flex justify-center items-center transition-all opacity-0 hover:bg-primary hover:text-primary-foreground hover:opacity-100"
                                >
                                    <ExternalLink />
                                </a>
                            </div>
                        ),
                    )}
                </div>

                {/* Keep the visitor moving through the work instead of bouncing back to the top. */}
                {next && next.slug !== project.slug && (
                    <div className="mx-auto mt-14 max-w-[1000px] border-t border-border/50 pt-8">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Next project</p>
                        <TransitionLink
                            href={`/projects/${next.slug}`}
                            className="group mt-2 inline-flex items-center gap-3 font-anton text-3xl uppercase leading-none tracking-wide hover:text-foreground/80 sm:text-4xl"
                        >
                            {next.title}
                            <ArrowRight size={26} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                        </TransitionLink>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectDetails;
