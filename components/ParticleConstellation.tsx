'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    label: string;
}

const SKILLS = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Python',
    'MongoDB', 'PostgreSQL', 'Docker', 'Azure', 'Git',
    'Tailwind', 'GSAP', 'Express',
];

/**
 * Drifting constellation of skill nodes that lean toward the cursor. White on black.
 * Desktop only: on phones the dots sit over the text and read as noise, and the
 * canvas competes with scrolling. Draws at 1x and without shadow blur so a frame
 * costs almost nothing; pauses when the tab is hidden.
 */
export default function ParticleConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px), (hover: none)');
        if (mq.matches) return;

        const mouse = { x: -9999, y: -9999 };
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const particles: Particle[] = SKILLS.map((label) => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            label,
        }));

        const onMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', onMove, { passive: true });

        let raf = 0;
        const animate = () => {
            raf = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Links first, then dots, so dots sit on top. The halo is a second faint
            // circle rather than canvas shadowBlur, which is the single most expensive call here.
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const o = particles[j];
                    const d = Math.hypot(p.x - o.x, p.y - o.y);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(o.x, o.y);
                        ctx.strokeStyle = `rgba(255,255,255,${((1 - d / 120) * 0.6).toFixed(3)})`;
                        ctx.stroke();
                    }
                }
            }

            for (const p of particles) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 150 && dist > 0) {
                    p.vx += (dx / dist) * 0.1;
                    p.vy += (dy / dist) * 0.1;
                }
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.98;
                p.vy *= 0.98;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.12)';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.fill();

                if (dist < 50) {
                    ctx.font = '12px monospace';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(p.label, p.x + 10, p.y - 10);
                }
            }

            if (!document.hidden) raf = requestAnimationFrame(animate);
        };
        const kick = () => {
            if (!raf && !document.hidden) raf = requestAnimationFrame(animate);
        };
        document.addEventListener('visibilitychange', kick);
        kick();

        return () => {
            if (raf) cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('visibilitychange', kick);
        };
    }, []);

    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[0] hidden md:block" style={{ opacity: 0.5 }} />;
}
