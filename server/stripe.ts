import Stripe from "stripe";
import { ENV } from "./_core/env";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { getMonitoringServicePriceId } from "./products";

if (!ENV.stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured");
}

export const stripe = new Stripe(ENV.stripeSecretKey);

/**
 * Create a Stripe Checkout Session for the monitoring service subscription
 */
export async function createMonitoringCheckoutSession(params: {
  businessProfileId: number;
  customerEmail?: string;
  customerName?: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ sessionId: string; url: string }> {
  const { businessProfileId, customerEmail, customerName, successUrl, cancelUrl } = params;

  // Get business profile
  const profile = await db.getBusinessProfileById(businessProfileId);
  if (!profile) {
    throw new Error("Business profile not found");
  }

  // Create or retrieve Stripe customer
  let customerId = profile.stripeCustomerId || undefined;
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: customerEmail || profile.contactEmail || undefined,
      name: customerName || profile.contactName || profile.businessName,
      metadata: {
        businessProfileId: businessProfileId.toString(),
        businessName: profile.businessName,
      },
    });
    customerId = customer.id;
    
    // Save customer ID to database
    await db.updateBusinessProfileSubscription(businessProfileId, {
      stripeCustomerId: customerId,
    });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    client_reference_id: businessProfileId.toString(),
    mode: "subscription",
    line_items: [
      {
        price: getMonitoringServicePriceId(),
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    metadata: {
      businessProfileId: businessProfileId.toString(),
      businessName: profile.businessName,
      customerEmail: customerEmail || profile.contactEmail || "",
    },
    subscription_data: {
      metadata: {
        businessProfileId: businessProfileId.toString(),
        businessName: profile.businessName,
      },
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session URL");
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  console.log(`[Stripe Webhook] Processing event: ${event.type} (${event.id})`);

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, skipping processing");
    return;
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCanceled(subscription);
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`[Stripe Webhook] Invoice paid: ${invoice.id}`);
      // Additional invoice handling can be added here
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`[Stripe Webhook] Invoice payment failed: ${invoice.id}`);
      
      // Update subscription status to past_due
      const invoiceAny = invoice as any;
      const subscriptionId = typeof invoiceAny.subscription === 'string' ? invoiceAny.subscription : invoiceAny.subscription?.id;
      if (subscriptionId) {
        const businessProfileId = await getBusinessProfileIdFromSubscription(
          subscriptionId
        );
        if (businessProfileId) {
          await db.updateBusinessProfileSubscription(businessProfileId, {
            subscriptionStatus: "past_due",
          });
        }
      }
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const businessProfileId = parseInt(session.client_reference_id || "0");
  
  if (!businessProfileId) {
    console.error("[Stripe Webhook] Missing businessProfileId in checkout session");
    return;
  }

  console.log(`[Stripe Webhook] Checkout completed for business profile ${businessProfileId}`);

  // Update business profile with subscription info
  if (session.subscription) {
    await db.updateBusinessProfileSubscription(businessProfileId, {
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      subscriptionStatus: "active",
    });

    // Get business profile for notification
    const profile = await db.getBusinessProfileById(businessProfileId);
    if (profile) {
      // Notify owner about successful conversion
      notifyOwner({
        title: "New TruFindAI Subscription!",
        content: `${profile.businessName} just subscribed to monitoring service!\n\nWebsite: ${profile.website}\nContact: ${profile.contactName || 'N/A'}\nEmail: ${profile.contactEmail || 'N/A'}\nSubscription ID: ${session.subscription}`,
      }).catch(err => console.error("Failed to notify owner:", err));
    }
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
  const businessProfileId = await getBusinessProfileIdFromSubscription(subscription.id);
  
  if (!businessProfileId) {
    console.error("[Stripe Webhook] Could not find business profile for subscription");
    return;
  }

  console.log(`[Stripe Webhook] Subscription updated for business profile ${businessProfileId}`);

  // Map Stripe subscription status to our status
  let status: "none" | "active" | "canceled" | "past_due" = "none";
  if (subscription.status === "active") {
    status = "active";
  } else if (subscription.status === "canceled") {
    status = "canceled";
  } else if (subscription.status === "past_due") {
    status = "past_due";
  }

  await db.updateBusinessProfileSubscription(businessProfileId, {
    subscriptionStatus: status,
  });
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled(subscription: Stripe.Subscription): Promise<void> {
  const businessProfileId = await getBusinessProfileIdFromSubscription(subscription.id);
  
  if (!businessProfileId) {
    console.error("[Stripe Webhook] Could not find business profile for subscription");
    return;
  }

  console.log(`[Stripe Webhook] Subscription canceled for business profile ${businessProfileId}`);

  await db.updateBusinessProfileSubscription(businessProfileId, {
    subscriptionStatus: "canceled",
  });
}

/**
 * Helper to get business profile ID from subscription
 */
async function getBusinessProfileIdFromSubscription(subscriptionId: string): Promise<number | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const businessProfileId = subscription.metadata?.businessProfileId;
    return businessProfileId ? parseInt(businessProfileId) : null;
  } catch (error) {
    console.error("[Stripe] Error retrieving subscription:", error);
    return null;
  }
}
