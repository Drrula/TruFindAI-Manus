import type { Request, Response } from "express";
import { stripe, handleWebhookEvent } from "./stripe";
import { ENV } from "./_core/env";

/**
 * Stripe webhook handler
 * Must be registered with express.raw middleware before express.json
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Stripe Webhook] Missing stripe-signature header");
    return res.status(400).send("Missing signature");
  }

  if (!ENV.stripeWebhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).send("Webhook secret not configured");
  }

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  // Process the event
  try {
    await handleWebhookEvent(event);
    res.json({ received: true });
  } catch (err: any) {
    console.error("[Stripe Webhook] Error processing event:", err);
    res.status(500).send(`Webhook processing error: ${err.message}`);
  }
}
