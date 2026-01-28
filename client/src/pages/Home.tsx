import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BarChart3, TrendingUp, Target, CheckCircle2, ArrowRight, Zap, Users, MessageCircle, Brain, Lightbulb } from "lucide-react";
import { ScoreGauge } from "@/components/ScoreGauge";

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-border/30 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">TruFindAI</span>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => scrollToSection("ai-platforms")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection("pricing")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background pointer-events-none" />
        
        {/* Subtle radial spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left: Score Gauge */}
            <div className="flex flex-col items-center justify-center">
              <div className="mb-8">
                <ScoreGauge
                  score={38}
                  title="AI Visibility Score"
                  description="How visible you are to homeowners searching online"
                  size="lg"
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Elite contractors score</p>
                <p className="text-3xl font-bold text-primary">80+ Recommended</p>
              </div>
            </div>

            {/* Right: Hero Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  See If AI Recommends You — Or Your Competitors
                </h1>
                <p className="text-xl text-muted-foreground mb-2">
                  When homeowners search on ChatGPT, Perplexity, Claude, Alexa, and Google, can they find you?
                </p>
              </div>

              {/* Competitor Benchmark Card */}
              <Card className="bg-card/60 border-border/40 backdrop-blur-sm hover:border-border/60 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Local Competitor Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-primary">You</span>
                      <span className="text-2xl font-bold text-primary">38</span>
                    </div>
                    <div className="h-3 bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "38%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Competitor A</span>
                      <span className="text-lg font-bold text-muted-foreground">75</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-muted" style={{ width: "75%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Competitor B</span>
                      <span className="text-lg font-bold text-muted-foreground">82</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-muted" style={{ width: "82%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-200"
                  asChild
                >
                  <Link href="/demo">
                    Get My Free AI Visibility Score
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-border/60 hover:bg-primary/10 hover:border-primary/50 transition-colors"
                  onClick={() => scrollToSection("example-results")}
                >
                  See Example Results
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Microcopy */}
              <div className="text-sm text-muted-foreground font-medium">
                60 seconds • Instant results • Competitor comparison included
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>500+ Contractors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Platforms Strip */}
      <section id="ai-platforms" className="py-12 border-y border-border/30 bg-secondary/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8">Homeowners search on these platforms:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {["ChatGPT", "Perplexity", "Claude", "Alexa", "Google"].map((platform) => (
              <div key={platform} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Brain className="h-5 w-5" />
                <span className="font-medium">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Problem</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Homeowners are searching for contractors on AI platforms and Google. If they can't find you, they'll find your competitors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "Lost Leads",
                description: "Homeowners searching on ChatGPT, Perplexity, and Claude can't find you—so they call your competitors instead.",
              },
              {
                icon: Lightbulb,
                title: "No Visibility",
                description: "You don't know which online channels matter most for your business or where to invest your time.",
              },
              {
                icon: Target,
                title: "No Roadmap",
                description: "Without a clear plan, you waste time and money on fixes that don't move the needle.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="bg-card/40 border-border/30 hover:border-border/60 transition-colors">
                <CardContent className="p-6">
                  <item.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Next 2 Fixes Section */}
      <section className="py-20 bg-secondary/20 border-y border-border/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Next 2 Fixes</h2>
            <p className="text-xl text-muted-foreground">
              Prioritized recommendations based on your AI Visibility analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                number: 1,
                title: "Claim & Optimize Google Business Profile",
                description: "Increase visibility by 40% with proper profile setup, photos, and service area optimization.",
                impact: "+8-12 points",
              },
              {
                number: 2,
                title: "Add Schema Markup & Meta Tags",
                description: "Help AI platforms understand your services with structured data and optimized meta descriptions.",
                impact: "+5-8 points",
              },
            ].map((fix) => (
              <Card key={fix.number} className="bg-card/40 border-border/30 hover:border-primary/40 transition-colors">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {fix.number}
                    </div>
                    <Badge variant="secondary" className="mt-1">{fix.impact}</Badge>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{fix.title}</h3>
                  <p className="text-muted-foreground">{fix.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Example Results Section */}
      <section id="example-results" className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Example Results</h2>
            <p className="text-xl text-muted-foreground">
              See how contractors improve with TruFindAI monitoring
            </p>
          </div>

          <Card className="bg-card/40 border-border/30 overflow-hidden">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Previous Score</p>
                  <p className="text-5xl font-bold text-muted-foreground">61</p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">New Score (2 weeks)</p>
                  <p className="text-5xl font-bold text-primary">66</p>
                  <p className="text-sm text-primary font-semibold mt-2">+5 points</p>
                </div>
              </div>

              <div className="pt-8 border-t border-border/30">
                <h4 className="font-semibold mb-4">What Changed:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Google Business Profile fully optimized with 15 new reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Schema markup added to service pages, improving AI platform visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Website speed improved by 35%, reducing bounce rate</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-secondary/20 border-y border-border/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Diagnostic Fee",
                price: "$49",
                period: "one-time",
                features: [
                  "Initial visibility assessment",
                  "Competitor benchmarking",
                  "Top 2 fix recommendations",
                ],
              },
              {
                name: "Full Report",
                price: "$99",
                period: "one-time",
                featured: true,
                features: [
                  "Everything in Diagnostic",
                  "Complete implementation plan",
                  "Detailed action roadmap",
                  "Priority support",
                ],
              },
              {
                name: "Ongoing Monitoring",
                price: "$39",
                period: "/month",
                features: [
                  "Biweekly score updates",
                  "Track improvements over time",
                  "Email progress reports",
                  "Competitor monitoring",
                ],
              },
            ].map((plan, idx) => (
              <Card
                key={idx}
                className={`relative ${
                  plan.featured
                    ? "border-primary border-2 shadow-lg shadow-primary/20 bg-card/60"
                    : "border-border/30 bg-card/40"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="pt-4">
                    <span className="text-5xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.featured ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/demo">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-gradient-to-br from-emerald-600/10 via-slate-900/40 to-slate-900/40 border-slate-700/50 relative overflow-hidden">
            {/* Subtle spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <CardContent className="p-12 text-center relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Improve Your AI Visibility?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get your free AI Visibility Score and see exactly how you compare to local competitors
              </p>
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-200"
                asChild
              >
                <Link href="/demo">
                  Get My Free AI Visibility Score
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-secondary/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TruFindAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 TruFindAI. AI visibility scoring for contractors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
