/**
 * Demo data for investor presentation
 * Prebuilt sample reports for 4 contractor trades
 */

export interface DemoReport {
  trade: string;
  businessName: string;
  location: string;
  currentScore: number;
  projectedScore: number;
  seoScore: number;
  visibilityScore: number;
  localPresenceScore: number;
  reputationScore: number;
  competitors: Array<{
    name: string;
    score: number;
  }>;
  nextFixes: Array<{
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    estimatedImprovement: string;
  }>;
  whatWeShip: string[];
  biweeklyUpdate: {
    previousScore: number;
    newScore: number;
    changesSummary: string;
  };
}

export const DEMO_REPORTS: Record<string, DemoReport> = {
  plumber: {
    trade: "Plumber",
    businessName: "ABC Plumbing Services",
    location: "Phoenix, AZ",
    currentScore: 61,
    projectedScore: 74,
    seoScore: 58,
    visibilityScore: 62,
    localPresenceScore: 65,
    reputationScore: 59,
    competitors: [
      { name: "Top Local Plumber", score: 82 },
      { name: "Regional Plumbing Leader", score: 88 },
    ],
    nextFixes: [
      {
        title: "Claim & Optimize Google Business Profile",
        description: "Your business profile is unclaimed. Setting it up properly can increase local visibility by 40% and help you appear in the Google Map Pack.",
        impact: "high",
        estimatedImprovement: "+8-12 points",
      },
      {
        title: "Add Schema Markup for Local Business",
        description: "Implement LocalBusiness schema to help search engines understand your service area, hours, and contact information. This improves rich snippet display.",
        impact: "high",
        estimatedImprovement: "+5-8 points",
      },
    ],
    whatWeShip: [
      "Claimed & optimized Google Business Profile with photos and posts",
      "LocalBusiness schema markup implementation",
      "NAP consistency fixes across 15+ directories",
      "Review generation system setup",
      "Monthly performance reports with actionable insights",
    ],
    biweeklyUpdate: {
      previousScore: 61,
      newScore: 66,
      changesSummary: "Google Business Profile claimed and optimized. Added 8 new photos and first customer review. Local visibility improved 23%.",
    },
  },
  
  electrician: {
    trade: "Electrician",
    businessName: "Bright Electric Co.",
    location: "Scottsdale, AZ",
    currentScore: 54,
    projectedScore: 71,
    seoScore: 51,
    visibilityScore: 55,
    localPresenceScore: 58,
    reputationScore: 52,
    competitors: [
      { name: "Elite Electrical Services", score: 79 },
      { name: "PowerPro Electricians", score: 85 },
    ],
    nextFixes: [
      {
        title: "Fix Missing Meta Descriptions & Title Tags",
        description: "Your website is missing critical meta tags on 12 pages. Adding these can improve click-through rates from search results by 15-25%.",
        impact: "high",
        estimatedImprovement: "+6-10 points",
      },
      {
        title: "Build Local Citations in Top Directories",
        description: "You're only listed in 3 of the top 20 local directories. Competitors average 18 listings. This is hurting your local search rankings significantly.",
        impact: "high",
        estimatedImprovement: "+7-11 points",
      },
    ],
    whatWeShip: [
      "Complete meta tag optimization for all pages",
      "Citations built in 20+ high-authority directories",
      "Mobile speed optimization (currently 42/100)",
      "Service area pages for each neighborhood",
      "Biweekly monitoring and improvement tracking",
    ],
    biweeklyUpdate: {
      previousScore: 54,
      newScore: 60,
      changesSummary: "Meta tags added to all pages. Built citations in 12 directories. Mobile speed improved from 42 to 68. Search visibility up 31%.",
    },
  },
  
  roofer: {
    trade: "Roofer",
    businessName: "Summit Roofing & Repair",
    location: "Mesa, AZ",
    currentScore: 68,
    projectedScore: 79,
    seoScore: 65,
    visibilityScore: 70,
    localPresenceScore: 72,
    reputationScore: 66,
    competitors: [
      { name: "Premium Roof Solutions", score: 81 },
      { name: "Desert Roofing Experts", score: 86 },
    ],
    nextFixes: [
      {
        title: "Generate More Customer Reviews",
        description: "You have only 7 Google reviews vs competitors' average of 45. Reviews are the #1 factor in local ranking. We'll implement an automated review request system.",
        impact: "high",
        estimatedImprovement: "+5-9 points",
      },
      {
        title: "Create Service-Specific Landing Pages",
        description: "Your website has one generic page. Creating dedicated pages for 'roof repair,' 'roof replacement,' and 'emergency roofing' will capture more search traffic.",
        impact: "medium",
        estimatedImprovement: "+4-6 points",
      },
    ],
    whatWeShip: [
      "Automated review generation system via SMS/email",
      "5 service-specific landing pages with local SEO",
      "Before/after photo gallery optimization",
      "Emergency service call tracking setup",
      "Competitor monitoring and monthly benchmarking",
    ],
    biweeklyUpdate: {
      previousScore: 68,
      newScore: 72,
      changesSummary: "Review system launched - gained 6 new 5-star reviews. Created 3 service landing pages. Local pack ranking improved from #8 to #4.",
    },
  },
  
  hvac: {
    trade: "HVAC",
    businessName: "CoolTech HVAC Solutions",
    location: "Tempe, AZ",
    currentScore: 59,
    projectedScore: 76,
    seoScore: 56,
    visibilityScore: 60,
    localPresenceScore: 63,
    reputationScore: 57,
    competitors: [
      { name: "Arctic Air Conditioning", score: 84 },
      { name: "Valley HVAC Pros", score: 90 },
    ],
    nextFixes: [
      {
        title: "Fix Broken Backlinks & 404 Errors",
        description: "Your site has 23 broken pages and 8 dead backlinks. This is hurting your domain authority and user experience. We'll fix all technical SEO issues.",
        impact: "high",
        estimatedImprovement: "+7-10 points",
      },
      {
        title: "Optimize for 'Near Me' Searches",
        description: "You're not ranking for critical 'HVAC near me' and 'AC repair near me' searches. We'll optimize your Google Business Profile and local content strategy.",
        impact: "high",
        estimatedImprovement: "+6-9 points",
      },
    ],
    whatWeShip: [
      "Technical SEO audit and fixes (404s, redirects, broken links)",
      "'Near me' search optimization package",
      "Seasonal content calendar (AC summer, heating winter)",
      "Emergency service call tracking and optimization",
      "Weekly ranking reports for key search terms",
    ],
    biweeklyUpdate: {
      previousScore: 59,
      newScore: 65,
      changesSummary: "Fixed all 404 errors and broken links. Optimized for 'near me' searches - now ranking #3 for 'HVAC near me'. Site speed improved 34%.",
    },
  },
};

export const TRADE_OPTIONS = [
  { value: "plumber", label: "Plumber" },
  { value: "electrician", label: "Electrician" },
  { value: "roofer", label: "Roofer" },
  { value: "hvac", label: "HVAC" },
];
