import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TEMPLATE_CONFIGS, hasAccessToTemplate } from '@/lib/templates';
import type { SubscriptionTier } from '@/types/template';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params;

    // Get user's subscription tier
    const userTier: SubscriptionTier = 'free'; // This should come from the user's record

    // Find template by index (using array index as ID for now)
    const templateIndex = parseInt(id);
    
    if (isNaN(templateIndex) || templateIndex < 0 || templateIndex >= TEMPLATE_CONFIGS.length) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const template = TEMPLATE_CONFIGS[templateIndex];

    // Check access
    const hasAccess = hasAccessToTemplate(userTier, template.tier);

    return NextResponse.json({
      success: true,
      template: {
        ...template,
        id: templateIndex.toString(),
        hasAccess,
        requiresUpgrade: !hasAccess,
        upgradeToTier: !hasAccess ? template.tier : undefined,
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
