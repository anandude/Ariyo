import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Reveal from '@/components/Reveal';
import FloatingCards from '@/components/hero/FloatingCards';
import {
  Users, Heart, Calendar, MapPin, ArrowRight, Brain, Shield, Sparkles, Bell, Lock,
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOpenApp = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="frosted sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo/ariyo logo6.png"
                alt="Ariyo Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold text-foreground tracking-tight">Ariyo</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Button>
              <Button onClick={handleOpenApp} className="px-6 font-medium">
                Get started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* carved neumorphic backdrop: giant soft circle + corner glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full neo-raised opacity-40" />
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
          </div>

          {/* carved concentric rings behind the cards */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:flex items-center w-1/2 justify-center">
            <div className="relative w-[560px] h-[560px]">
              <div className="absolute inset-0 rounded-full neo-inset" />
              <div className="absolute inset-16 rounded-full neo-raised" />
              <div className="absolute inset-32 rounded-full neo-inset" />
            </div>
          </div>

          <div className="relative container mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 max-w-6xl mx-auto">
              {/* Copy */}
              <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 rounded-full neo-inset-sm px-4 py-1.5 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Your people, remembered
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tighter text-foreground">
                  Every person,
                  <span className="block text-gradient-primary">
                    perfectly remembered
                  </span>
                </h1>

                <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Names, faces, birthdays, the story of how you met — Ariyo keeps
                  the people in your life close, so no detail ever slips away.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                  <Button
                    onClick={handleOpenApp}
                    size="lg"
                    className="px-8 py-4 text-lg font-medium group"
                  >
                    Start remembering
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg font-medium"
                  >
                    Sign in
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Free forever · No credit card required
                </p>
              </div>

              {/* floating profile cards over carved rings */}
              <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
                <FloatingCards className="absolute inset-0" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Demo preview ─────────────────────────────────── */}
        <section className="relative container mx-auto px-6 pb-24 lg:pb-32">
          <Reveal>
            <div className="max-w-4xl mx-auto">
              <Card className="neo-raised-lg overflow-hidden">
                <CardContent className="p-8 lg:p-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden neo-inset-sm">
                          <img
                            src="/Alex_chen.png"
                            alt="Alex Chen"
                            className="w-full h-full object-cover object-top scale-150"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-card-foreground">Alex Chen</h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users size={14} />
                            <span>Friend</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar size={16} className="text-primary" />
                          <span>Birthday: March 15th</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <MapPin size={16} className="text-primary" />
                          <span>Lives in San Francisco</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Heart size={16} className="text-primary" />
                          <span>Loves photography & travel</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="neo-inset rounded-xl p-4">
                        <p className="text-sm text-muted-foreground italic">
                          "Met at Sarah's birthday party last year. Works as a UX designer at a
                          startup. Always brings amazing homemade sourdough to gatherings.
                          Planning a trip to Japan next month."
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Photography', 'Sourdough', 'Travel'].map((tag) => (
                          <div
                            key={tag}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Reveal>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <Reveal>
                <div className="text-center mb-14">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
                    Every detail,
                    <span className="text-gradient-primary"> beautifully kept</span>
                  </h2>
                  <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Thoughtful tools that make remembering people effortless —
                    from first hello to fiftieth birthday.
                  </p>
                </div>
              </Reveal>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Brain,
                    title: 'Know them deeply',
                    body: "Capture how you met, what they love, the little things they mentioned once. Ariyo keeps every detail ready before your next hello.",
                  },
                  {
                    icon: Bell,
                    title: 'Never miss a moment',
                    body: "Birthdays, anniversaries, big milestones — Ariyo quietly tracks the dates that matter and nudges you at exactly the right time.",
                  },
                  {
                    icon: Lock,
                    title: 'Yours alone',
                    body: "Your people are private by default. Everything stays on your account, encrypted in transit, and never shared or sold.",
                  },
                ].map((feature, i) => (
                  <Reveal key={feature.title} delay={i * 120}>
                    <Card className="neo-hover h-full border-0">
                      <CardContent className="p-8">
                        <div className="w-14 h-14 neo-raised-sm rounded-2xl flex items-center justify-center mb-6">
                          <feature.icon className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.body}</p>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-6">
            <Reveal>
              <div className="max-w-4xl mx-auto">
                <div className="neo-raised-lg rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">
                  <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
                  <div className="relative space-y-6">
                    <Sparkles className="w-12 h-12 mx-auto text-primary" />
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                      Start remembering today
                    </h2>
                    <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                      Add your first person in under a minute — and never lose
                      track of the people who matter.
                    </p>
                    <Button
                      onClick={handleOpenApp}
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold"
                    >
                      Get started for free
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="py-10 border-t border-border/40">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <img src="/logo/ariyo logo6.png" alt="" className="w-6 h-6 object-contain" />
              <span className="font-semibold text-foreground">Ariyo</span>
            </div>
            <p>&copy; {new Date().getFullYear()} Ariyo. Crafted with care to help you remember.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
