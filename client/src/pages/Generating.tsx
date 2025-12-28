import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, BarChart3, TrendingUp } from "lucide-react";

export default function Generating() {
  const [, params] = useRoute("/generating/:token");
  const [, setLocation] = useLocation();
  const token = params?.token || "";
  
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<"fast" | "full">("fast");

  // Poll for score status
  const { data: status, refetch } = trpc.score.pollStatus.useQuery(
    { token },
    {
      enabled: !!token,
      refetchInterval: 2000, // Poll every 2 seconds
    }
  );

  useEffect(() => {
    if (!status) return;

    // Update progress based on status
    if (status.fastScoreCompleted && status.fullScoreCompleted) {
      setProgress(100);
      // Redirect to results page after a brief delay
      setTimeout(() => {
        setLocation(`/results/${token}`);
      }, 1500);
    } else if (status.fastScoreCompleted) {
      setProgress(50);
      setCurrentPhase("full");
    } else {
      // Simulate progress for fast score (0-50%)
      setProgress((prev) => {
        if (prev < 45) return prev + 1;
        return prev;
      });
    }
  }, [status, token, setLocation]);

  // Animate progress smoothly
  useEffect(() => {
    if (!status?.fastScoreCompleted && progress < 45) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev < 45) return prev + 1;
          return prev;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [status, progress]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invalid Token</CardTitle>
            <CardDescription>Please submit a valid score request.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">TruFindAI</span>
          </div>
        </div>

        {/* Main Progress Card */}
        <Card className="shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              {status?.fastScoreCompleted && status?.fullScoreCompleted ? (
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
              )}
            </div>
            
            <div>
              <CardTitle className="text-3xl mb-2">
                {status?.fastScoreCompleted && status?.fullScoreCompleted
                  ? "Score Complete!"
                  : currentPhase === "fast"
                  ? "Generating Your Fast Score"
                  : "Analyzing Full Report"}
              </CardTitle>
              <CardDescription className="text-lg">
                {status?.fastScoreCompleted && status?.fullScoreCompleted
                  ? "Redirecting to your results..."
                  : currentPhase === "fast"
                  ? "Running quick visibility scan (5-30 seconds)"
                  : "Deep analysis with competitor benchmarks (1-5 minutes)"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Status Steps */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {status?.fastScoreCompleted ? (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Fast Score Analysis</h3>
                    {status?.fastScoreCompleted && (
                      <Badge variant="secondary" className="text-xs">Complete</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quick scan of your website, SEO basics, and online presence
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {status?.fullScoreCompleted ? (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                  ) : status?.fastScoreCompleted ? (
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Full Score Analysis</h3>
                    {status?.fullScoreCompleted && (
                      <Badge variant="secondary" className="text-xs">Complete</Badge>
                    )}
                    {!status?.fastScoreCompleted && (
                      <Badge variant="outline" className="text-xs">Pending</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Deep dive into competitor benchmarks, detailed recommendations
                  </p>
                </div>
              </div>
            </div>

            {/* Info Message */}
            {status?.fastScoreCompleted && !status?.fullScoreCompleted && (
              <Card className="bg-accent/50 border-primary/20">
                <CardContent className="p-4">
                  <p className="text-sm text-center">
                    <span className="font-semibold">Good news!</span> Your fast score is ready. 
                    We're now running a deeper analysis to give you the complete picture with competitor insights.
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* What's Happening */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              What We're Analyzing
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Your website's SEO optimization and technical health</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Online visibility across search engines and directories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Local presence and Google Business Profile status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Online reputation and review signals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Competitor performance and industry benchmarks</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
