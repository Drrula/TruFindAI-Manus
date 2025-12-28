import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreGaugeProps {
  score: number;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  showProjection?: boolean;
}

export function ScoreGauge({ score, title, description, size = "md", showProjection = false }: ScoreGaugeProps) {
  const sizes = {
    sm: { width: 120, stroke: 8, fontSize: "text-2xl" },
    md: { width: 160, stroke: 10, fontSize: "text-4xl" },
    lg: { width: 200, stroke: 12, fontSize: "text-5xl" },
  };

  const { width, stroke, fontSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#ca8a04";
    return "#ea580c";
  };

  return (
    <Card className={showProjection ? "border-primary border-2 shadow-lg" : ""}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative" style={{ width, height: width }}>
          <svg
            width={width}
            height={width}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={width / 2}
              cy={width / 2}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={stroke}
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx={width / 2}
              cy={width / 2}
              r={radius}
              stroke={getStrokeColor(score)}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`${fontSize} font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground">out of 100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
