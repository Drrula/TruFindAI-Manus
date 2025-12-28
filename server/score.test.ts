import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the database functions
vi.mock("./db", () => ({
  createBusinessProfile: vi.fn(),
  getBusinessProfileById: vi.fn(),
  getBusinessProfileByToken: vi.fn(),
  createScoreReport: vi.fn(),
  updateScoreReport: vi.fn(),
  getScoreReportsByBusinessId: vi.fn(),
}));

// Mock the scoring functions to return immediately
vi.mock("./scoring", () => ({
  generateFastScore: vi.fn().mockResolvedValue({
    scores: {
      overallScore: 73.5,
      seoScore: 68.2,
      visibilityScore: 75.3,
      localPresenceScore: 78.1,
      reputationScore: 71.4,
    },
    recommendations: [
      {
        title: "Optimize Meta Tags",
        description: "Add missing meta descriptions",
        impact: "high",
      },
    ],
  }),
  generateFullScore: vi.fn().mockResolvedValue({
    scores: {
      overallScore: 75.0,
      seoScore: 70.0,
      visibilityScore: 77.0,
      localPresenceScore: 80.0,
      reputationScore: 73.0,
    },
    recommendations: [
      {
        title: "Optimize Meta Tags",
        description: "Add missing meta descriptions",
        impact: "high",
      },
    ],
    competitorBenchmarks: [
      {
        competitorName: "Top Competitor",
        competitorScore: 85.0,
        yourScore: 75.0,
        gap: 10.0,
      },
    ],
  }),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {
        origin: "https://test.example.com",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("score.submitRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates business profile and initiates score generation", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Mock database responses
    vi.mocked(db.createBusinessProfile).mockResolvedValue(1);
    vi.mocked(db.createScoreReport).mockResolvedValueOnce(1).mockResolvedValueOnce(2);
    vi.mocked(db.getBusinessProfileById).mockResolvedValue({
      id: 1,
      businessName: "Test Contracting",
      website: "https://test.com",
      contactName: "John Doe",
      contactEmail: "john@test.com",
      contactPhone: "555-1234",
      leadSource: "inbound",
      scoreToken: "test-token-123",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "none",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await caller.score.submitRequest({
      businessName: "Test Contracting",
      website: "https://test.com",
      contactName: "John Doe",
      contactEmail: "john@test.com",
      contactPhone: "555-1234",
    });

    expect(result.businessProfileId).toBe(1);
    expect(result.scoreToken).toBe("test-token-123");
    expect(result.fastScoreId).toBe(1);
    expect(result.fullScoreId).toBe(2);

    // Verify business profile was created with correct data
    expect(db.createBusinessProfile).toHaveBeenCalledWith({
      businessName: "Test Contracting",
      website: "https://test.com",
      contactName: "John Doe",
      contactEmail: "john@test.com",
      contactPhone: "555-1234",
      leadSource: "inbound",
      generateToken: true,
    });

    // Verify score reports were created
    expect(db.createScoreReport).toHaveBeenCalledTimes(2);
  });

  it("requires business name and website", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.score.submitRequest({
        businessName: "",
        website: "https://test.com",
      })
    ).rejects.toThrow();

    await expect(
      caller.score.submitRequest({
        businessName: "Test",
        website: "invalid-url",
      })
    ).rejects.toThrow();
  });
});

describe("score.getByToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves score data by token", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const mockProfile = {
      id: 1,
      businessName: "Test Contracting",
      website: "https://test.com",
      contactName: "John Doe",
      contactEmail: "john@test.com",
      contactPhone: null,
      leadSource: "inbound" as const,
      scoreToken: "test-token-123",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "none" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockReports = [
      {
        id: 1,
        businessProfileId: 1,
        overallScore: "73.5",
        seoScore: "68.2",
        visibilityScore: "75.3",
        localPresenceScore: "78.1",
        reputationScore: "71.4",
        scanType: "fast" as const,
        status: "completed" as const,
        recommendations: JSON.stringify([{ title: "Test", description: "Test", impact: "high" }]),
        competitorBenchmarks: null,
        errorMessage: null,
        createdAt: new Date(),
        completedAt: new Date(),
      },
    ];

    vi.mocked(db.getBusinessProfileByToken).mockResolvedValue(mockProfile);
    vi.mocked(db.getScoreReportsByBusinessId).mockResolvedValue(mockReports);

    const result = await caller.score.getByToken({ token: "test-token-123" });

    expect(result.profile.businessName).toBe("Test Contracting");
    expect(result.fastScore).not.toBeNull();
    expect(result.fastScore?.overallScore).toBe("73.5");
  });

  it("throws error for invalid token", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getBusinessProfileByToken).mockResolvedValue(undefined);

    await expect(
      caller.score.getByToken({ token: "invalid-token" })
    ).rejects.toThrow("Score not found");
  });
});

describe("score.pollStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns score generation status", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const mockProfile = {
      id: 1,
      businessName: "Test Contracting",
      website: "https://test.com",
      contactName: null,
      contactEmail: null,
      contactPhone: null,
      leadSource: "inbound" as const,
      scoreToken: "test-token-123",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "none" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockReports = [
      {
        id: 1,
        businessProfileId: 1,
        overallScore: null,
        seoScore: null,
        visibilityScore: null,
        localPresenceScore: null,
        reputationScore: null,
        scanType: "fast" as const,
        status: "completed" as const,
        recommendations: null,
        competitorBenchmarks: null,
        errorMessage: null,
        createdAt: new Date(),
        completedAt: new Date(),
      },
      {
        id: 2,
        businessProfileId: 1,
        overallScore: null,
        seoScore: null,
        visibilityScore: null,
        localPresenceScore: null,
        reputationScore: null,
        scanType: "full" as const,
        status: "processing" as const,
        recommendations: null,
        competitorBenchmarks: null,
        errorMessage: null,
        createdAt: new Date(),
        completedAt: null,
      },
    ];

    vi.mocked(db.getBusinessProfileByToken).mockResolvedValue(mockProfile);
    vi.mocked(db.getScoreReportsByBusinessId).mockResolvedValue(mockReports);

    const result = await caller.score.pollStatus({ token: "test-token-123" });

    expect(result.fastScoreCompleted).toBe(true);
    expect(result.fullScoreCompleted).toBe(false);
    expect(result.fastScoreStatus).toBe("completed");
    expect(result.fullScoreStatus).toBe("processing");
  });
});
