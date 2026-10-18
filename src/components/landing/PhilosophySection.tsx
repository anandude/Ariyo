import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PHILOSOPHY_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4';

const PhilosophySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
        >
          Remembering <span className="italic text-white/40">x</span> Presence
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="rounded-3xl overflow-hidden aspect-[4/3]"
          >
            <video
              src={PHILOSOPHY_VIDEO}
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-10"
          >
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">The detail is the care</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Every meaningful relationship is built from a thousand small
                details — the coffee order, the anniversary, the story they
                told you once. Ariyo holds those details so you can be fully
                present in the moment instead of searching your memory.
              </p>
            </div>
            <div className="w-full h-px bg-white/10" aria-hidden="true" />
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Never miss a moment</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Birthdays, big days, quiet milestones. Ariyo watches the
                calendar for you and nudges you at exactly the right time, so
                the people who matter most never feel like they don't.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
