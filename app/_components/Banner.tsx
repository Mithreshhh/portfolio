'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import Button from '@/components/Button';
import { MusicPlayer } from '@/components/MusicPlayer';
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
                { y: 0 },
                { y: -150, opacity: 0, stagger: 0.02 },
            );
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden" id="banner">
            <ArrowAnimation />
            <div
                className="container h-[90svh] md:h-[100svh] min-h-[540px] max-md:pb-10 flex justify-between items-center max-md:flex-col max-md:pt-24"
                ref={containerRef}
            >
                <div className="max-md:grow max-md:flex flex-col justify-center items-start max-w-[544px]">
                    <h1 className="banner-title slide-up-and-fade leading-[1.02] md:leading-[.95] text-5xl sm:text-[64px] md:text-[80px] font-anton">
                        <span className="text-primary">FULL STACK</span>
                        <br /> <span className="ml-4">DEVELOPER</span>
                    </h1>
                    <p className="banner-description slide-up-and-fade mt-5 md:mt-6 text-base md:text-lg text-muted-foreground max-w-prose">
                        Hi! I&apos;m{' '}
                        <span className="font-medium text-foreground">
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
                        className="mt-7 md:mt-9 banner-button slide-up-and-fade"
                    >
                        Hire Me
                    </Button>
                </div>

                <div className="md:absolute bottom-[10%] right-[4%] flex md:flex-col gap-3 md:gap-8 text-center md:text-right mt-10 md:mt-0">
                    <div className="slide-up-and-fade">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-anton text-primary mb-1">
                            NOW
                        </h5>
                        <p className="text-muted-foreground">
                            SIH Project · VoltWorx · Freelance
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-anton text-primary mb-1">
                            OPEN TO
                        </h5>
                        <p className="text-muted-foreground">Internships · Freelance</p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-2xl sm:text-3xl md:text-4xl font-anton text-primary mb-1">
                            WIN
                        </h5>
                        <p className="text-muted-foreground">Ideathon Champion</p>
                    </div>
                </div>
            </div>
            
            {/* Music Player */}
            <MusicPlayer youtubeVideoId="vfnAYipqj1k" />
        </section>
    );
};

export default Banner;
