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
- [ ] Create checkpoint and deliver to user
