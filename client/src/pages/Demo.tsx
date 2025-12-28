import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScoreGauge } from "@/components/ScoreGauge";
import { DEMO_REPORTS, TRADE_OPTIONS } from "@/data/demoData";
import { BarChart3, TrendingUp, Target, CheckCircle2, ArrowRight, Download, Sparkles, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function Demo() {
  const [selectedTrade, setSelectedTrade] = useState("plumber");
  const [isActivated, setIsActivated] = useState(false);

  const report = DEMO_REPORTS[selectedTrade];

  const handleActivateDemo = () => {
    setIsActivated(true);
    toast.success("Demo monitoring activated! This is a simulation for investor preview.");
  };

  const handleDownloadPDF = () => {
    toast.info("PDF download would be available in production. This is a demo.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      {/* Header */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">TruFindAI</span>
              <Badge variant="secondary" className="ml-2">Demo</Badge>
            </div>
            <Button variant="outline" asChild>
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Demo Controls */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Investor Demo - Instant Results</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">TruFindAI Score Demo</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Select a contractor trade to see their visibility analysis
          </p>
          
          <div className="flex justify-center items-center gap-4">
            <label className="text-sm font-medium">Select Trade:</label>
            <Select value={selectedTrade} onValueChange={setSelectedTrade}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRADE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Business Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{report.businessName}</h2>
          <p className="text-muted-foreground">{report.location}</p>
        </div>

        {/* Dual Gauges - Current vs Projected */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
          <ScoreGauge
            score={report.currentScore}
            title="Current TruFindAI Score"
            description="Based on current online visibility"
            size="lg"
          />
          <ScoreGauge
            score={report.projectedScore}
            title="Projected After AI Visibility Program"
            description="Projection based on standard improvements + monitoring over 30-60 days"
            size="lg"
            showProjection
          />
        </div>

        {/* Improvement Potential */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/20 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="text-3xl font-bold text-primary">+{report.projectedScore - report.currentScore} Points</span>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Estimated improvement potential with TruFindAI visibility program
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Sub-Scores Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Score Breakdown
              </CardTitle>
              <CardDescription>
                Current visibility across key metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "SEO Score", value: report.seoScore },
                { label: "Visibility Score", value: report.visibilityScore },
                { label: "Local Presence", value: report.localPresenceScore },
                { label: "Online Reputation", value: report.reputationScore },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-2xl font-bold text-primary">{item.value}</span>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Next 2 Fixes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Next 2 Fixes
              </CardTitle>
              <CardDescription>
                Highest-impact improvements we'll implement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.nextFixes.map((fix, idx) => (
                <Card key={idx} className="bg-accent/50 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold">{fix.title}</h3>
                          <Badge variant="destructive" className="text-xs">
                            {fix.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{fix.description}</p>
                        <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                          <TrendingUp className="h-3 w-3" />
                          {fix.estimatedImprovement}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Competitor Benchmarks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Competitor Benchmarks
            </CardTitle>
            <CardDescription>
              See how you compare to local competitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Your Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{report.businessName} (You)</span>
                  <span className="text-2xl font-bold text-primary">{report.currentScore}</span>
                </div>
                <div className="h-8 bg-primary rounded-lg" style={{ width: `${report.currentScore}%` }} />
              </div>

              {/* Competitors */}
              {report.competitors.map((competitor, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">{competitor.name}</span>
                    <span className="text-2xl font-bold text-muted-foreground">{competitor.score}</span>
                  </div>
                  <div className="h-8 bg-muted rounded-lg" style={{ width: `${competitor.score}%` }} />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground italic">
                <strong>Disclaimer:</strong> Benchmarks estimate public signal strength (SEO, reviews, citations), not contractor quality or service excellence.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What Changed / What We Ship */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              What Changed / What We Ship
            </CardTitle>
            <CardDescription>
              Concrete deliverables included in your visibility program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.whatWeShip.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Biweekly Score Update Example */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Biweekly Score Update Example
            </CardTitle>
            <CardDescription>
              Sample progress report you'll receive every 2 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8 mb-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Previous Score</p>
                <p className="text-4xl font-bold text-muted-foreground">{report.biweeklyUpdate.previousScore}</p>
              </div>
              <ArrowRight className="h-8 w-8 text-primary" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">New Score</p>
                <p className="text-4xl font-bold text-primary">{report.biweeklyUpdate.newScore}</p>
              </div>
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                <TrendingUp className="h-5 w-5" />
                <span className="text-2xl font-bold">
                  +{report.biweeklyUpdate.newScore - report.biweeklyUpdate.previousScore}
                </span>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h4 className="font-semibold mb-2">What Changed:</h4>
              <p className="text-muted-foreground">{report.biweeklyUpdate.changesSummary}</p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">TruFindAI Pricing</CardTitle>
            <CardDescription className="text-lg">
              Simple, transparent pricing for contractor visibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Diagnostic Fee</CardTitle>
                  <div className="pt-4">
                    <span className="text-5xl font-bold">$49</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Initial visibility assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Competitor benchmarking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Top 2 fix recommendations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary border-2">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Most Popular</Badge>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Full Report</CardTitle>
                  <div className="pt-4">
                    <span className="text-5xl font-bold">$99</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Everything in Diagnostic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Complete implementation plan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Detailed action roadmap</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Ongoing Monitoring</CardTitle>
                  <div className="pt-4">
                    <span className="text-5xl font-bold">$39</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Biweekly score updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Track improvements over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <span>Email progress reports</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {!isActivated ? (
            <Button size="lg" className="text-lg px-8" onClick={handleActivateDemo}>
              Activate Demo Monitoring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-lg">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-semibold">Demo Monitoring Activated!</span>
            </div>
          )}
          
          <Button size="lg" variant="outline" className="text-lg px-8" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-5 w-5" />
            Download Sample PDF
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          This is a demo for investor preview. No live scoring or payment processing.
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TruFindAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 TruFindAI. Demo for investor presentation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
