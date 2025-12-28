import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart3, TrendingUp, Target, CheckCircle2, ArrowRight, Loader2, AlertCircle, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function SubscribeButton({ businessProfileId }: { businessProfileId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const checkoutMutation = trpc.checkout.createMonitoringSession.useMutation({
    onSuccess: (data) => {
      window.open(data.checkoutUrl, "_blank");
      toast.success("Redirecting to checkout...");
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create checkout session");
      setIsLoading(false);
    },
  });

  const handleSubscribe = () => {
    setIsLoading(true);
    checkoutMutation.mutate({ businessProfileId });
  };

  return (
    <Button 
      size="lg" 
      className="text-lg px-8"
      onClick={handleSubscribe}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Subscribe Now"}
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  );
}

export default function Results() {
  const [, params] = useRoute("/results/:token");
  const token = params?.token || "";

  const { data, isLoading, error } = trpc.score.getByToken.useQuery(
    { token },
    { enabled: !!token }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your score...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              Score Not Found
            </CardTitle>
            <CardDescription>
              We couldn't find a score associated with this link. Please check the URL or submit a new request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/">Get My Score</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { profile, fastScore, fullScore } = data;
  const displayScore = fullScore?.status === "completed" ? fullScore : fastScore;
  const isFullScoreReady = fullScore?.status === "completed";

  if (!displayScore || displayScore.status !== "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Score Still Processing
            </CardTitle>
            <CardDescription>
              Your score is still being generated. Please wait a moment and refresh the page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={`/generating/${token}`}>View Progress</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallScore = parseFloat(displayScore.overallScore || "0");
  const seoScore = parseFloat(displayScore.seoScore || "0");
  const visibilityScore = parseFloat(displayScore.visibilityScore || "0");
  const localPresenceScore = parseFloat(displayScore.localPresenceScore || "0");
  const reputationScore = parseFloat(displayScore.reputationScore || "0");

  const recommendations = displayScore.recommendations
    ? JSON.parse(displayScore.recommendations)
    : [];

  const competitorBenchmarks = isFullScoreReady && fullScore.competitorBenchmarks
    ? JSON.parse(fullScore.competitorBenchmarks)
    : [];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent", variant: "default" as const };
    if (score >= 60) return { label: "Good", variant: "secondary" as const };
    return { label: "Needs Improvement", variant: "outline" as const };
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
            </div>
            <Button asChild>
              <a href="/">Get Another Score</a>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Business Info */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{profile.businessName}</h1>
          <p className="text-muted-foreground">{profile.website}</p>
        </div>

        {/* Overall Score Card */}
        <Card className="shadow-2xl border-2 mb-8">
          <CardHeader className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <CardTitle className="text-3xl mb-2">Your TruFindAI Score</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  Overall Online Visibility Rating
                </CardDescription>
                {!isFullScoreReady && (
                  <Badge variant="secondary" className="mt-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Fast Score - Full analysis in progress
                  </Badge>
                )}
              </div>
              <div className="text-center">
                <div className={`text-7xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore.toFixed(1)}
                </div>
                <div className="text-sm text-primary-foreground/80 mt-1">out of 100</div>
                <Badge {...getScoreBadge(overallScore)} className="mt-2">
                  {getScoreBadge(overallScore).label}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Sub-Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Score Breakdown
              </CardTitle>
              <CardDescription>
                Detailed analysis of your online presence components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "SEO Score", value: seoScore, description: "Search engine optimization quality" },
                { label: "Visibility Score", value: visibilityScore, description: "How easily customers find you" },
                { label: "Local Presence", value: localPresenceScore, description: "Local search and directory listings" },
                { label: "Online Reputation", value: reputationScore, description: "Reviews and trust signals" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(item.value)}`}>
                      {item.value.toFixed(1)}
                    </span>
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
                Prioritized recommendations for maximum impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.slice(0, 2).map((rec: any, idx: number) => (
                <Card key={idx} className="bg-accent/50 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold">{rec.title}</h3>
                          <Badge
                            variant={rec.impact === "high" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {rec.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {recommendations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-600" />
                  <p>Great job! No critical issues found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Competitor Benchmarks */}
        {isFullScoreReady && competitorBenchmarks.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Competitor Benchmarks
              </CardTitle>
              <CardDescription>
                See how you stack up against the competition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6">
                {competitorBenchmarks.map((benchmark: any, idx: number) => (
                  <Card key={idx} className="bg-muted/50">
                    <CardContent className="p-6 text-center space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">
                        {benchmark.competitorName}
                      </p>
                      <div className="space-y-1">
                        <p className="text-4xl font-bold text-primary">
                          {benchmark.competitorScore.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">Their Score</p>
                      </div>
                      <Separator />
                      <div className="space-y-1">
                        <p className={`text-2xl font-semibold ${benchmark.gap > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {benchmark.gap > 0 ? '+' : ''}{benchmark.gap.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {benchmark.gap > 0 ? 'Points ahead of you' : 'Points behind you'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-primary/10 via-accent/20 to-primary/10 border-primary/20">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-3">
                  Track Your Progress Over Time
                </h2>
                <p className="text-lg text-muted-foreground">
                  Subscribe to TruFindAI Monitoring and receive biweekly score updates. 
                  See what changed, track your improvements, and stay ahead of competitors.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-left">
                    <h3 className="text-2xl font-bold mb-2">Monitoring Service</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Biweekly score updates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Track score movement over time
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        See what changed in each update
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Email notifications
                      </li>
                    </ul>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="mb-4">
                      <span className="text-5xl font-bold">$97</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <SubscribeButton businessProfileId={profile.id} />
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Questions? <a href="mailto:support@trufindai.com" className="text-primary hover:underline">Contact us</a>
              </p>
            </div>
          </CardContent>
        </Card>
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
              © 2025 TruFindAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
