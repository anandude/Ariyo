import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Reveal from '@/components/Reveal';
import {
  ArrowRight, ArrowUpRight, Calendar, Heart, MapPin, Quote, Sparkles, Star,
} from 'lucide-react';

const PHOTOS = {
  hero: 'https://images.pexels.com/photos/17588415/pexels-photo-17588415.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  heroSmall: 'https://images.pexels.com/photos/36610738/pexels-photo-36610738.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  friends: 'https://images.pexels.com/photos/20147026/pexels-photo-20147026.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  family: 'https://images.pexels.com/photos/10268338/pexels-photo-10268338.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const MARQUEE_WORDS = ['Birthdays', 'First meetings', 'Anniversaries', 'Coffee orders', 'The little things', 'Big milestones', 'Inside jokes', 'Favorite songs'];

const FEATURES = [
  {
    n: '01',
    icon: Heart,
    title: 'Know them deeply',
    body: 'How you met, what they love, the story they told you once. Every detail lives in a beautiful profile you actually enjoy reading.',
    photo: PHOTOS.heroSmall,
  },
  {
    n: '02',
    icon: Calendar,
    title: 'Never miss a moment',
    body: 'Birthdays, anniversaries, big days. Ariyo watches the calendar for you and nudges you at exactly the right time.',
  },
  {
    n: '03',
    icon: MapPin,
    title: 'Always at hand',
    body: 'Walking into a coffee catch-up? Open their profile and refresh your memory in ten seconds. Prepared, present, never awkward.',
  },
  {
    n: '04',
    icon: Sparkles,
    title: 'Yours alone',
    body: 'Your people are private by default. Everything stays on your account — never shared, never sold.',
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleOpenApp = () => {
    navigate(user ? '/app' : '/auth');
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled ? 'glass border-b border-border/60' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2.5" aria-label="Ariyo home">
              <img src="/logo/ariyo%20logo6.png" alt="" className="w-9 h-9 object-contain" />
              <span className="font-display text-2xl font-semibold tracking-tight">Ariyo</span>
            </a>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Button>
              <Button onClick={handleOpenApp} className="rounded-full px-5 font-medium">
                Get started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28">
          <div className="dot-grid absolute inset-0" aria-hidden="true" />
          <div className="relative container mx-auto px-6">
            <div className="max-w-5xl mx-auto text-center">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground border border-border rounded-full px-4 py-1.5 mb-8 animate-fade-in">
                <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
                For the people worth remembering
              </p>

              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[1.02] tracking-tight animate-fade-in-up">
                Remember every
                <span className="block italic text-gradient-primary">face, every story,</span>
                every birthday.
              </h1>

              <p className="mt-8 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty animate-fade-in-up">
                Ariyo is a quiet, beautiful home for the people in your life —
                their names, their stories, the dates that matter. So you never
                walk into a room unprepared again.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
                <Button
                  onClick={handleOpenApp}
                  size="lg"
                  className="rounded-full px-8 py-4 text-lg font-medium group"
                >
                  Start remembering
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-4 text-lg font-medium"
                >
                  Sign in
                </Button>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                Free forever · No credit card required
              </p>
            </div>

            {/* Photo collage */}
            <div className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto items-end">
              <Reveal className="hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] rotate-[-2deg] shadow-2xl">
                  <img
                    src={PHOTOS.friends}
                    alt="Friends laughing together in a park"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] lg:aspect-[4/5] shadow-2xl">
                  <img
                    src={PHOTOS.hero}
                    alt="A woman smiling warmly"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute bottom-3 left-3 glass rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                    Maya's birthday Friday
                  </div>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] lg:aspect-[3/4] rotate-[1.5deg] shadow-2xl mt-8">
                  <img
                    src={PHOTOS.heroSmall}
                    alt="A close-up portrait with a warm smile"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Reveal>
              <Reveal delay={300} className="hidden lg:block">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] rotate-[2deg] shadow-2xl">
                  <img
                    src={PHOTOS.family}
                    alt="A grandmother embracing her grandson at a sunlit table"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Marquee ──────────────────────────────────────── */}
        <section className="py-10 border-y border-border/60 overflow-hidden" aria-hidden="true">
          <div className="flex whitespace-nowrap animate-marquee">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0">
                {MARQUEE_WORDS.map((word) => (
                  <span key={`${copy}-${word}`} className="font-display italic text-2xl lg:text-3xl text-muted-foreground/70 mx-6 flex items-center gap-6">
                    {word}
                    <Star className="w-4 h-4 text-primary/60 fill-current" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section className="py-24 lg:py-36">
          <div className="container mx-auto px-6 max-w-6xl">
            <Reveal>
              <div className="max-w-2xl mb-16 lg:mb-24">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">What Ariyo does</p>
                <h2 className="font-display text-4xl lg:text-6xl leading-[1.05] tracking-tight">
                  A quiet memory,
                  <span className="italic text-muted-foreground"> outsourced.</span>
                </h2>
              </div>
            </Reveal>

            <div className="space-y-16 lg:space-y-24">
              {FEATURES.map((feature, i) => (
                <Reveal key={feature.n}>
                  <div className={`grid md:grid-cols-12 gap-8 items-center ${i % 2 === 1 ? '' : ''}`}>
                    <div className="md:col-span-2">
                      <span className="font-display text-6xl lg:text-7xl text-muted-foreground/25">{feature.n}</span>
                    </div>
                    <div className="md:col-span-5 space-y-4">
                      <feature.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                      <h3 className="font-display text-3xl lg:text-4xl">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg text-pretty">{feature.body}</p>
                    </div>
                    {feature.photo && i === 0 ? (
                      <div className="md:col-span-5">
                        <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                          <img src={feature.photo} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      </div>
                    ) : (
                      <div className="md:col-span-5 hidden md:block" aria-hidden="true">
                        <div className="h-px w-full bg-border/60" />
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Story / quote ────────────────────────────────── */}
        <section className="py-24 lg:py-32 bg-card border-y border-border/60">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <Reveal>
              <Quote className="w-10 h-10 text-primary mx-auto mb-8" aria-hidden="true" />
              <blockquote className="font-display text-3xl lg:text-5xl leading-[1.15] tracking-tight text-pretty">
                “I used to blank on names at parties. Now I walk in knowing
                who's expecting a baby, who just moved, and exactly what to ask
                about. It changes how people feel when they see you.”
              </blockquote>
              <p className="mt-8 text-muted-foreground">
                Daniel M. — Ariyo user since day one
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="py-24 lg:py-36">
          <div className="container mx-auto px-6">
            <Reveal>
              <div className="max-w-5xl mx-auto rounded-3xl bg-primary text-primary-foreground p-12 lg:p-20 text-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(hsl(0 0% 100% / 0.35) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <h2 className="font-display text-4xl lg:text-6xl leading-[1.05] tracking-tight">
                    Your people are worth
                    <span className="italic block">remembering properly.</span>
                  </h2>
                  <p className="mt-6 text-lg opacity-90 max-w-xl mx-auto">
                    Add your first person in under a minute. Feel the difference
                    at the very next hello.
                  </p>
                  <Button
                    onClick={handleOpenApp}
                    size="lg"
                    className="mt-10 rounded-full px-8 py-4 text-lg font-medium bg-primary-foreground text-primary hover:bg-primary-foreground/90 group"
                  >
                    Get started for free
                    <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="py-12 border-t border-border/60">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <img src="/logo/ariyo%20logo6.png" alt="" className="w-7 h-7 object-contain" />
              <span className="font-display text-xl font-semibold">Ariyo</span>
            </div>
            <p className="text-sm text-muted-foreground text-center sm:text-right">
              &copy; {new Date().getFullYear()} Ariyo — crafted with care to help you remember.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
