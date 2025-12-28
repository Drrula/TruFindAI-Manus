/**
 * Stripe Products and Prices Configuration
 * 
 * This file defines the products and pricing for TruFindAI monitoring service.
 * Products and prices should be created in Stripe Dashboard first, then referenced here.
 */

export const PRODUCTS = {
  MONITORING_SERVICE: {
    name: "TruFindAI Monitoring Service",
    description: "Biweekly score updates with progress tracking and email notifications",
    priceId: process.env.NODE_ENV === "production" 
      ? "price_live_monitoring_monthly" // Replace with actual live price ID
      : "price_test_monitoring_monthly", // Replace with actual test price ID
    amount: 9700, // $97.00 in cents
    currency: "usd",
    interval: "month",
  },
} as const;

/**
 * Get the price ID for the monitoring service based on environment
 */
export function getMonitoringServicePriceId(): string {
  return PRODUCTS.MONITORING_SERVICE.priceId;
}

/**
 * Get product display information
 */
export function getMonitoringServiceInfo() {
  return {
    name: PRODUCTS.MONITORING_SERVICE.name,
    description: PRODUCTS.MONITORING_SERVICE.description,
    amount: PRODUCTS.MONITORING_SERVICE.amount,
    currency: PRODUCTS.MONITORING_SERVICE.currency,
    interval: PRODUCTS.MONITORING_SERVICE.interval,
    displayPrice: `$${(PRODUCTS.MONITORING_SERVICE.amount / 100).toFixed(0)}/${PRODUCTS.MONITORING_SERVICE.interval}`,
  };
}
