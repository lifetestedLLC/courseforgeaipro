import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
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
        
        // TODO: Update user subscription in database
        // - Store subscription ID
        // - Store customer ID
        // - Set plan type
        // - Activate subscription
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', {
          subscriptionId: subscription.id,
          status: subscription.status,
        });
        
        // TODO: Update subscription status in database
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', {
          subscriptionId: subscription.id,
        });
        
        // TODO: Deactivate subscription in database
        // - Remove subscription ID
        // - Downgrade to free plan
        
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded:', {
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
        });
        
        // TODO: Record payment in database
        
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed:', {
          invoiceId: invoice.id,
          customerEmail: invoice.customer_email,
        });
        
        // TODO: Handle failed payment
        // - Notify user
        // - Possibly suspend subscription
        
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
