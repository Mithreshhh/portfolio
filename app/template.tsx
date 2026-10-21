'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export default function Template({ children }: { children: React.ReactNode }) {
    useGSAP(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set('.page-transition', { yPercent: -100 });
            return;
        }

        const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

        tl.to('.page-transition--inner', {
            yPercent: 0,
            duration: 0.2,
        })
            .to('.page-transition--inner', {
                yPercent: -100,
                duration: 0.2,
            })
            .to('.page-transition', {
                yPercent: -100,
                duration: 0.45,
            });
    });

    return (
        <div>
            {/* z-58 covers page content, the floating buttons and the menu, as the wipe should. */}
            <div className="page-transition w-screen h-screen fixed top-0 left-0 bg-background-light z-[58]">
                <div className="page-transition--inner w-screen h-screen fixed top-0 left-0 bg-primary z-[58] translate-y-full"></div>
            </div>

            {children}
        </div>
    );
}
