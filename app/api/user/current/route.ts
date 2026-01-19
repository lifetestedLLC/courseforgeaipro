import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { getEffectiveTier } from "@/lib/subscription";
import type { SubscriptionTier } from "@/types/template";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      logger.warn("Unauthorized access attempt to current user API");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        coursesCreatedThisMonth: true,
        videosCreatedThisMonth: true,
        quizzesCreatedThisMonth: true,
      }
    });

    if (!user) {
      logger.warn("User not found", { userId: session.user.id });
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate effective tier (admins get enterprise tier)
    const effectiveTier = getEffectiveTier(
      user.subscriptionTier as SubscriptionTier | null,
      user.role
    );

    logger.info("Current user data retrieved", { userId: user.id });

    return NextResponse.json({
      ...user,
      effectiveTier, // Add the effective tier for display purposes
    });
  } catch (error) {
    logger.error("Error fetching current user", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
