import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { BarChart3, TrendingUp, Target, CheckCircle2, ArrowRight, Shield, Zap, Users } from "lucide-react";

export default function Home() {

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">TruFindAI</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <Button size="sm" asChild>
                <Link href="/demo">Get My Score</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background via-accent/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Zap className="h-4 w-4 mr-2 inline" />
              AI-Powered Visibility Analysis
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Know Your <span className="text-primary">TruFindAI Score</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Discover how contractors find you online. Get your AI visibility score, competitor benchmarks, and actionable fixes in under 30 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/demo">
                  Get My Free Score <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <a href="#how-it-works">Learn More</a>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Results in 30 Seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Trusted by 500+ Contractors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Score Preview Mockup */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">See What You'll Get</h2>
              <p className="text-xl text-muted-foreground">
                A comprehensive visibility scorecard with actionable insights
              </p>
            </div>

            <Card className="shadow-2xl border-2">
              <CardHeader className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl">Your TruFindAI Score</CardTitle>
                    <CardDescription className="text-primary-foreground/80 text-lg">
                      Overall Online Visibility Rating
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-6xl font-bold">73</div>
                    <div className="text-sm text-primary-foreground/80">out of 100</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Sub-Scores Breakdown
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "SEO Score", value: 68 },
                        { label: "Visibility Score", value: 75 },
                        { label: "Local Presence", value: 78 },
                        { label: "Online Reputation", value: 71 },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-semibold">{item.value}/100</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${item.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Next 2 Fixes
                    </h3>
                    <div className="space-y-3">
                      <Card className="bg-accent/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge variant="destructive" className="mt-1">High Impact</Badge>
                            <div className="flex-1">
                              <p className="font-medium text-sm mb-1">Optimize Meta Tags</p>
                              <p className="text-xs text-muted-foreground">
                                Add missing meta descriptions to improve search rankings by 15-25%
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-accent/50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Badge variant="destructive" className="mt-1">High Impact</Badge>
                            <div className="flex-1">
                              <p className="font-medium text-sm mb-1">Claim Google Business Profile</p>
                              <p className="text-xs text-muted-foreground">
                                Increase local visibility by 40% with proper profile setup
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Competitor Benchmarks
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { label: "Top Local Competitor", score: 85 },
                      { label: "Industry Leader", score: 92 },
                      { label: "Regional Average", score: 71 },
                    ].map((item) => (
                      <Card key={item.label} className="bg-muted/50">
                        <CardContent className="p-4 text-center">
                          <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                          <p className="text-3xl font-bold text-primary">{item.score}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.score > 73 ? `+${item.score - 73}` : `${item.score - 73}`} vs You
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How TruFindAI Works</h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to understanding your online visibility
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "Submit Your Info",
                description: "Enter your business name and website. We'll start analyzing your online presence immediately.",
                icon: Target,
              },
              {
                step: "2",
                title: "Get Fast Score",
                description: "Receive your initial TruFindAI Score in 5-30 seconds with quick insights and recommendations.",
                icon: Zap,
              },
              {
                step: "3",
                title: "View Full Analysis",
                description: "Within 1-5 minutes, access your complete report with competitor benchmarks and detailed action plan.",
                icon: BarChart3,
              },
            ].map((item) => (
              <Card key={item.step} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 text-8xl font-bold text-primary/5">
                  {item.step}
                </div>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Get biweekly score updates and track your progress over time
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Diagnostic Fee</CardTitle>
                <CardDescription className="text-lg">One-time assessment</CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold">$49</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Initial visibility assessment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Competitor benchmarking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Top 2 fix recommendations</span>
                  </li>
                </ul>
                <Button variant="outline" size="lg" className="w-full mt-6" asChild>
                  <Link href="/demo">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative border-primary border-2 shadow-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Full Report</CardTitle>
                <CardDescription className="text-lg">Complete analysis & roadmap</CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold">$99</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Everything in Diagnostic</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Complete implementation plan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Detailed action roadmap</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button size="lg" className="w-full mt-6" asChild>
                  <Link href="/demo">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Ongoing Monitoring</CardTitle>
                <CardDescription className="text-lg">Continuous tracking</CardDescription>
                <div className="pt-4">
                  <span className="text-5xl font-bold">$39</span>
                  <span className="text-xl text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Biweekly score updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Track improvements over time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Email progress reports</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Competitor monitoring</span>
                  </li>
                </ul>
                <Button variant="outline" size="lg" className="w-full mt-6" asChild>
                  <Link href="/demo">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TruFindAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 TruFindAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
