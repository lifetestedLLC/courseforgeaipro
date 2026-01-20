'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Check,
  Filter,
  Loader2
} from 'lucide-react';
import type { TemplateCategory, SubscriptionTier } from '@/types/template';

interface TemplateWithAccess {
  name: string;
  description: string;
  category: TemplateCategory;
  tier: SubscriptionTier;
  thumbnail: string;
  hasAccess: boolean;
  requiresUpgrade: boolean;
  upgradeToTier?: SubscriptionTier;
}

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  business: 'Business',
  education: 'Education',
  creative: 'Creative',
  professional: 'Professional',
  minimal: 'Minimal',
  elegant: 'Elegant',
};

const TIER_LABELS: Record<SubscriptionTier, string> = {
  free: 'Free',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

const TIER_COLORS: Record<SubscriptionTier, string> = {
  free: 'bg-gray-100 text-gray-700',
  starter: 'bg-blue-100 text-blue-700',
  professional: 'bg-purple-100 text-purple-700',
  enterprise: 'bg-yellow-100 text-yellow-700',
};

export default function TemplatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateWithAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [userTier, setUserTier] = useState<SubscriptionTier>('free');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchTemplates();
    }
  }, [session, selectedCategory]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const categoryParam = selectedCategory !== 'all' ? `?category=${selectedCategory}&showAll=true` : '?showAll=true';
      const response = await fetch(`/api/templates${categoryParam}`);
      
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
        setUserTier(data.userTier);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const categories: Array<TemplateCategory | 'all'> = ['all', 'business', 'education', 'creative', 'professional', 'minimal', 'elegant'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
                CourseForge AI
              </Link>
            </div>
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-primary-600"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                <Sparkles className="inline-block w-8 h-8 text-primary-600 mr-2" />
                Course Design Templates
              </h1>
              <p className="text-gray-600 text-lg">
                Choose from professionally designed templates to make your course PDFs stand out on Etsy
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Your Plan</div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${TIER_COLORS[userTier]}`}>
                {TIER_LABELS[userTier]}
              </span>
            </div>
          </div>

          {/* Subscription Upgrade Banner */}
          {userTier === 'free' && (
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">✨ Unlock Premium Templates</h3>
                  <p className="text-primary-50 mb-4">
                    Upgrade to access professional fonts, clip art, and stunning designs
                  </p>
                </div>
                <Link
                  href="/subscription"
                  className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition whitespace-nowrap"
                >
                  View Plans
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Templates' : CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <TemplateCard
              key={index}
              template={template}
              index={index}
            />
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No templates found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateCard({ 
  template, 
  index 
}: { 
  template: TemplateWithAccess;
  index: number;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition hover:shadow-lg ${
      template.hasAccess ? 'border-gray-200 hover:border-primary-500' : 'border-gray-200'
    }`}>
      {/* Template Preview */}
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {/* Placeholder for template preview */}
        <div className="text-center p-6">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">{template.name}</p>
          <p className="text-xs text-gray-400 mt-2">Preview Coming Soon</p>
        </div>
        
        {/* Tier Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${TIER_COLORS[template.tier]}`}>
            {TIER_LABELS[template.tier]}
          </span>
        </div>

        {/* Lock Overlay for Inaccessible Templates */}
        {!template.hasAccess && template.upgradeToTier && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-12 h-12 mx-auto mb-2" />
              <p className="font-semibold">Upgrade to {TIER_LABELS[template.upgradeToTier as SubscriptionTier]}</p>
            </div>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          {template.hasAccess && (
            <Check className="w-5 h-5 text-green-600" />
          )}
        </div>
        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
        <div className="text-xs text-gray-500 mb-4">
          Category: <span className="font-medium">{CATEGORY_LABELS[template.category]}</span>
        </div>

        {/* Action Button */}
        {template.hasAccess ? (
          <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition">
            Use This Template
          </button>
        ) : (
          <Link
            href="/subscription"
            className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-center hover:bg-gray-200 transition"
          >
            Upgrade to Unlock
          </Link>
        )}
      </div>
    </div>
  );
}
