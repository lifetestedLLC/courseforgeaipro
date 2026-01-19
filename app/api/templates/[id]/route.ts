import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasAccessToTemplate } from '@/lib/templates';
import { prisma } from '@/lib/prisma';
import type { SubscriptionTier } from '@/types/template';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

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

    // Find template by ID
    const template = await prisma.template.findUnique({
      where: { id },
    });
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Check access
    const userHasAccess = hasAccessToTemplate(userTier, template.tier as SubscriptionTier, userRole);

    return NextResponse.json({
      success: true,
      template: {
        ...template,
        fonts: template.fonts as any,
        colors: template.colors as any,
        clipArt: template.clipArt as any,
        layout: template.layout as any,
        hasAccess: userHasAccess,
        requiresUpgrade: !userHasAccess,
        upgradeToTier: !userHasAccess ? template.tier : undefined,
      },
    });

  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}
