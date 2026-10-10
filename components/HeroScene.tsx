'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Hero backdrop: a wireframe planet with node points, two thin orbit rings
 * carrying satellites, and a star field — all white on black. Slow rotation,
 * mouse parallax, pauses when off-screen or the tab is hidden, and renders a
 * single static frame under prefers-reduced-motion.
 *
 * Imported with next/dynamic (ssr: false) so three.js stays out of the
 * initial bundle.
 */
const HeroScene = ({ className }: { className?: string }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        renderer.setClearColor(0x000000, 0);
        // The canvas must be sized in CSS pixels regardless of device pixel ratio;
        // the drawing buffer is scaled separately by setPixelRatio/setSize.
        Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%' });
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 0.2, 7.2);

        const WHITE = 0xffffff;
        const world = new THREE.Group();
        scene.add(world);

        // --- Planet -----------------------------------------------------------
        const planet = new THREE.Group();
        world.add(planet);

        const shellGeo = new THREE.IcosahedronGeometry(1.7, 2);
        const shell = new THREE.Mesh(
            shellGeo,
            new THREE.MeshBasicMaterial({ color: WHITE, wireframe: true, transparent: true, opacity: 0.22 }),
        );
        planet.add(shell);

        // Opaque core hides the far side of the wireframe so it reads as a solid body.
        const core = new THREE.Mesh(
            new THREE.SphereGeometry(1.66, 48, 48),
            new THREE.MeshBasicMaterial({ color: 0x050505 }),
        );
        planet.add(core);

        // Nodes at every vertex of the shell.
        const nodes = new THREE.Points(
            new THREE.BufferGeometry().setAttribute('position', shellGeo.getAttribute('position').clone()),
            new THREE.PointsMaterial({ color: WHITE, size: 0.045, transparent: true, opacity: 0.9, sizeAttenuation: true }),
        );
        planet.add(nodes);

        // Fresnel-style rim: a slightly larger back-facing sphere, additive.
        const rim = new THREE.Mesh(
            new THREE.SphereGeometry(1.74, 48, 48),
            new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.06, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
        );
        planet.add(rim);

        // --- Rings and satellites -------------------------------------------------
        const ringMat = new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.45 });
        const makeRing = (radius: number, tiltX: number, tiltZ: number) => {
            const g = new THREE.Group();
            g.rotation.set(tiltX, 0, tiltZ);
            g.add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.0075, 6, 240), ringMat));
            const sat = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), new THREE.MeshBasicMaterial({ color: WHITE }));
            const halo = new THREE.Mesh(
                new THREE.SphereGeometry(0.13, 12, 12),
                new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }),
            );
            sat.add(halo);
            g.add(sat);
            world.add(g);
            return { group: g, sat, radius };
        };
        const rings = [makeRing(2.55, 1.25, 0.35), makeRing(3.05, 1.05, -0.7)];

        // --- Stars ---------------------------------------------------------------
        const STAR_COUNT = 1800;
        const starPos = new Float32Array(STAR_COUNT * 3);
        for (let i = 0; i < STAR_COUNT; i++) {
            // Shell between r=9 and r=32 so nothing sits inside the planet.
            const r = 9 + Math.pow(Math.random(), 0.6) * 23;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            starPos[i * 3 + 2] = r * Math.cos(phi);
        }
        const stars = new THREE.Points(
            new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(starPos, 3)),
            new THREE.PointsMaterial({ color: WHITE, size: 0.07, transparent: true, opacity: 0.75, sizeAttenuation: true }),
        );
        scene.add(stars);

        // --- Interaction / loop ------------------------------------------------------
        const pointer = { x: 0, y: 0 };
        const target = { x: 0, y: 0 };
        const onPointerMove = (e: PointerEvent) => {
            target.x = (e.clientX / window.innerWidth) * 2 - 1;
            target.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });

        const resize = () => {
            const w = mount.clientWidth || 1;
            const h = mount.clientHeight || 1;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            // Keep the planet a similar on-screen size on very wide or very tall panels.
            camera.position.z = w / h > 1.5 ? 7.2 : w / h < 0.8 ? 9.5 : 8.2;
            camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(mount);

        let raf = 0;
        let visible = true;
        let hidden = document.hidden;
        const start = performance.now();
        let last = start;

        const frame = (now: number) => {
            raf = 0;
            const t = (now - start) / 1000;
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;

            // Entrance: scale in over ~1.2s.
            const s = 0.7 + 0.3 * (1 - Math.pow(1 - Math.min(1, t / 1.2), 3));
            world.scale.setScalar(s);

            // Parallax eases toward the pointer; the planet keeps turning on its own.
            pointer.x += (target.x - pointer.x) * (1 - Math.exp(-dt * 3));
            pointer.y += (target.y - pointer.y) * (1 - Math.exp(-dt * 3));
            world.rotation.y = pointer.x * 0.35;
            world.rotation.x = pointer.y * 0.2;
            world.position.y = Math.sin(t * 0.6) * 0.08;

            planet.rotation.y = t * 0.12;
            planet.rotation.x = Math.sin(t * 0.25) * 0.12;
            stars.rotation.y = t * 0.012;
            stars.rotation.x = t * 0.004;

            rings.forEach(({ group, sat, radius }, i) => {
                group.rotation.y = t * (i === 0 ? 0.08 : -0.05);
                const a = t * (i === 0 ? 0.5 : -0.34) + i * 2.1;
                sat.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
            });

            renderer.render(scene, camera);
            if (!reduced && visible && !hidden) raf = requestAnimationFrame(frame);
        };
        const kick = () => {
            if (!raf && visible && !hidden) {
                last = performance.now();
                raf = requestAnimationFrame(frame);
            }
        };

        const io = new IntersectionObserver(
            (entries) => {
                visible = entries.some((e) => e.isIntersecting);
                kick();
            },
            { threshold: 0.05 },
        );
        io.observe(mount);
        const onVisibility = () => {
            hidden = document.hidden;
            kick();
        };
        document.addEventListener('visibilitychange', onVisibility);

        kick();

        return () => {
            if (raf) cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            window.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('visibilitychange', onVisibility);
            scene.traverse((obj) => {
                if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
                    obj.geometry.dispose();
                    const m = obj.material;
                    if (Array.isArray(m)) m.forEach((x) => x.dispose());
                    else m.dispose();
                }
            });
            renderer.dispose();
            if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} aria-hidden="true" className={className} />;
};

export default HeroScene;
