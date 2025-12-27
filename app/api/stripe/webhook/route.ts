import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// This endpoint handles Stripe webhooks
// Disable body parsing, as we need the raw body for signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error("Stripe webhook secret not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  if (!stripe) {
    console.error("Stripe client not initialized");
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout completed:', {
          userId: session.metadata?.userId,
          plan: session.metadata?.plan,
          subscriptionId: session.subscription,
        });
        
        // Update user subscription in database
        if (session.customer && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          // Cast to any to handle the Stripe SDK type inconsistency
          const sub = subscription as any;
          
          await prisma.user.update({
            where: { id: session.client_reference_id || undefined },
            data: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: sub.id,
              stripePriceId: sub.items?.data?.[0]?.price?.id,
              stripeCurrentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
              subscriptionTier: session.metadata?.plan,
              subscriptionStatus: sub.status,
            },
          });
        }
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        console.log('Subscription updated:', {
          subscriptionId: subscription.id,
          status: subscription.status,
        });
        
        // Update subscription status in database
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            subscriptionStatus: subscription.status,
            stripePriceId: subscription.items?.data?.[0]?.price?.id,
            stripeCurrentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
          },
        });
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', {
          subscriptionId: subscription.id,
        });
        
        // Deactivate subscription in database
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            subscriptionTier: null,
            subscriptionStatus: 'canceled',
          },
        });
        
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        console.log('Payment succeeded:', {
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
        });
        
        // Update subscription status to active
        if (invoice.subscription) {
          await prisma.user.updateMany({
            where: { stripeSubscriptionId: invoice.subscription as string },
            data: {
              subscriptionStatus: 'active',
            },
          });
        }
        
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        console.log('Payment failed:', {
          invoiceId: invoice.id,
          customerEmail: invoice.customer_email,
        });
        
        // Mark subscription as past_due
        if (invoice.subscription) {
          await prisma.user.updateMany({
            where: { stripeSubscriptionId: invoice.subscription as string },
            data: {
              subscriptionStatus: 'past_due',
            },
          });
        }
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
