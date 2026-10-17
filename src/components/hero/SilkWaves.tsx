import { useEffect, useRef, useState } from 'react';

interface SilkWavesProps {
  className?: string;
  /** Animation speed multiplier */
  speed?: number;
  /** Overall layer opacity (0-1) */
  opacity?: number;
}

/**
 * Hand-written WebGL silk shader: flowing draped-satin waves with domain
 * warping, warm orange sheen over dark charcoal. Zero dependencies —
 * renders a fullscreen quad with a fragment shader. Pauses when offscreen
 * or the tab is hidden; renders a single static frame for reduced motion;
 * falls back to a CSS gradient when WebGL is unavailable.
 */
const SilkWaves = ({ className, speed = 1, opacity = 1 }: SilkWavesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) {
      setFailed(true);
      return;
    }

    const VERT = `
      attribute vec2 aPos;
      void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
    `;

    const FRAG = `
      precision highp float;
      uniform vec2 uRes;
      uniform float uTime;
      uniform vec2 uMouse;

      float hash(vec2 p) {
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.23);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 3; i++) {
          v += a * noise(p);
          p = p * 2.03 + vec2(1.7, 4.1);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uRes;
        vec2 p = uv * vec2(3.2, 2.1);
        float t = uTime * 0.06;

        // gentle mouse parallax
        p += uMouse * 0.18;

        // two-level domain warp — the "drape" of the fabric
        vec2 q = vec2(
          fbm(p + vec2(0.0, t)),
          fbm(p + vec2(5.2, 1.3) - t * 0.8)
        );
        vec2 r = vec2(
          fbm(p + 3.0 * q + vec2(1.7, 9.2) + 0.15 * t),
          fbm(p + 3.0 * q + vec2(8.3, 2.8) - 0.12 * t)
        );
        float f = fbm(p + 3.5 * r);

        // silk folds: warped diagonal ridges
        float ridge = sin((uv.x * 4.5 + uv.y * 1.8 + f * 5.0 + q.x * 2.5) * 2.4);
        float fold = pow(max(ridge, 0.0), 3.0);

        // palette: deep charcoal with a warm sheen
        vec3 dark = vec3(0.043, 0.051, 0.070);
        vec3 mid = vec3(0.086, 0.098, 0.125);
        vec3 warm = vec3(1.0, 0.45, 0.22);

        vec3 col = mix(dark, mid, f * f);
        col += warm * fold * 0.16 * (0.35 + 0.65 * q.y);

        // top-left light source + vignette
        float shade = 1.0 - length(uv - vec2(0.35, 0.65)) * 0.55;
        col *= clamp(shade, 0.55, 1.0);

        // subtle grain to avoid banding
        col += (hash(uv * uRes + uTime) - 0.5) * 0.012;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Silk shader compile error:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFailed(true);
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'uRes');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const resize = () => {
      const w = canvas.clientWidth || 600;
      const h = canvas.clientHeight || 600;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let mx = 0;
    let my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
    observer.observe(canvas);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      const t = (now - start) / 1000 * speed;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return t;
    };

    if (reduced) {
      draw(0);
    } else {
      const tick = (now: number) => {
        if (!document.hidden && visible) draw(now);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [speed]);

  if (failed) {
    return (
      <div
        className={className}
        aria-hidden="true"
        style={{
          opacity,
          background:
            'radial-gradient(ellipse at 30% 60%, hsl(220 15% 10%), hsl(220 13% 6%) 70%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};

export default SilkWaves;
