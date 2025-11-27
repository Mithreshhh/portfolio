'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Ensure elements are visible initially (fallback if GSAP fails)
            gsap.set('.slide-up-and-fade', { opacity: 1, y: 0, visibility: 'visible' });
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-in',
                    trigger: container.current,
                    start: 'top 70%',
                    end: 'bottom bottom',
                    scrub: 0.5,
                },
            });

            // Use fromTo to ensure proper initial and final states
            tl.fromTo('.slide-up-and-fade', 
                {
                    y: 150,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.05,
                    duration: 1,
                }
            );
        },
        { scope: container },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-out',
                    trigger: container.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 0.5,
                },
            });

            tl.to('.slide-up-and-fade', {
                y: -150,
                opacity: 0,
                stagger: 0.02,
            });
        },
        { scope: container },
    );

    return (
        <section className="pb-20 md:pb-section relative" id="about-me">
            <div className="container" ref={container}>
                <h2 className="text-4xl md:text-6xl font-thin mb-20 slide-up-and-fade leading-relaxed hover:text-primary smooth-transition opacity-100" style={{ opacity: 1 }}>
                    I believe in a user centered design approach, ensuring that
                    every project I work on is tailored to meet the specific
                    needs of its users.
                </h2>

                <p className="pb-3 border-b border-border/50 text-muted-foreground slide-up-and-fade uppercase text-sm tracking-wider opacity-100" style={{ opacity: 1 }}>
                    This is me.
                </p>

                <div className="grid md:grid-cols-12 mt-9 gap-8">
                    <div className="md:col-span-5">
                        <p className="text-4xl xs:text-5xl slide-up-and-fade font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent opacity-100" style={{ opacity: 1 }}>
                            Hi, I&apos;m Mithresh.
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <div className="text-base md:text-lg text-muted-foreground md:max-w-[450px] space-y-4">
                            <p className="slide-up-and-fade leading-relaxed hover:text-foreground/90 smooth-transition opacity-100" style={{ opacity: 1 }}>
                                I&apos;m a full stack developer turning ideas into
                                reliable, scalable applications. I work across
                                the stack to craft seamless, intuitive user
                                experiences backed by robust APIs and data
                                layers.
                            </p>
                            <p className="slide-up-and-fade leading-relaxed hover:text-foreground/90 smooth-transition opacity-100" style={{ opacity: 1 }}>
                                My approach focuses on creating scalable,
                                high-performing solutions tailored to both user
                                needs and business objectives. By prioritizing
                                performance, accessibility, and responsiveness,
                                I strive to deliver experiences that not only
                                engage users but also drive tangible results.
                            </p>
                            <p className="slide-up-and-fade leading-relaxed hover:text-foreground/90 smooth-transition opacity-100" style={{ opacity: 1 }}>
                                I&apos;m currently learning Machine Learning and
                                exploring ways to integrate ML/AI features into
                                real-world projects — starting with data
                                preprocessing, model training, and deployment
                                pipelines.
                            </p>
                            <p className="slide-up-and-fade leading-relaxed glass rounded-lg px-4 py-3 border border-primary/20 opacity-100" style={{ opacity: 1 }}>
                                Education: pursuing my degree at college with a
                                current CGPA of <span className="text-primary font-bold text-xl">8.8</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
