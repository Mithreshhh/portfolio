'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import Button from '@/components/Button';
import MusicVisualizer from '@/components/MusicVisualizer';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    // move the content a little up on scroll
    useGSAP(
        () => {
            // Ensure elements are visible initially
            gsap.set('.slide-up-and-fade', { opacity: 1, y: 0, visibility: 'visible' });
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 70%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });

            tl.fromTo(
                '.slide-up-and-fade',
                { y: 0, opacity: 1 },
                { y: -150, opacity: 0, stagger: 0.02 },
            );
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden" id="banner">
            <ArrowAnimation />
            <div
                className="container h-[90svh] md:h-[100svh] min-h-[540px] max-md:pb-10 flex justify-between items-center max-md:flex-col max-md:pt-24 relative z-10"
                ref={containerRef}
            >
                <div className="max-md:grow max-md:flex flex-col justify-center items-start max-w-[544px] relative z-10">
                    <h1 className="banner-title slide-up-and-fade leading-[1.02] md:leading-[.95] text-5xl sm:text-[64px] md:text-[80px] font-anton text-foreground opacity-100" style={{ opacity: 1, color: 'inherit' }}>
                        <span className="text-primary" style={{ color: 'hsl(var(--primary))' }}>FULL STACK</span>
                        <br /> <span className="ml-4 text-foreground hover:text-primary smooth-transition" style={{ color: 'hsl(var(--foreground))' }}>DEVELOPER</span>
                    </h1>
                    <p className="banner-description slide-up-and-fade mt-5 md:mt-6 text-base md:text-lg text-muted-foreground max-w-prose leading-relaxed opacity-100" style={{ opacity: 1, color: 'hsl(var(--muted-foreground))' }}>
                        Hi! I&apos;m{' '}
                        <span className="font-medium text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Mithresh
                        </span>
                        . A full stack developer crafting scalable, responsive
                        web applications. I&apos;m currently learning machine
                        learning and looking forward to building
                        ML/AI-powered features and projects.
                    </p>
                    <Button
                        as="link"
                        href="/hire-me"
                        variant="primary"
                        className="mt-7 md:mt-9 banner-button slide-up-and-fade group hover:scale-105 smooth-transition hover:shadow-2xl hover:shadow-primary/30"
                    >
                        Hire Me
                    </Button>
                </div>

                <div className="md:absolute bottom-[10%] right-[4%] flex md:flex-col gap-3 md:gap-8 text-center md:text-right mt-10 md:mt-0 z-[1]">
                    <div className="info-card rounded-2xl px-6 py-4 bg-background/90 backdrop-blur-md border-2 border-primary/40 hover:border-primary/70 hover:bg-background smooth-transition hover:scale-105 hover:shadow-2xl hover:shadow-primary/30">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-anton text-primary mb-1 text-glow">
                            NOW
                        </h5>
                        <p className="text-foreground text-sm font-medium">
                            SIH Project · VoltWorx · Freelance
                        </p>
                    </div>
                    <div className="info-card rounded-2xl px-6 py-4 bg-background/90 backdrop-blur-md border-2 border-secondary/40 hover:border-secondary/70 hover:bg-background smooth-transition hover:scale-105 hover:shadow-2xl hover:shadow-secondary/30">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-anton text-secondary text-glow-secondary mb-1">
                            OPEN TO
                        </h5>
                        <p className="text-foreground text-sm font-medium">Internships · Freelance</p>
                    </div>
                    <div className="info-card rounded-2xl px-6 py-4 bg-background/90 backdrop-blur-md border-2 border-accent/40 hover:border-accent/70 hover:bg-background smooth-transition hover:scale-105 hover:shadow-2xl hover:shadow-accent/30">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-anton text-accent mb-1">
                            WIN
                        </h5>
                        <p className="text-foreground text-sm font-medium">Ideathon Champion</p>
                    </div>
                </div>
            </div>
            
            {/* Music Visualizer */}
            <MusicVisualizer youtubeVideoId="vfnAYipqj1k" />
        </section>
    );
};

export default Banner;
