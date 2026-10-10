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

/** Drifting constellation of skill nodes that lean toward the cursor. White on black. */
export default function ParticleConstellation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
        window.addEventListener('mousemove', onMove);

        let raf = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
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
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;

                for (let j = i + 1; j < particles.length; j++) {
                    const o = particles[j];
                    const d = Math.hypot(p.x - o.x, p.y - o.y);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(o.x, o.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - d / 120) * 0.6})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                if (dist < 50) {
                    ctx.font = '12px monospace';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(p.label, p.x + 10, p.y - 10);
                }
            });

            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[0]" style={{ opacity: 0.5 }} />;
}
