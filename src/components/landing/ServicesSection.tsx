import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CARD_1_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';
const CARD_2_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4';

const SERVICES = [
  {
    video: CARD_1_VIDEO,
    tag: 'Remember',
    title: 'People & Stories',
    description:
      'A beautiful profile for everyone in your life — how you met, what they love, the moments that shaped them.',
  },
  {
    video: CARD_2_VIDEO,
    tag: 'Prepare',
    title: 'Dates & Moments',
    description:
      'Birthdays, anniversaries, big days — tracked and surfaced at exactly the right time, never missed.',
  },
];

const ServicesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight">What Ariyo does</h2>
          <p className="text-white/40 text-sm hidden md:block">Two things, done beautifully</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="liquid-glass rounded-3xl overflow-hidden group"
            >
              <div className="relative aspect-video overflow-hidden">
                <video
                  src={service.video}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-3">
                  <p className="uppercase tracking-widest text-white/40 text-xs pt-2">{service.tag}</p>
                  <span className="liquid-glass rounded-full p-2">
                    <ArrowUpRight className="w-4 h-4 text-white" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="font-serif text-white text-xl md:text-2xl mb-3 tracking-tight">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
