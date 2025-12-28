# Stripe Payment Integration Guide

## Overview
This document describes the Stripe payment processing implementation for CourseForge AI, enabling subscription management and billing.

## What Was Implemented

### 1. Stripe SDK Integration
- **Package**: `stripe` (server-side) and `@stripe/stripe-js` (client-side)
- **Configuration**: `lib/stripe.ts`
- **API Keys**: Environment variables for secure key management

### 2. Subscription Plans

Three subscription tiers with automated billing:

#### Starter Plan ($19/month)
- 20 AI-generated courses/month
- 25 AI videos/month
- Unlimited quizzes
- Basic integrations
- Email support
- **14-day free trial**

#### Professional Plan ($49/month)
- 40 AI-generated courses/month
- 65 AI videos/month
- Unlimited quizzes
- All integrations
- Priority support
- Team collaboration
- **14-day free trial**

#### Enterprise Plan ($149/month)
- Unlimited courses
- Unlimited videos
- Unlimited quizzes
- Custom integrations
- 24/7 support
- Advanced analytics
- White-label option
- **30-day free trial**

### 3. API Endpoints

#### Checkout Session (`/api/stripe/create-checkout`)
Creates a Stripe checkout session for subscription signup.

**Request:**
```json
POST /api/stripe/create-checkout
{
  "plan": "starter" | "professional" | "enterprise"
}
```

**Response:**
```json
{
  "sessionId": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### Billing Portal (`/api/stripe/portal`)
Creates a customer portal session for subscription management.

**Request:**
```json
POST /api/stripe/portal
{
  "customerId": "cus_..."
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

#### Webhooks (`/api/stripe/webhook`)
Handles Stripe webhook events:
- `checkout.session.completed` - Subscription activated
- `customer.subscription.updated` - Subscription modified
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed

### 4. UI Components

#### PricingCard Component (`components/PricingCard.tsx`)
Interactive pricing cards with Stripe checkout integration:
- Displays plan features
- Loading states during checkout
- Error handling
- Direct checkout button

### 5. Security Features
- Server-side API key storage
- Webhook signature verification
- Protected API endpoints (authentication required)
- Customer data encryption by Stripe

## Setup Instructions

### 1. Create Stripe Account

1. Visit [stripe.com](https://stripe.com)
2. Sign up for a Stripe account
3. Complete business verification (or use test mode)

### 2. Get API Keys

#### Test Mode (Recommended for Development)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)
2. Click "Developers" → "API keys"
3. Copy **Publishable key** and **Secret key**

#### Live Mode (Production)
1. Complete Stripe account activation
2. Go to [Stripe Dashboard](https://dashboard.stripe.com/dashboard)
3. Click "Developers" → "API keys"
4. Copy **Publishable key** and **Secret key**

### 3. Create Products and Prices

1. Go to [Products](https://dashboard.stripe.com/test/products)
2. Click "Add product" for each plan:

**Starter Product:**
- Name: "Starter Plan"
- Description: "20 courses, 25 videos per month"
- Pricing: $19.00 USD / month
- Copy the **Price ID** (starts with `price_`)

**Professional Product:**
- Name: "Professional Plan"
- Description: "40 courses, 65 videos per month"
- Pricing: $49.00 USD / month
- Copy the **Price ID**

**Enterprise Product:**
- Name: "Enterprise Plan"
- Description: "Unlimited courses and videos"
- Pricing: $149.00 USD / month
- Copy the **Price ID**

### 4. Set Up Webhooks

1. Go to [Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

### 5. Configure Environment Variables

Add to `.env.local`:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

### 6. Restart Development Server

```bash
npm run dev
```

## Testing Subscriptions

### Test Mode Cards

Stripe provides test cards for different scenarios:

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

**Declined Payment:**
```
Card: 4000 0000 0000 0002
```

**Requires Authentication:**
```
Card: 4000 0027 6000 3184
```

[Full list of test cards](https://stripe.com/docs/testing)

### Testing Workflow

1. Navigate to homepage pricing section
2. Click "14-day free trial" on any plan
3. Log in (if not authenticated)
4. You'll be redirected to Stripe checkout
5. Use a test card number
6. Complete the checkout
7. You'll be redirected back to dashboard

### Webhook Testing

**Local Development:**
Use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook signing secret and add to .env.local
```

**Production:**
Configure webhook endpoint in Stripe Dashboard.

## Customer Portal

Users can manage their subscriptions through Stripe Customer Portal:

**Features:**
- Update payment method
- View invoice history
- Manage subscription
- Cancel subscription
- Download invoices

**Access:**
Will be implemented in Phase 5 (Database) to store customer IDs.

## Usage Limits Enforcement

Usage limits are defined in `lib/stripe.ts`:

```typescript
export const PLANS = {
  starter: {
    features: {
      courses: 20,      // per month
      videos: 25,       // per month
      quizzes: -1,      // unlimited
    }
  },
  // ... other plans
};
```

**Implementation Notes:**
- Limits will be enforced in Phase 5 (Database)
- Track usage in database
- Check limits before AI generation
- Reset monthly counters

## Webhook Event Handling

### Current Implementation
Webhooks log events to console. TODO items marked for database integration.

### Phase 5 (Database) Integration
When database is implemented, webhooks will:

**checkout.session.completed:**
```typescript
// Store in database:
- user.stripeCustomerId
- user.stripeSubscriptionId
- user.plan = 'starter' | 'professional' | 'enterprise'
- user.subscriptionStatus = 'active'
- user.trialEndsAt = Date
```

**customer.subscription.updated:**
```typescript
// Update in database:
- user.subscriptionStatus
- user.plan (if changed)
```

**customer.subscription.deleted:**
```typescript
// Update in database:
- user.subscriptionStatus = 'cancelled'
- user.plan = 'free'
- Clear usage limits
```

## Pricing Model

### Revenue Calculation

**Starter:** $19/mo × 100 users = $1,900/mo
**Professional:** $49/mo × 50 users = $2,450/mo
**Enterprise:** $149/mo × 10 users = $1,490/mo

**Total MRR:** $5,840/mo

### Cost Structure

**OpenAI Costs (per user/month):**
- Starter: 20 courses × $0.06 = $1.20
- Professional: 40 courses × $0.06 = $2.40
- Enterprise: Variable, but high volume = discounts

**Gross Margin:**
- Starter: $19 - $1.20 = $17.80 (94%)
- Professional: $49 - $2.40 = $46.60 (95%)
- Enterprise: $149 - variable (>90%)

## Security Best Practices

### API Key Management
- ✅ Never commit API keys to repository
- ✅ Use environment variables
- ✅ Separate test and live keys
- ✅ Rotate keys periodically

### Webhook Security
- ✅ Verify webhook signatures
- ✅ Use HTTPS only
- ✅ Validate event data
- ✅ Handle idempotency

### PCI Compliance
- ✅ Never store card data
- ✅ Use Stripe.js for card collection
- ✅ Stripe handles PCI compliance
- ✅ Only store Stripe customer/subscription IDs

## Error Handling

### Common Errors

**"Stripe is not configured"**
- Solution: Add `STRIPE_SECRET_KEY` to `.env.local`

**"Invalid plan selected"**
- Solution: Check plan parameter is 'starter', 'professional', or 'enterprise'

**"Plan price ID not configured"**
- Solution: Add price IDs to environment variables

**"Webhook signature verification failed"**
- Solution: Use correct `STRIPE_WEBHOOK_SECRET`

### Monitoring
- Monitor failed payments in Stripe Dashboard
- Set up email alerts for subscription cancellations
- Track subscription metrics (MRR, churn rate)

## Next Steps

### Phase 5: Database Integration
Once database is implemented:
1. Store Stripe customer IDs
2. Track subscription status
3. Enforce usage limits
4. Store payment history
5. Implement customer portal access

### Future Enhancements
- Annual billing (discount)
- Add-on purchases (extra courses/videos)
- Team member seats
- Usage-based pricing
- Promotional codes
- Referral program

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)

## Summary

✅ **Completed**: Phase 4 - Stripe Payment Processing
- Subscription checkout
- Three pricing tiers with trials
- Webhook handling
- Billing portal setup
- Security implemented

⏭️ **Next**: Phase 5 - Database (Prisma + PostgreSQL)
- User data persistence
- Subscription tracking
- Usage limit enforcement
- Payment history
- Course storage
