import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface FloatingCardsProps {
  className?: string;
}

interface CardPerson {
  name: string;
  tag: string;
  initials: string;
  hue: number;
  /** position in % of container */
  x: number;
  y: number;
  z: number; // depth: higher = closer
  rotate: number;
  scale: number;
  duration: number;
  delay: number;
}

const PEOPLE: CardPerson[] = [
  { name: 'Alex Chen', tag: 'Friend', initials: 'AC', hue: 14, x: 12, y: 18, z: 60, rotate: -8, scale: 1.1, duration: 7, delay: 0 },
  { name: 'Maya Patel', tag: 'Colleague', initials: 'MP', hue: 200, x: 74, y: 12, z: 40, rotate: 6, scale: 0.95, duration: 8.5, delay: 1.2 },
  { name: 'Sam Okafor', tag: 'Mentor', initials: 'SO', hue: 38, x: 8, y: 66, z: 30, rotate: 7, scale: 0.85, duration: 9, delay: 0.6 },
  { name: 'Lena Ruiz', tag: 'Family', initials: 'LR', hue: 145, x: 78, y: 62, z: 70, rotate: -6, scale: 1.05, duration: 7.5, delay: 2 },
];

/**
 * CSS-3D floating profile cards over the silk shader. Depth via translateZ,
 * gentle per-card bobbing, shared mouse-parallax tilt. Pure CSS/DOM — no
 * WebGL dependency, honors prefers-reduced-motion.
 */
const FloatingCards = ({ className }: FloatingCardsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    const el = ref.current;
    if (!el) return () => mq.removeEventListener('change', onChange);
    const onMouse = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      setTilt({ x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) });
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
      mq.removeEventListener('change', onChange);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: '1000px' }}
      aria-hidden="true"
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${tilt.x * 6}deg) rotateX(${-tilt.y * 4}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {PEOPLE.map((p) => (
          <div
            key={p.name}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translateZ(${p.z}px) translate(-50%, -50%) scale(${p.scale})`,
            }}
          >
            <PersonChip person={p} reduced={reduced} tilt={tilt} />
          </div>
        ))}

        {/* soft depth dots */}
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-primary/40"
            style={{
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              left: `${(i * 37 + 11) % 92}%`,
              top: `${(i * 53 + 19) % 88}%`,
              transform: `translateZ(${-40 - i * 12}px)`,
              filter: 'blur(1px)',
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const PersonChip = ({
  person: p,
  reduced,
  tilt,
}: {
  person: CardPerson;
  reduced: boolean;
  tilt: { x: number; y: number };
}) => {
  const style: CSSProperties = {
    transform: `rotate(${p.rotate + tilt.x * 2}deg)`,
    animation: reduced
      ? undefined
      : `hero-card-bob ${p.duration}s ease-in-out ${p.delay}s infinite`,
  };

  return (
    <div
      className="absolute neo-raised-lg rounded-2xl px-4 py-3 sm:px-5 sm:py-4 backdrop-blur-sm"
      style={style}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          style={{
            background: `linear-gradient(135deg, hsl(${p.hue}, 85%, 58%), hsl(${(p.hue + 24) % 360}, 80%, 46%))`,
            boxShadow: '0 4px 12px hsl(0 0% 0% / 0.35), inset 0 1px 1px hsl(0 0% 100% / 0.3)',
          }}
        >
          {p.initials}
        </div>
        <div>
          <p className="text-sm sm:text-base font-semibold text-foreground leading-tight whitespace-nowrap">{p.name}</p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">{p.tag}</p>
        </div>
      </div>
      {/* birthday pill on some cards */}
      {(p.tag === 'Friend' || p.tag === 'Family') && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-primary">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Birthday this week
        </div>
      )}
    </div>
  );
};

export default FloatingCards;
