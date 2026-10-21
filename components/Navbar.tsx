'use client';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';

const COLORS = [
    'bg-white text-black',
    'bg-neutral-300 text-black',
    'bg-neutral-500 text-white',
    'bg-neutral-700 text-white',
    'bg-neutral-200 text-black',
    'bg-neutral-400 text-black',
];

const SOCIAL_LABELS: Record<string, string> = {
    github: 'GitHub',
    linkedin: 'LinkedIn',
};

const MENU_LINKS = [
    {
        name: 'Home',
        url: '/',
    },
    {
        name: 'About Me',
        url: '/#about-me',
    },
    {
        name: 'Experience',
        url: '/#my-experience',
    },
    {
        name: 'GitHub',
        url: '/#github-activity',
    },
    {
        name: 'Projects',
        url: '/#selected-projects',
    },
    {
        name: 'Under the hood',
        url: '/#systems',
    },
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Off-screen links must not be reachable by Tab or a screen reader. Runs before the focus
    // effect below, which can't focus into the drawer while it is still inert.
    useEffect(() => {
        const drawer = drawerRef.current;
        if (!drawer) return;
        if (isMenuOpen) drawer.removeAttribute('inert');
        else drawer.setAttribute('inert', '');
    }, [isMenuOpen]);

    // Escape closes; focus moves into the drawer on open and back to the toggle on close.
    useEffect(() => {
        if (!isMenuOpen) return;
        drawerRef.current?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
                toggleRef.current?.focus({ preventScroll: true });
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isMenuOpen]);

    return (
        <>
            {/* Layering: above page content (up to z-20) and the floating buttons (z-50),
                below the real modals (music z-60, palette z-70) and the page wipe (z-58). */}
            <div className="sticky top-0 z-[57]">
                <button
                    ref={toggleRef}
                    type="button"
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls="site-menu"
                    className={cn(
                        // The pill keeps the lines legible when the toggle floats over page text.
                        'group size-12 absolute top-5 right-5 md:right-10 z-[2] rounded-full border border-border/60 bg-background/70 transition-[transform,border-color] duration-150 ease-out hover:border-foreground/40 active:scale-[0.95]',
                    )}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span
                        className={cn(
                            'inline-block w-1/2 h-0.5 bg-foreground rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 transition-transform duration-300 ease-out -translate-y-[4px] ',
                            {
                                'rotate-45 -translate-y-1/2': isMenuOpen,
                                'md:group-hover:rotate-12': !isMenuOpen,
                            },
                        )}
                    ></span>
                    <span
                        className={cn(
                            'inline-block w-1/2 h-0.5 bg-foreground rounded-full absolute left-1/2 -translate-x-1/2 top-1/2 transition-transform duration-300 ease-out translate-y-[4px] ',
                            {
                                '-rotate-45 -translate-y-1/2': isMenuOpen,
                                'md:group-hover:-rotate-12': !isMenuOpen,
                            },
                        )}
                    ></span>
                </button>
            </div>

            <div
                className={cn(
                    'overlay fixed inset-0 z-[55] bg-black/70 transition-[opacity,visibility] duration-200',
                    {
                        'opacity-0 invisible pointer-events-none': !isMenuOpen,
                    },
                )}
                onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Opens on the iOS sheet curve; closes faster than it opens. */}
            <div
                ref={drawerRef}
                id="site-menu"
                aria-label="Site menu"
                role="dialog"
                aria-modal={isMenuOpen}
                className={cn(
                    'fixed top-0 right-0 h-[100dvh] w-[500px] max-w-[calc(100vw-3rem)] transform translate-x-full transition-transform ease-drawer z-[56] overflow-hidden gap-y-14',
                    'flex flex-col lg:justify-center py-10',
                    isMenuOpen ? 'translate-x-0 duration-500' : 'duration-300',
                )}
            >
                <div
                    className={cn(
                        'fixed inset-0 scale-150 translate-x-1/2 rounded-[50%] bg-background-light transition-transform ease-drawer z-[-1]',
                        isMenuOpen ? 'translate-x-0 duration-500 delay-75' : 'duration-300',
                    )}
                ></div>

                <div className="grow flex md:items-center w-full max-w-[300px] mx-8 sm:mx-auto">
                    <div className="flex gap-10 lg:justify-between max-lg:flex-col w-full">
                        <div className="max-lg:order-2">
                            <p className="text-muted-foreground mb-5 md:mb-8">
                                SOCIAL
                            </p>
                            <ul className="space-y-3">
                                {SOCIAL_LINKS.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-lg underline-offset-4 hover:underline"
                                        >
                                            {SOCIAL_LABELS[link.name] ?? link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="">
                            <p className="text-muted-foreground mb-5 md:mb-8">
                                MENU
                            </p>
                            <ul className="space-y-3">
                                {MENU_LINKS.map((link, idx) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.url}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="group text-xl flex items-center gap-3"
                                        >
                                            <span
                                                className={cn(
                                                    'size-3.5 bg-white/20 rounded-full flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-[200%] group-focus-visible:scale-[200%]',
                                                    COLORS[idx],
                                                )}
                                            >
                                                <MoveUpRight
                                                    size={8}
                                                    aria-hidden="true"
                                                    className="scale-50 opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                                                />
                                            </span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-[300px] mx-8 sm:mx-auto">
                    <p className="text-muted-foreground mb-4">GET IN TOUCH</p>
                    <a href={`mailto:${GENERAL_INFO.email}`} className="underline-offset-4 hover:underline">
                        {GENERAL_INFO.email}
                    </a>
                </div>
            </div>
        </>
    );
};

export default Navbar;
