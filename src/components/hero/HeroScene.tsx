import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroSceneProps {
  className?: string;
}

/**
 * Lightweight hand-rolled three.js hero: floating profile cards (rounded
 * quads with an avatar disc and text lines, built from geometry + canvas
 * textures) orbiting a glowing core. No react-three-fiber needed — plain
 * three keeps the bundle and render loop lean.
 * Falls back to a static CSS composition when WebGL is unavailable.
 */
const HeroScene = ({ className }: HeroSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }

    let disposed = false;
    const disposables: { dispose: () => void }[] = [];

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 600;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    // ── Core glow ────────────────────────────────────────────
    const coreGroup = new THREE.Group();

    const coreTexture = makeCoreTexture();
    disposables.push(coreTexture);
    const coreMat = new THREE.SpriteMaterial({
      map: coreTexture,
      transparent: true,
      depthWrite: false,
    });
    disposables.push(coreMat);
    const core = new THREE.Sprite(coreMat);
    core.scale.set(6.5, 6.5, 1);
    coreGroup.add(core);

    // Thin torus rings around the core
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('hsl(14, 100%, 57%)'),
      transparent: true,
      opacity: 0.55,
    });
    disposables.push(ringMat);
    const ringGeo = new THREE.TorusGeometry(2.2, 0.015, 8, 96);
    disposables.push(ringGeo);
    const ring2Geo = new THREE.TorusGeometry(2.9, 0.01, 8, 96);
    disposables.push(ring2Geo);

    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2.4;
    coreGroup.add(ring1);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat.clone());
    (ring2.material as THREE.MeshBasicMaterial).opacity = 0.3;
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.y = 0.4;
    coreGroup.add(ring2);
    disposables.push(ring2.material as THREE.MeshBasicMaterial);

    scene.add(coreGroup);

    // ── Floating profile cards ───────────────────────────────
    const cards: { group: THREE.Group; baseY: number; phase: number; floatSpeed: number }[] = [];
    const cardData = [
      { name: 'Alex Chen', tag: 'Friend', initials: 'AC', hue: 14, pos: [-3.4, 1.6, 1.2] as const, scale: 1.15 },
      { name: 'Maya Patel', tag: 'Colleague', initials: 'MP', hue: 200, pos: [3.5, 0.9, 0.4] as const, scale: 1.05 },
      { name: 'Sam Okafor', tag: 'Mentor', initials: 'SO', hue: 38, pos: [-2.6, -1.9, 0.8] as const, scale: 0.9 },
      { name: 'Lena Ruiz', tag: 'Family', initials: 'LR', hue: 145, pos: [2.9, -1.6, 1.6] as const, scale: 0.95 },
    ];

    for (const data of cardData) {
      const { group, texture } = makeProfileCard(data);
      disposables.push(texture);
      group.position.set(data.pos[0], data.pos[1], data.pos[2]);
      group.scale.setScalar(data.scale);
      group.rotation.y = data.pos[0] > 0 ? -0.35 : 0.35;
      scene.add(group);
      cards.push({ group, baseY: data.pos[1], phase: Math.random() * Math.PI * 2, floatSpeed: 0.6 + Math.random() * 0.4 });
    }

    // Small satellite particles
    const particleGeo = new THREE.SphereGeometry(0.035, 8, 8);
    disposables.push(particleGeo);
    const particleMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('hsl(14, 100%, 65%)'), transparent: true, opacity: 0.7 });
    disposables.push(particleMat);
    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < 26; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      const angle = (i / 26) * Math.PI * 2;
      const radius = 3.4 + Math.random() * 2.4;
      p.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 4.4, Math.sin(angle) * radius - 1);
      scene.add(p);
      particles.push(p);
    }

    // ── Interaction: mouse parallax ──────────────────────────
    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Pause when tab hidden or scene scrolled away ─────────
    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(mount);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = new THREE.Clock();

    const tick = () => {
      if (disposed) return;
      const raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return raf; // skip work, keep loop alive

      const t = clock.getElapsedTime();
      const speed = prefersReduced ? 0.15 : 1;

      coreGroup.rotation.y += 0.0016 * speed;
      ring1.rotation.z += 0.004 * speed;
      ring2.rotation.z -= 0.003 * speed;

      for (const card of cards) {
        card.group.position.y = card.baseY + Math.sin(t * card.floatSpeed + card.phase) * 0.18 * speed;
        card.group.rotation.y = (card.group.position.x > 0 ? -0.35 : 0.35) + Math.sin(t * 0.4 + card.phase) * 0.06 * speed;
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].position.y += Math.sin(t * 0.8 + i) * 0.0012 * speed;
      }

      camera.position.x += (targetX * 0.9 - camera.position.x) * 0.04;
      camera.position.y += (-targetY * 0.6 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      for (const d of disposables) d.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (failed) return <StaticFallback className={className} />;

  return (
    <div className={className}>
      <div ref={mountRef} className="w-full h-full" aria-hidden="true" />
      {/* accessible description of the visual */}
      <p className="sr-only">Animated illustration of profile cards floating around a glowing core.</p>
    </div>
  );
};

/* ── Helpers ─────────────────────────────────────────────── */

function makeProfileCard(data: { name: string; tag: string; initials: string; hue: number }) {
  const group = new THREE.Group();

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  // Card background
  roundRect(ctx, 8, 8, 240, 304, 28);
  ctx.fillStyle = 'rgba(24, 27, 34, 0.92)';
  ctx.fill();

  // Avatar disc
  const grad = ctx.createLinearGradient(36, 36, 108, 108);
  grad.addColorStop(0, `hsl(${data.hue}, 90%, 62%)`);
  grad.addColorStop(1, `hsl(${(data.hue + 24) % 360}, 85%, 50%)`);
  ctx.beginPath();
  ctx.arc(72, 84, 36, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = '600 30px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.initials, 72, 86);

  // Name + tag
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = '600 26px Inter, sans-serif';
  ctx.fillText(data.name, 124, 78);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '400 18px Inter, sans-serif';
  ctx.fillText(data.tag, 124, 104);

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  roundRect(ctx, 36, 152, 184, 2, 1);
  ctx.fill();

  // Skeleton lines
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  roundRect(ctx, 36, 180, 184, 12, 6);
  ctx.fill();
  roundRect(ctx, 36, 204, 140, 12, 6);
  ctx.fill();
  roundRect(ctx, 36, 228, 164, 12, 6);
  ctx.fill();

  // Tag chip
  ctx.fillStyle = `hsla(${data.hue}, 90%, 60%, 0.18)`;
  roundRect(ctx, 36, 264, 96, 28, 14);
  ctx.fill();
  ctx.fillStyle = `hsl(${data.hue}, 90%, 70%)`;
  ctx.font = '500 14px Inter, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('Remember', 50, 279);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  if ('colorSpace' in texture) (texture as any).colorSpace = (THREE as any).SRGBColorSpace;

  const geo = new THREE.PlaneGeometry(2.1, 2.625);
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
  group.add(new THREE.Mesh(geo, mat));

  return { group, texture };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeCoreTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, 'rgba(255, 122, 61, 0.85)');
  g.addColorStop(0.35, 'rgba(255, 122, 61, 0.30)');
  g.addColorStop(1, 'rgba(255, 122, 61, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/* ── Static fallback (no WebGL) ──────────────────────────── */

const StaticFallback = ({ className }: { className?: string }) => (
  <div className={`relative w-full h-full flex items-center justify-center ${className ?? ''}`} aria-hidden="true">
    <div className="relative w-72 h-72">
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute inset-8 rounded-full border border-primary/30" />
      <div className="neo-raised-lg rounded-2xl absolute top-4 left-0 w-44 p-4 rotate-[-6deg]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground font-semibold text-sm">AC</div>
          <div>
            <p className="text-sm font-semibold">Alex Chen</p>
            <p className="text-xs text-muted-foreground">Friend</p>
          </div>
        </div>
      </div>
      <div className="neo-raised-lg rounded-2xl absolute bottom-4 right-0 w-44 p-4 rotate-[5deg]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/80 flex items-center justify-center text-white font-semibold text-sm">LR</div>
          <div>
            <p className="text-sm font-semibold">Lena Ruiz</p>
            <p className="text-xs text-muted-foreground">Family</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HeroScene;
