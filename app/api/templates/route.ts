import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TEMPLATE_CONFIGS, hasAccessToTemplate } from '@/lib/templates';
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

    // Get user's subscription tier from session or database
    // For now, we'll use a default tier, but this should be fetched from the user's record
    const userTier: SubscriptionTier = 'free'; // This would come from the authenticated user

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const showAll = searchParams.get('showAll') === 'true';

    // Filter templates
    let templates = TEMPLATE_CONFIGS;

    // Filter by category if specified
    if (category) {
      templates = templates.filter(t => t.category === category);
    }

    // Add access information to each template
    const templatesWithAccess = templates.map(template => ({
      ...template,
      hasAccess: hasAccessToTemplate(userTier, template.tier),
      requiresUpgrade: !hasAccessToTemplate(userTier, template.tier),
      upgradeToTier: !hasAccessToTemplate(userTier, template.tier) ? template.tier : undefined,
    }));

    // If showAll is false, only return accessible templates
    const filteredTemplates = showAll 
      ? templatesWithAccess 
      : templatesWithAccess.filter(t => t.hasAccess);

    return NextResponse.json({
      success: true,
      templates: filteredTemplates,
      userTier,
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
