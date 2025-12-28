import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";
import * as stripe from "./stripe";

// Mock the database functions
vi.mock("./db", () => ({
  getBusinessProfileById: vi.fn(),
}));

// Mock Stripe functions
vi.mock("./stripe", () => ({
  createMonitoringCheckoutSession: vi.fn(),
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

describe("checkout.createMonitoringSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates Stripe checkout session for valid business profile", async () => {
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

    vi.mocked(db.getBusinessProfileById).mockResolvedValue(mockProfile);
    vi.mocked(stripe.createMonitoringCheckoutSession).mockResolvedValue({
      sessionId: "cs_test_123",
      url: "https://checkout.stripe.com/test",
    });

    const result = await caller.checkout.createMonitoringSession({
      businessProfileId: 1,
    });

    expect(result.sessionId).toBe("cs_test_123");
    expect(result.checkoutUrl).toBe("https://checkout.stripe.com/test");

    // Verify Stripe checkout was called with correct parameters
    expect(stripe.createMonitoringCheckoutSession).toHaveBeenCalledWith({
      businessProfileId: 1,
      customerEmail: "john@test.com",
      customerName: "John Doe",
      successUrl: "https://test.example.com/results/test-token-123?checkout=success",
      cancelUrl: "https://test.example.com/results/test-token-123?checkout=canceled",
    });
  });

  it("throws error for non-existent business profile", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getBusinessProfileById).mockResolvedValue(undefined);

    await expect(
      caller.checkout.createMonitoringSession({ businessProfileId: 999 })
    ).rejects.toThrow("Business profile not found");
  });

  it("uses business name when contact name is missing", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const mockProfile = {
      id: 1,
      businessName: "Test Contracting LLC",
      website: "https://test.com",
      contactName: null,
      contactEmail: "info@test.com",
      contactPhone: null,
      leadSource: "inbound" as const,
      scoreToken: "test-token-456",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "none" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(db.getBusinessProfileById).mockResolvedValue(mockProfile);
    vi.mocked(stripe.createMonitoringCheckoutSession).mockResolvedValue({
      sessionId: "cs_test_456",
      url: "https://checkout.stripe.com/test2",
    });

    await caller.checkout.createMonitoringSession({
      businessProfileId: 1,
    });

    // Verify business name was used as customer name
    expect(stripe.createMonitoringCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "Test Contracting LLC",
      })
    );
  });
});
