import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { generateFastScore, generateFullScore } from "./scoring";
import { TRPCError } from "@trpc/server";
import { createMonitoringCheckoutSession } from "./stripe";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  score: router({
    /**
     * Submit a new score request (inbound lead)
     * Creates business profile and initiates fast + full score generation
     */
    submitRequest: publicProcedure
      .input(z.object({
        businessName: z.string().min(1, "Business name is required"),
        website: z.string().url("Valid website URL is required"),
        contactName: z.string().optional(),
        contactEmail: z.string().email("Valid email is required").optional(),
        contactPhone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Create business profile
        const businessProfileId = await db.createBusinessProfile({
          businessName: input.businessName,
          website: input.website,
          contactName: input.contactName,
          contactEmail: input.contactEmail,
          contactPhone: input.contactPhone,
          leadSource: "inbound",
          generateToken: true, // Generate token for future access
        });

        // Create fast score report (pending)
        const fastScoreId = await db.createScoreReport({
          businessProfileId,
          scanType: "fast",
          status: "processing",
        });

        // Create full score report (pending)
        const fullScoreId = await db.createScoreReport({
          businessProfileId,
          scanType: "full",
          status: "pending",
        });

        // Start fast score generation in background
        generateFastScore(input.website, input.businessName)
          .then(async (result) => {
            await db.updateScoreReport(fastScoreId, {
              overallScore: result.scores.overallScore.toString(),
              seoScore: result.scores.seoScore.toString(),
              visibilityScore: result.scores.visibilityScore.toString(),
              localPresenceScore: result.scores.localPresenceScore.toString(),
              reputationScore: result.scores.reputationScore.toString(),
              recommendations: JSON.stringify(result.recommendations),
              status: "completed",
              completedAt: new Date(),
            });

            // Start full score generation after fast score completes
            await db.updateScoreReport(fullScoreId, { status: "processing" });
            
            const fullResult = await generateFullScore(input.website, input.businessName);
            await db.updateScoreReport(fullScoreId, {
              overallScore: fullResult.scores.overallScore.toString(),
              seoScore: fullResult.scores.seoScore.toString(),
              visibilityScore: fullResult.scores.visibilityScore.toString(),
              localPresenceScore: fullResult.scores.localPresenceScore.toString(),
              reputationScore: fullResult.scores.reputationScore.toString(),
              recommendations: JSON.stringify(fullResult.recommendations),
              competitorBenchmarks: JSON.stringify(fullResult.competitorBenchmarks),
              status: "completed",
              completedAt: new Date(),
            });
          })
          .catch(async (error) => {
            console.error("Score generation failed:", error);
            await db.updateScoreReport(fastScoreId, {
              status: "failed",
              errorMessage: error.message,
            });
            await db.updateScoreReport(fullScoreId, {
              status: "failed",
              errorMessage: error.message,
            });
          });

        // Get the business profile with token
        const profile = await db.getBusinessProfileById(businessProfileId);

        // Notify owner about new lead
        notifyOwner({
          title: "New TruFindAI Score Request",
          content: `New inbound lead from ${input.businessName}\n\nWebsite: ${input.website}\nContact: ${input.contactName || 'N/A'}\nEmail: ${input.contactEmail || 'N/A'}\nPhone: ${input.contactPhone || 'N/A'}`,
        }).catch(err => console.error("Failed to notify owner:", err));

        return {
          businessProfileId,
          scoreToken: profile?.scoreToken,
          fastScoreId,
          fullScoreId,
        };
      }),

    /**
     * Get score status and results by token
     * Used for both inbound and outbound leads
     */
    getByToken: publicProcedure
      .input(z.object({
        token: z.string(),
      }))
      .query(async ({ input }) => {
        const profile = await db.getBusinessProfileByToken(input.token);
        if (!profile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Score not found",
          });
        }

        const reports = await db.getScoreReportsByBusinessId(profile.id);
        const fastScore = reports.find(r => r.scanType === "fast");
        const fullScore = reports.find(r => r.scanType === "full");

        return {
          profile,
          fastScore: fastScore ? {
            ...fastScore,
            recommendations: fastScore.recommendations ? JSON.parse(fastScore.recommendations) : null,
          } : null,
          fullScore: fullScore ? {
            ...fullScore,
            recommendations: fullScore.recommendations ? JSON.parse(fullScore.recommendations) : null,
            competitorBenchmarks: fullScore.competitorBenchmarks ? JSON.parse(fullScore.competitorBenchmarks) : null,
          } : null,
        };
      }),

    /**
     * Poll for score updates (used during generation)
     */
    pollStatus: publicProcedure
      .input(z.object({
        token: z.string(),
      }))
      .query(async ({ input }) => {
        const profile = await db.getBusinessProfileByToken(input.token);
        if (!profile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Score not found",
          });
        }

        const reports = await db.getScoreReportsByBusinessId(profile.id);
        const fastScore = reports.find(r => r.scanType === "fast");
        const fullScore = reports.find(r => r.scanType === "full");

        return {
          fastScoreStatus: fastScore?.status || "pending",
          fullScoreStatus: fullScore?.status || "pending",
          fastScoreCompleted: fastScore?.status === "completed",
          fullScoreCompleted: fullScore?.status === "completed",
        };
      }),
  }),

  checkout: router({
    /**
     * Create Stripe checkout session for monitoring service subscription
     */
    createMonitoringSession: publicProcedure
      .input(z.object({
        businessProfileId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const profile = await db.getBusinessProfileById(input.businessProfileId);
        if (!profile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Business profile not found",
          });
        }

        const origin = ctx.req.headers.origin || "http://localhost:3000";
        const token = profile.scoreToken || "";

        const session = await createMonitoringCheckoutSession({
          businessProfileId: input.businessProfileId,
          customerEmail: profile.contactEmail || undefined,
          customerName: profile.contactName || profile.businessName,
          successUrl: `${origin}/results/${token}?checkout=success`,
          cancelUrl: `${origin}/results/${token}?checkout=canceled`,
        });

        return {
          sessionId: session.sessionId,
          checkoutUrl: session.url,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
