import { useEffect, useRef } from 'react';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';

/**
 * Full-viewport background video with a seamless loop: fades in on load,
 * crossfades to black just before the clip ends, then restarts and fades
 * back in. Vanilla rAF animation, per spec.
 */
const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const animateOpacity = (from: number, to: number, durationMs: number, onDone?: () => void) => {
      cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / durationMs, 1);
        video.style.opacity = String(from + (to - from) * t);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          onDone?.();
        }
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const onCanPlay = () => {
      video.play().catch(() => {});
      animateOpacity(0, 1, 500);
    };

    const onTimeUpdate = () => {
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && Number(video.style.opacity) === 1) {
        animateOpacity(1, 0, 500);
      }
    };

    const onEnded = () => {
      animateOpacity(0, 0, 1, () => {
        window.setTimeout(() => {
          video.currentTime = 0;
          video.play().catch(() => {});
          animateOpacity(0, 1, 500);
        }, 100);
      });
    };

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={HERO_VIDEO}
      className="absolute inset-0 w-full h-full object-cover object-bottom"
      style={{ opacity: 0 }}
      muted
      autoPlay
      playsInline
      preload="auto"
    />
  );
};

export default HeroVideo;
