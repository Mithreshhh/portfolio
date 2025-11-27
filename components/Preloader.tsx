'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef, useState, useEffect } from 'react';

gsap.registerPlugin(useGSAP);

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                defaults: {
                    ease: 'power2.inOut',
                },
            });

            // Animate name letters sliding up
            tl.to('.name-text span', {
                y: 0,
                stagger: 0.08,
                duration: 0.4,
                ease: 'back.out(1.7)',
            });

            // Wait a bit, then animate bars sliding down
            tl.to('.preloader-item', {
                delay: 0.8,
                y: '100%',
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.in',
            }, '-=0.2')
                // Fade out name text
                .to('.name-text span', { 
                    autoAlpha: 0,
                    y: -20,
                    stagger: 0.03,
                    duration: 0.3,
                }, '-=0.3')
                // Fade out entire preloader
                .to(
                    preloaderRef.current,
                    {
                        autoAlpha: 0,
                        duration: 0.4,
                        onComplete: () => {
                            setIsVisible(false);
                        },
                    },
                    '-=0.2',
                );
        },
        { scope: preloaderRef },
    );

    // Prevent body scroll during preloader
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex bg-background overflow-hidden" 
            ref={preloaderRef}
            style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
        >
            {/* Animated bars */}
            <div className="preloader-item h-full w-[10%] bg-gradient-to-b from-primary/20 to-background transition-all duration-300"></div>
            <div className="preloader-item h-full w-[10%] bg-gradient-to-b from-secondary/20 to-background transition-all duration-300"></div>
            <div className="preloader-item h-full w-[10%] bg-gradient-to-b from-accent/20 to-background transition-all duration-300"></div>
            <div className="preloader-item h-full w-[10%] bg-gradient-to-b from-primary/20 to-background transition-all duration-300"></div>
            <div className="preloader-item h-full w-[10%] bg-gradient-to-b from-secondary/20 to-background transition-all duration-300"></div>
            <div className="preloader-item h-full w-[10%] bg-gradient-to-b from-accent/20 to-background transition-all duration-300"></div>
            <div className="preloader-item h-full w-[10%] bg-gradient-to-b from-primary/20 to-background transition-all duration-300"></div>
            <div className="preloader-item h-full w-[10%] bg-gradient-to-b from-secondary/20 to-background transition-all duration-300"></div>
            <div className="preloader-item h-full w-[10%] bg-gradient-to-b from-accent/20 to-background transition-all duration-300"></div>
            <div className="preloader-item h-full w-[10%] bg-gradient-to-b from-primary/20 to-background transition-all duration-300"></div>

            {/* Name text */}
            <p className="name-text flex text-[20vw] lg:text-[200px] font-anton text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none overflow-hidden z-10">
                <span className="inline-block translate-y-full text-primary">M</span>
                <span className="inline-block translate-y-full text-secondary">I</span>
                <span className="inline-block translate-y-full text-accent">T</span>
                <span className="inline-block translate-y-full text-primary">H</span>
                <span className="inline-block translate-y-full text-secondary">R</span>
                <span className="inline-block translate-y-full text-accent">E</span>
                <span className="inline-block translate-y-full text-primary">S</span>
                <span className="inline-block translate-y-full text-secondary">H</span>
            </p>
        </div>
    );
};

export default Preloader;
