
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Calendar, MapPin, ArrowRight, Star, Brain, Shield, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/logo/ariyo logo6.png" 
                  alt="Ariyo Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tight">Ariyo</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Button>
              <Button 
                onClick={handleOpenApp}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8 mb-20">
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-bold text-foreground leading-none tracking-tighter">
                  Remember
                  <span className="block text-primary">
                    everyone
                  </span>
                  who matters
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  A beautifully crafted app to help you remember names, birthdays, 
                  and meaningful details about the people in your life.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={handleOpenApp}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-lg group"
                >
                  Start remembering
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Free forever • No credit card required
              </p>
            </div>

            {/* Demo Preview */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden">
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
                          <Calendar size={16} />
                          <span>Birthday: March 15th</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <MapPin size={16} />
                          <span>Lives in San Francisco</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Heart size={16} />
                          <span>Loves photography & travel</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-muted rounded-xl p-4">
                        <p className="text-sm text-muted-foreground italic">
                          "Met at Sarah's birthday party last year. Works as a UX designer at a startup. 
                          Always brings amazing homemade sourdough to gatherings. Planning a trip to Japan next month."
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">Photography</div>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">Sourdough</div>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">Travel</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
                Everything you need to stay connected
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful yet simple features designed to help you remember what matters most.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Brain className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-card-foreground">Smart Organization</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Intelligently categorize people by relationships, context, and importance. 
                    Never lose track of anyone again.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-card-foreground">Important Dates</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Never miss another birthday, anniversary, or special occasion. 
                    Get gentle reminders when it matters.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-card-foreground">Privacy First</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your personal data stays private and secure. Built with privacy 
                    by design and complete data ownership.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      {/*
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
                Loved by thousands
              </h2>
              <p className="text-xl text-muted-foreground">
                Join people who never forget a meaningful connection.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  role: "Product Manager",
                  content: "Ariyo completely transformed how I maintain relationships. The interface is beautiful and the features are exactly what I needed.",
                  avatar: "S"
                },
                {
                  name: "Marcus Johnson",
                  role: "Sales Director",
                  content: "Perfect for networking events. I can remember everyone I meet and never have those awkward 'I forgot your name' moments.",
                  avatar: "M"
                },
                {
                  name: "Elena Rodriguez",
                  role: "Entrepreneur",
                  content: "Clean, intuitive, and powerful. Ariyo helps me stay connected with my community in a meaningful way.",
                  avatar: "E"
                }
              ].map((testimonial, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={16} className="text-primary fill-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      */}

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-primary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-primary rounded-3xl p-12 lg:p-16 text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80"></div>
              <div className="relative space-y-6">
                <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                  Start remembering today
                </h2>
                <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of people who never forget a name, birthday, or meaningful moment.
                </p>
                <Button
                  onClick={handleOpenApp}
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get started for free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Ariyo. Crafted with care to help you remember.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
