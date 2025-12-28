/**
 * Mock scoring logic for TruFindAI Score generation
 * In production, this would call actual SEO analysis, competitor research, etc.
 */

interface ScoreComponents {
  overallScore: number;
  seoScore: number;
  visibilityScore: number;
  localPresenceScore: number;
  reputationScore: number;
}

interface Recommendation {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface CompetitorBenchmark {
  competitorName: string;
  competitorScore: number;
  yourScore: number;
  gap: number;
}

/**
 * Generate a fast score (light analysis, 5-30 seconds simulation)
 */
export async function generateFastScore(website: string, businessName: string): Promise<{
  scores: ScoreComponents;
  recommendations: Recommendation[];
}> {
  // Simulate processing time (5-10 seconds)
  await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 5000));

  // Generate pseudo-random but consistent scores based on website length
  const seed = website.length + businessName.length;
  const baseScore = 45 + (seed % 30);

  const scores: ScoreComponents = {
    seoScore: Math.min(100, baseScore + Math.random() * 15),
    visibilityScore: Math.min(100, baseScore + Math.random() * 20),
    localPresenceScore: Math.min(100, baseScore + Math.random() * 10),
    reputationScore: Math.min(100, baseScore + Math.random() * 18),
    overallScore: 0, // Will be calculated
  };

  // Calculate overall score as weighted average
  scores.overallScore = (
    scores.seoScore * 0.3 +
    scores.visibilityScore * 0.3 +
    scores.localPresenceScore * 0.2 +
    scores.reputationScore * 0.2
  );

  // Round all scores to 1 decimal place
  Object.keys(scores).forEach(key => {
    scores[key as keyof ScoreComponents] = Math.round(scores[key as keyof ScoreComponents] * 10) / 10;
  });

  // Generate top 2 recommendations based on lowest scores
  const recommendations: Recommendation[] = [];
  
  if (scores.seoScore < 70) {
    recommendations.push({
      title: "Optimize Meta Tags & Descriptions",
      description: "Your website is missing critical meta descriptions and title tags that help search engines understand your content. Adding these can improve your search rankings by 15-25%.",
      impact: "high"
    });
  }

  if (scores.visibilityScore < 70) {
    recommendations.push({
      title: "Claim Your Google Business Profile",
      description: "Your business doesn't appear prominently in local search results. Claiming and optimizing your Google Business Profile can increase local visibility by 40%.",
      impact: "high"
    });
  }

  if (scores.localPresenceScore < 70) {
    recommendations.push({
      title: "Build Local Citations",
      description: "Your business information is inconsistent across online directories. Standardizing your NAP (Name, Address, Phone) across platforms improves local SEO.",
      impact: "medium"
    });
  }

  if (scores.reputationScore < 70) {
    recommendations.push({
      title: "Generate More Customer Reviews",
      description: "You have fewer reviews than competitors. Implementing a review generation strategy can boost trust and conversion rates by 30%.",
      impact: "high"
    });
  }

  // Return top 2 recommendations
  return {
    scores,
    recommendations: recommendations.slice(0, 2)
  };
}

/**
 * Generate a full score (deep analysis + competitor benchmarks, 1-5 minutes simulation)
 */
export async function generateFullScore(website: string, businessName: string): Promise<{
  scores: ScoreComponents;
  recommendations: Recommendation[];
  competitorBenchmarks: CompetitorBenchmark[];
}> {
  // Simulate longer processing time (60-120 seconds)
  await new Promise(resolve => setTimeout(resolve, 60000 + Math.random() * 60000));

  // Start with fast score results
  const fastResults = await generateFastScore(website, businessName);

  // Enhance scores slightly (full scan is more accurate)
  const scores = { ...fastResults.scores };
  Object.keys(scores).forEach(key => {
    if (key !== 'overallScore') {
      scores[key as keyof ScoreComponents] += Math.random() * 5;
      scores[key as keyof ScoreComponents] = Math.min(100, Math.round(scores[key as keyof ScoreComponents] * 10) / 10);
    }
  });

  // Recalculate overall score
  scores.overallScore = (
    scores.seoScore * 0.3 +
    scores.visibilityScore * 0.3 +
    scores.localPresenceScore * 0.2 +
    scores.reputationScore * 0.2
  );
  scores.overallScore = Math.round(scores.overallScore * 10) / 10;

  // Generate competitor benchmarks
  const competitorBenchmarks: CompetitorBenchmark[] = [
    {
      competitorName: "Top Local Competitor",
      competitorScore: Math.min(100, scores.overallScore + 10 + Math.random() * 15),
      yourScore: scores.overallScore,
      gap: 0
    },
    {
      competitorName: "Industry Leader",
      competitorScore: Math.min(100, scores.overallScore + 20 + Math.random() * 10),
      yourScore: scores.overallScore,
      gap: 0
    },
    {
      competitorName: "Regional Average",
      competitorScore: scores.overallScore - 5 + Math.random() * 10,
      yourScore: scores.overallScore,
      gap: 0
    }
  ];

  // Calculate gaps and round scores
  competitorBenchmarks.forEach(benchmark => {
    benchmark.competitorScore = Math.round(benchmark.competitorScore * 10) / 10;
    benchmark.gap = Math.round((benchmark.competitorScore - benchmark.yourScore) * 10) / 10;
  });

  return {
    scores,
    recommendations: fastResults.recommendations,
    competitorBenchmarks
  };
}
