import Stripe from 'stripe';

// Check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

// Initialize Stripe with secret key only if configured
let stripe: Stripe | null = null;

if (isStripeConfigured()) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  });
}

export default stripe;

// Subscription plans configuration
export const PLANS = {
  starter: {
    name: 'Starter',
    price: 19,
    interval: 'month' as const,
    features: {
      courses: 20,
      videos: 25,
      quizzes: -1, // unlimited
      integrations: 'basic',
      support: 'email',
    },
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || '',
  },
  professional: {
    name: 'Professional',
    price: 49,
    interval: 'month' as const,
    features: {
      courses: 40,
      videos: 65,
      quizzes: -1, // unlimited
      integrations: 'all',
      support: 'priority',
      teamCollaboration: true,
    },
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
  },
  enterprise: {
    name: 'Enterprise',
    price: 149,
    interval: 'month' as const,
    features: {
      courses: -1, // unlimited
      videos: -1, // unlimited
      quizzes: -1, // unlimited
      integrations: 'custom',
      support: '24/7',
      analytics: true,
      whiteLabel: true,
    },
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
  },
};

export type PlanType = keyof typeof PLANS;
