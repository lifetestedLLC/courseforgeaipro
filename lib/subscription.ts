/**
 * Subscription tier utility functions
 * Handles access control and tier checking with special admin privileges
 */

import type { SubscriptionTier } from '@/types/template';

/**
 * Check if a user has admin privileges
 * Admins should have unlimited access to all features
 */
export function isAdmin(userRole: string | null | undefined): boolean {
  return userRole === 'admin';
}

/**
 * Get effective subscription tier for a user
 * Admins are treated as having enterprise tier
 */
export function getEffectiveTier(
  userTier: SubscriptionTier | null | undefined,
  userRole: string | null | undefined
): SubscriptionTier {
  // Admins always get enterprise-level access
  if (isAdmin(userRole)) {
    return 'enterprise';
  }
  
  // Default to free tier if no subscription
  return userTier || 'free';
}

/**
 * Check if a user has access to a specific tier's features
 * Admins automatically have access to all tiers
 */
export function hasAccessToTier(
  userTier: SubscriptionTier | null | undefined,
  userRole: string | null | undefined,
  requiredTier: SubscriptionTier
): boolean {
  // Admins have access to everything
  if (isAdmin(userRole)) {
    return true;
  }

  // Get user's effective tier (defaults to free)
  const effectiveTier = userTier || 'free';
  
  // Tier hierarchy: free < starter < professional < enterprise
  const tierHierarchy: SubscriptionTier[] = ['free', 'starter', 'professional', 'enterprise'];
  const userTierIndex = tierHierarchy.indexOf(effectiveTier);
  const requiredTierIndex = tierHierarchy.indexOf(requiredTier);
  
  return userTierIndex >= requiredTierIndex;
}

/**
 * Check if a user has unlimited usage for a feature
 * Admins always have unlimited usage
 */
export function hasUnlimitedUsage(
  userTier: SubscriptionTier | null | undefined,
  userRole: string | null | undefined,
  feature: 'courses' | 'videos' | 'quizzes'
): boolean {
  // Admins always have unlimited usage
  if (isAdmin(userRole)) {
    return true;
  }

  // Enterprise tier has unlimited for all features
  if (userTier === 'enterprise') {
    return true;
  }

  // Quizzes are unlimited for all tiers (except free)
  if (feature === 'quizzes' && userTier) {
    return true;
  }

  return false;
}

/**
 * Get the usage limit for a specific feature based on tier
 * Returns -1 for unlimited, 0 for no access
 */
export function getUsageLimit(
  userTier: SubscriptionTier | null | undefined,
  userRole: string | null | undefined,
  feature: 'courses' | 'videos' | 'quizzes'
): number {
  // Admins have unlimited access
  if (isAdmin(userRole)) {
    return -1;
  }

  // Define limits by tier
  const limits = {
    free: {
      courses: 0,
      videos: 0,
      quizzes: 0,
    },
    starter: {
      courses: 20,
      videos: 25,
      quizzes: -1, // unlimited
    },
    professional: {
      courses: 40,
      videos: 65,
      quizzes: -1, // unlimited
    },
    enterprise: {
      courses: -1, // unlimited
      videos: -1, // unlimited
      quizzes: -1, // unlimited
    },
  };

  const effectiveTier = userTier || 'free';
  return limits[effectiveTier][feature];
}
