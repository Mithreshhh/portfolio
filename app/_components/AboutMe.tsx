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
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-in',
                    trigger: container.current,
                    start: 'top 70%',
                    end: 'bottom bottom',
                    scrub: 0.5,
                },
            });

            tl.from('.slide-up-and-fade', {
                y: 150,
                opacity: 0,
                stagger: 0.05,
            });
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
        <section className="pb-20 md:pb-section" id="about-me">
            <div className="container" ref={container}>
                <h2 className="text-4xl md:text-6xl font-thin mb-20 slide-up-and-fade">
                    I believe in a user centered design approach, ensuring that
                    every project I work on is tailored to meet the specific
                    needs of its users.
                </h2>

                <p className="pb-3 border-b text-muted-foreground slide-up-and-fade">
                    This is me.
                </p>

                <div className="grid md:grid-cols-12 mt-9">
                    <div className="md:col-span-5">
                        <p className="text-4xl xs:text-5xl slide-up-and-fade">
                            Hi, I&apos;m Mithresh.
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <div className="text-base md:text-lg text-muted-foreground md:max-w-[450px]">
                            <p className="slide-up-and-fade">
                                I&apos;m a full stack developer turning ideas into
                                reliable, scalable applications. I work across
                                the stack to craft seamless, intuitive user
                                experiences backed by robust APIs and data
                                layers.
                            </p>
                            <p className="mt-3 slide-up-and-fade">
                                My approach focuses on creating scalable,
                                high-performing solutions tailored to both user
                                needs and business objectives. By prioritizing
                                performance, accessibility, and responsiveness,
                                I strive to deliver experiences that not only
                                engage users but also drive tangible results.
                            </p>
                            <p className="mt-3 slide-up-and-fade">
                                I&apos;m currently learning Machine Learning and
                                exploring ways to integrate ML/AI features into
                                real-world projects — starting with data
                                preprocessing, model training, and deployment
                                pipelines.
                            </p>
                            <p className="mt-3 slide-up-and-fade">
                                Education: pursuing my degree at college with a
                                current CGPA of <span className="text-foreground font-medium">8.8</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
