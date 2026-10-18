import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Instagram, Twitter, ArrowRight } from 'lucide-react';
import HeroVideo from '@/components/landing/HeroVideo';
import AboutSection from '@/components/landing/AboutSection';
import FeaturedVideoSection from '@/components/landing/FeaturedVideoSection';
import PhilosophySection from '@/components/landing/PhilosophySection';
import ServicesSection from '@/components/landing/ServicesSection';

const Landing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(email ? `/auth?email=${encodeURIComponent(email)}` : '/auth');
  };

  return (
    <div className="bg-black text-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <HeroVideo />

        {/* Navbar */}
        <nav className="relative z-20 px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo/ariyo logo6.png" alt="Ariyo logo" className="w-7 h-7 object-contain" />
              <span className="text-white font-semibold text-lg">Ariyo</span>
              <div className="hidden md:flex items-center gap-8 ml-8">
                <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">About</a>
                <a href="#philosophy" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Philosophy</a>
                <a href="#services" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Services</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="text-white text-sm font-medium hover:text-white/70 transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[10%] md:-translate-y-[20%]">
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap">
            Remember it <em className="italic">all</em>.
          </h1>

          <form onSubmit={handleEmailSubmit} className="mt-10 max-w-xl w-full">
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none min-w-0"
              />
              <button
                type="submit"
                aria-label="Get started"
                className="shrink-0 bg-white rounded-full p-3 text-black hover:bg-white/85 transition-colors"
              >
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </form>

          <p className="mt-6 text-white text-sm leading-relaxed px-4 max-w-md">
            The people in your life — their stories, their dates, the details
            that matter. Remembered beautifully, never forgotten.
          </p>

          <button
            onClick={() => navigate('/auth')}
            className="mt-8 liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Start remembering
          </button>
        </div>

        {/* Social footer */}
        <div className="relative z-10 flex justify-center gap-4 pb-12">
          <a
            href="#"
            aria-label="Instagram"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <Instagram className="w-5 h-5" aria-hidden="true" />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <Twitter className="w-5 h-5" aria-hidden="true" />
          </a>
          <a
            href="#"
            aria-label="Website"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <Globe className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────── */}
      <div id="about">
        <AboutSection />
      </div>

      {/* ── Featured video ───────────────────────────────────── */}
      <FeaturedVideoSection />

      {/* ── Philosophy ───────────────────────────────────────── */}
      <div id="philosophy">
        <PhilosophySection />
      </div>

      {/* ── Services ─────────────────────────────────────────── */}
      <div id="services">
        <ServicesSection />
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-black border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo/ariyo logo6.png" alt="Ariyo logo" className="w-6 h-6 object-contain" />
            <span className="font-serif text-xl text-white">Ariyo</span>
          </div>
          <p className="text-white/40 text-sm text-center sm:text-right">
            &copy; {new Date().getFullYear()} Ariyo — remember it all.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
