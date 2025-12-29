import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import stripe, { isStripeConfigured, PLANS, PlanType } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/url";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { plan } = body;

    // Validate plan
    if (!plan || !(plan in PLANS)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const selectedPlan = PLANS[plan as PlanType];

    if (!selectedPlan.stripePriceId) {
      return NextResponse.json(
        { error: "Plan price ID not configured" },
        { status: 500 }
      );
    }

    if (!stripe) {
      throw new Error("Stripe client not initialized");
    }

    // Get the base URL from the request (handles custom domains)
    const baseUrl = getBaseUrl(request);

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPlan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?success=true`,
      cancel_url: `${baseUrl}/#pricing`,
      customer_email: session.user.email || undefined,
      client_reference_id: session.user.id,
      metadata: {
        userId: session.user.id,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          plan: plan,
        },
        trial_period_days: plan === 'enterprise' ? 30 : 14,
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
