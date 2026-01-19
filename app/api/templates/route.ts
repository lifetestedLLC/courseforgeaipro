import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasAccessToTemplate } from '@/lib/templates';
import { getEffectiveTier } from '@/lib/subscription';
import { prisma } from '@/lib/prisma';
import type { SubscriptionTier } from '@/types/template';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's subscription tier and role from database
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      select: { 
        subscriptionTier: true,
        role: true,
      },
    });

    const userTier: SubscriptionTier = (user?.subscriptionTier as SubscriptionTier) || 'free';
    const userRole = user?.role;
    
    // Get effective tier for display (admins get enterprise tier)
    const effectiveTier = getEffectiveTier(userTier, userRole);

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const showAll = searchParams.get('showAll') === 'true';

    // Build query
    const whereClause: any = { isActive: true };
    if (category) {
      whereClause.category = category;
    }

    // Fetch templates from database
    const templates = await prisma.template.findMany({
      where: whereClause,
      orderBy: [
        { tier: 'asc' },
        { name: 'asc' },
      ],
    });

    // Add access information to each template
    const templatesWithAccess = templates.map(template => {
      // Note: hasAccessToTemplate uses the raw database subscription tier (userTier)
      // combined with userRole. It internally handles admin privileges via hasAccessToTier.
      const userHasAccess = hasAccessToTemplate(userTier, template.tier as SubscriptionTier, userRole);
      return {
        ...template,
        fonts: template.fonts as any,
        colors: template.colors as any,
        clipArt: template.clipArt as any,
        layout: template.layout as any,
        hasAccess: userHasAccess,
        requiresUpgrade: !userHasAccess,
        upgradeToTier: !userHasAccess 
          ? template.tier 
          : undefined,
      };
    });

    // If showAll is false, only return accessible templates
    const filteredTemplates = showAll 
      ? templatesWithAccess 
      : templatesWithAccess.filter(t => t.hasAccess);

    return NextResponse.json({
      success: true,
      templates: filteredTemplates,
      // Field explanation:
      // - userTier: Contains EFFECTIVE tier for UI display (backward compatible)
      //   This is what the UI needs to show correct tier badge and upgrade prompts
      //   For admins: returns "enterprise" (even if DB has "free")
      //   For users: returns their actual subscription tier
      userTier: effectiveTier,
      // - effectiveTier: Duplicate of userTier (explicit field for new code)
      effectiveTier,
      // - actualTier: Raw subscription tier from database (for reference/debugging)
      //   This is the literal value stored in the subscriptionTier column
      actualTier: userTier,
      total: filteredTemplates.length,
    });

  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
