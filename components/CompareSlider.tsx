'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCallback, useRef, useState, type PointerEvent } from 'react';

interface CompareSliderProps {
    src: string;
    alt: string;
    /** CSS aspect-ratio value, e.g. '16/9'. Reserves space so the image never shifts layout. */
    aspect?: string;
    labels?: [string, string];
    className?: string;
    sizes?: string;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

export const CompareSlider = ({
    src,
    alt,
    aspect = '16/9',
    labels = ['Mono', 'Colour'],
    className,
    sizes = '(max-width: 768px) 100vw, 1000px',
}: CompareSliderProps) => {
    const stageRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dragging = useRef(false);
    const [pos, setPos] = useState(50);

    const setFromClientX = useCallback((clientX: number) => {
        const rect = stageRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0) return;
        setPos(clamp(((clientX - rect.left) / rect.width) * 100));
    }, []);

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        // Primary button only, so right-click / multi-touch don't start a drag.
        if (e.button !== 0) return;
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        // Hand focus to the range so arrow keys work right after a drag or tap.
        inputRef.current?.focus({ preventScroll: true });
        setFromClientX(e.clientX);
    };
    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (dragging.current) setFromClientX(e.clientX);
    };
    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        dragging.current = false;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    };

    const rounded = Math.round(pos);

    return (
        <div
            ref={stageRef}
            className={cn(
                'group relative w-full select-none overflow-hidden rounded-2xl border border-border/50 bg-background-light/20 cursor-ew-resize',
                className,
            )}
            style={{ aspectRatio: aspect, touchAction: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            {/* Mono layer underneath; colour layer on top, clipped from the left edge to the divider. */}
            <Image src={src} alt={alt} fill sizes={sizes} draggable={false} className="pointer-events-none object-cover object-top grayscale" />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }} aria-hidden="true">
                <Image src={src} alt="" fill sizes={sizes} draggable={false} className="pointer-events-none object-cover object-top" />
            </div>

            <span className="pointer-events-none absolute left-3 top-3 rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-sm">
                {labels[0]}
            </span>
            <span className="pointer-events-none absolute right-3 top-3 rounded-md border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] text-foreground backdrop-blur-sm">
                {labels[1]}
            </span>

            {/* Divider + grip. The range input is the real control: hidden visually, but it carries focus and keyboard. */}
            <div className="pointer-events-none absolute inset-y-0 w-px -translate-x-1/2 bg-foreground" style={{ left: `${pos}%` }}>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <input
                        ref={inputRef}
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={rounded}
                        onChange={(e) => setPos(Number(e.target.value))}
                        aria-label="Compare slider"
                        aria-valuetext={`${rounded}% ${labels[1].toLowerCase()}`}
                        className="peer pointer-events-none absolute inset-0 size-full opacity-0"
                    />
                    <span
                        aria-hidden="true"
                        className="flex size-10 items-center justify-center rounded-full border border-foreground bg-background text-foreground shadow-[0_8px_24px_-8px_hsl(var(--foreground)/0.4)] transition-transform peer-focus-visible:ring-2 peer-focus-visible:ring-foreground peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background group-hover:scale-105"
                    >
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M4 1 1 5l3 4M10 1l3 4-3 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
};

interface CompareGalleryProps {
    images: string[];
    alt: string;
    id?: string;
    className?: string;
}

/** First screenshot gets the slider; the rest render as plain blocks underneath. */
export const CompareGallery = ({ images, alt, id, className }: CompareGalleryProps) => {
    const [first, ...rest] = images;
    if (!first) return null;
    return (
        <div id={id} className={cn('grid grid-cols-1 gap-3', className)}>
            <div>
                <CompareSlider src={first} alt={alt} />
            </div>
            {rest.map((image, i) => (
                <div key={image} className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-background-light/20" style={{ aspectRatio: '21/9' }}>
                    <Image
                        src={image}
                        alt={`${alt} ${i + 2}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 1000px"
                        className="object-cover object-top"
                    />
                </div>
            ))}
        </div>
    );
};

export default CompareSlider;
