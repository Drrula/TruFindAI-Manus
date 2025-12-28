# TruFindAI Score Platform TODO

## Database & Backend
- [x] Design database schema for business profiles, score reports, and tracking
- [x] Implement database schema with migrations
- [x] Add backend query helpers for business profiles and score reports
- [x] Build tRPC procedures for score generation (fast and full)
- [x] Build tRPC procedures for score retrieval by token
- [x] Build tRPC procedures for business profile management
- [x] Implement mock scoring logic (0-100 scale with sub-scores)
- [x] Create personalized score link generation with unique tokens
- [ ] Implement biweekly score update tracking system

## Frontend Pages
- [x] Design and implement homepage with hero section
- [x] Add 'Get My Score' form with validation
- [x] Add score preview mockup on homepage
- [x] Add pricing display on homepage
- [x] Add subscription CTA on homepage
- [x] Create score generation page with progress indicator
- [x] Implement real-time status updates for fast/full score
- [x] Build score results page with TruFindAI Score display
- [x] Add sub-scores breakdown on results page
- [x] Add 'Next 2 Fixes' recommendations section
- [x] Add competitor benchmarks display
- [x] Add subscribe CTA on results page

## Integrations
- [x] Integrate Stripe checkout flow
- [x] Handle one-time setup and recurring billing
- [x] Implement automated email notifications to owner for new leads
- [x] Implement automated email notifications to owner for conversions

## Testing & Delivery
- [x] Write vitest tests for all backend procedures
- [x] Final testing and polish
- [x] Create checkpoint and deliver to user

## Demo Conversion for Investors
- [x] Create mock data structure for 4 trades (Plumber, Electrician, Roofer, HVAC)
- [x] Build /demo route with instant-loading sample reports
- [x] Add trade dropdown switcher (4 trades)
- [x] Create dual gauge component (Current Score vs Projected Score)
- [x] Add "Projection based on standard improvements" microtext
- [x] Update competitor benchmarks with disclaimer
- [x] Add "Next 2 Fixes" section with demo content
- [x] Add "What changed / what we ship" section
- [x] Create "Biweekly Score Update Example" card
- [x] Update pricing to $49 Diagnostic / $99 Full Report / $39/month Monitoring
- [x] Update homepage CTAs to route to /demo
- [x] Add "Demo Activation" button (simulated, no real Stripe)
- [x] Optional: Add "Download Sample PDF" button
- [x] Remove live scoring functionality from main flow
- [x] Polish all demo content for investor presentation


## Landing Page Redesign (Dark Mode + Neon Green)
- [x] Redesign global styles with dark mode and neon green primary color
- [x] Create premium hero section with large AI Visibility Score gauge
- [x] Add competitor benchmark card to hero (user vs 2 competitors)
- [x] Add neon green "Get My Free TruFindAI Score" primary CTA
- [x] Add "See Example Results" secondary CTA (scrolls to examples)
- [x] Create AI platforms strip (ChatGPT, Perplexity, Claude, Alexa, Google)
- [x] Build Problem/Platforms section
- [x] Add Next 2 Fixes section with premium styling
- [x] Create Example biweekly update section
- [x] Redesign Pricing section with dark mode
- [x] Add Final CTA section
- [x] Polish all sections for high conversion
- [x] Test responsive design and performance
