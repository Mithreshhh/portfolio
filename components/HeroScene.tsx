'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import TransitionLink from '@/components/TransitionLink';

export interface Satellite {
    /** Shown next to the satellite. */
    label: string;
    /** Small muted suffix, e.g. "live". */
    sub?: string;
    /** Where clicking the label goes. */
    href: string;
}

/**
 * Hero scene: a dark planet drawn only by its lit rim, with one orbiting
 * satellite per shipped product. Each satellite carries a clickable label that
 * tracks its projected position and dims while it passes behind the planet.
 * White on black. Slow rotation, mouse parallax, pauses when off-screen or the
 * tab is hidden, and renders a single static frame under prefers-reduced-motion.
 *
 * Imported with next/dynamic (ssr: false) so three.js stays out of the
 * initial bundle.
 */
const HeroScene = ({
    className,
    canvasClassName,
    satellites = [],
}: {
    /** Wrapper: positions the scene and its labels. */
    className?: string;
    /** Canvas host only: masks and opacity go here so the labels stay crisp. */
    canvasClassName?: string;
    satellites?: Satellite[];
}) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

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
        renderer.domElement.setAttribute('aria-hidden', 'true');
        const host = mount.firstElementChild as HTMLElement;
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 0.2, 7.2);

        const WHITE = 0xffffff;
        const PLANET_R = 1.7;
        const world = new THREE.Group();
        scene.add(world);

        // --- Planet: a solid dark body lit by a thin white rim (eclipse look) --------
        // No wireframe, no vertex dots; the silhouette does the work.
        const planet = new THREE.Group();
        world.add(planet);

        const bodyMat = new THREE.ShaderMaterial({
            uniforms: {
                uLight: { value: new THREE.Vector3(-0.55, 0.45, 0.7).normalize() },
            },
            vertexShader: /* glsl */ `
                varying vec3 vN;
                varying vec3 vV;
                void main() {
                    vec4 mv = modelViewMatrix * vec4(position, 1.0);
                    vN = normalize(normalMatrix * normal);
                    vV = normalize(-mv.xyz);
                    gl_Position = projectionMatrix * mv;
                }
            `,
            fragmentShader: /* glsl */ `
                uniform vec3 uLight;
                varying vec3 vN;
                varying vec3 vV;
                void main() {
                    float facing = max(dot(normalize(vN), normalize(vV)), 0.0);
                    float rim = pow(1.0 - facing, 4.0);              // bright only at the edge
                    float lit = max(dot(normalize(vN), uLight), 0.0); // faint crescent toward the light
                    float v = 0.025 + lit * 0.06 + rim * 0.95;
                    gl_FragColor = vec4(vec3(v), 1.0);
                }
            `,
        });
        planet.add(new THREE.Mesh(new THREE.SphereGeometry(PLANET_R, 96, 96), bodyMat));

        // Soft halo just outside the limb.
        const haloShell = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            vertexShader: /* glsl */ `
                varying vec3 vN;
                varying vec3 vV;
                void main() {
                    vec4 mv = modelViewMatrix * vec4(position, 1.0);
                    vN = normalize(normalMatrix * normal);
                    vV = normalize(-mv.xyz);
                    gl_Position = projectionMatrix * mv;
                }
            `,
            fragmentShader: /* glsl */ `
                varying vec3 vN;
                varying vec3 vV;
                void main() {
                    float a = pow(max(dot(normalize(vN), normalize(vV)), 0.0), 6.0) * 0.5;
                    gl_FragColor = vec4(vec3(1.0), a);
                }
            `,
        });
        planet.add(new THREE.Mesh(new THREE.SphereGeometry(PLANET_R * 1.08, 64, 64), haloShell));

        // --- Orbits: one per satellite ----------------------------------------------
        const ringMat = new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.28 });
        const satMat = new THREE.MeshBasicMaterial({ color: WHITE });
        const haloMat = new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false });
        const makeRing = (radius: number, tiltX: number, tiltZ: number) => {
            const g = new THREE.Group();
            g.rotation.set(tiltX, 0, tiltZ);
            g.add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.006, 6, 240), ringMat));
            const sat = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), satMat);
            sat.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), haloMat));
            g.add(sat);
            world.add(g);
            return { group: g, sat, radius };
        };
        // Tilts are spread so the orbits read as a system rather than a stack.
        // Tighter, flatter orbits read as one calm system instead of a tangle.
        const ORBITS = [
            { r: 2.35, tx: 1.35, tz: 0.25, spin: 0.06, speed: 0.36 },
            { r: 2.75, tx: 1.25, tz: -0.35, spin: -0.04, speed: -0.26 },
            { r: 3.15, tx: 1.45, tz: 0.55, spin: 0.03, speed: 0.2 },
            { r: 3.55, tx: 1.2, tz: -0.75, spin: -0.025, speed: -0.16 },
        ];
        const count = Math.max(1, Math.min(satellites.length || 2, ORBITS.length));
        const rings = ORBITS.slice(0, count).map((o) => ({ ...makeRing(o.r, o.tx, o.tz), ...o }));

        // --- Stars ---------------------------------------------------------------
        const STAR_COUNT = 900;
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
            new THREE.PointsMaterial({ color: WHITE, size: 0.06, transparent: true, opacity: 0.6, sizeAttenuation: true }),
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

        let W = 1;
        let H = 1;
        const resize = () => {
            W = mount.clientWidth || 1;
            H = mount.clientHeight || 1;
            renderer.setSize(W, H);
            camera.aspect = W / H;
            // Keep the planet a similar on-screen size on very wide or very tall panels.
            camera.position.z = W / H > 1.5 ? 7.4 : W / H < 0.8 ? 9.8 : 8.4;
            camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(mount);

        // Scratch vectors for label placement.
        const v = new THREE.Vector3();
        const c = new THREE.Vector3();
        const placeLabels = () => {
            planet.getWorldPosition(c);
            const centerDist = c.distanceTo(camera.position);
            // Planet radius in screen px, from a point on the edge of its disk.
            v.copy(c).add(new THREE.Vector3(PLANET_R * world.scale.x, 0, 0)).project(camera);
            c.project(camera);
            const planetPx = Math.abs(v.x - c.x) * 0.5 * W;

            rings.forEach(({ sat }, i) => {
                const el = labelRefs.current[i];
                if (!el) return;
                sat.getWorldPosition(v);
                const behind = v.distanceTo(camera.position) > centerDist;
                v.project(camera);
                const x = (v.x + 1) * 0.5 * W;
                const y = (1 - v.y) * 0.5 * H;
                const dx = (v.x - c.x) * 0.5 * W;
                const dy = (v.y - c.y) * 0.5 * H;
                const offscreen = x < 0 || x > W || y < 0 || y > H;
                const occluded = offscreen || (behind && Math.hypot(dx, dy) < planetPx + 6);
                // Flip the label to the left when the satellite is on the right half.
                const left = x > W * 0.58;
                el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(${left ? '-100%' : '0'}, -50%)`;
                el.style.opacity = occluded ? '0' : '1';
                el.style.pointerEvents = occluded ? 'none' : 'auto';
                el.dataset.side = left ? 'left' : 'right';
            });
        };

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

            // The body is featureless, so its own spin is invisible; keep it still and let the orbits move.
            stars.rotation.y = t * 0.012;
            stars.rotation.x = t * 0.004;

            rings.forEach(({ group, sat, radius, spin, speed }, i) => {
                group.rotation.y = t * spin;
                const a = t * speed + i * 2.1;
                sat.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
            });

            world.updateMatrixWorld();
            renderer.render(scene, camera);
            placeLabels();
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
            if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
        };
        // Satellites are static site data; re-running the scene on identity changes is wasteful.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [satellites.length]);

    return (
        <div ref={mountRef} className={className}>
            {/* Canvas host: must stay the first child (the effect appends the canvas here). */}
            <div className={canvasClassName ?? 'absolute inset-0'} aria-hidden="true" />
            {/* Labels ride their satellites; the wrapper is positioned per frame, the link inside stays a plain link. */}
            {satellites.map((s, i) => (
                <div
                    key={s.href}
                    ref={(el) => {
                        labelRefs.current[i] = el;
                    }}
                    className="group absolute left-0 top-0 hidden opacity-0 transition-opacity duration-300 will-change-transform md:block"
                >
                    <TransitionLink
                        href={s.href}
                        className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border/70 bg-background/70 py-1 pl-2 pr-3 text-xs text-foreground/90 backdrop-blur-sm transition-colors hover:border-foreground/70 group-data-[side=left]:flex-row-reverse group-data-[side=left]:pl-3 group-data-[side=left]:pr-2"
                        aria-label={`${s.label}${s.sub ? `, ${s.sub}` : ''}: open case study`}
                    >
                        <span className="size-1.5 rounded-full bg-foreground" aria-hidden="true" />
                        <span>{s.label}</span>
                        {s.sub && <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.sub}</span>}
                    </TransitionLink>
                </div>
            ))}
        </div>
    );
};

export default HeroScene;
