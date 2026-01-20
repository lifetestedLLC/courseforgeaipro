/**
 * Usage tracking and limit enforcement utilities
 * Handles subscription-based usage limits with special admin privileges
 */

import { prisma } from './prisma';
import { getUsageLimit, isAdmin } from './subscription';
import type { SubscriptionTier } from '@/types/template';
import { logger } from './logger';

/**
 * Check if a user has exceeded their usage limit for a specific feature
 * Admins always have unlimited access
 * @returns { allowed: boolean, message?: string, limit?: number, current?: number }
 */
export async function checkUsageLimit(
  userId: string,
  feature: 'courses' | 'videos' | 'quizzes'
): Promise<{ allowed: boolean; message?: string; limit?: number; current?: number }> {
  try {
    // Fetch user data including role and subscription tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        subscriptionTier: true,
        coursesCreatedThisMonth: true,
        videosCreatedThisMonth: true,
        quizzesCreatedThisMonth: true,
      },
    });

    if (!user) {
      return {
        allowed: false,
        message: 'User not found',
      };
    }

    // Admin users have unlimited access
    if (isAdmin(user.role)) {
      // Get actual current usage for statistics/display
      const currentUsage = 
        feature === 'courses' ? user.coursesCreatedThisMonth :
        feature === 'videos' ? user.videosCreatedThisMonth :
        user.quizzesCreatedThisMonth;
      
      logger.info('Admin user - unlimited access granted', { userId, feature, currentUsage });
      return {
        allowed: true,
        limit: -1, // -1 indicates unlimited
        current: currentUsage,
      };
    }

    // Get the usage limit for this feature based on subscription tier
    const limit = getUsageLimit(
      user.subscriptionTier as SubscriptionTier | null,
      user.role,
      feature
    );

    // Field map for usage counters
    const fieldMap = {
      courses: user.coursesCreatedThisMonth,
      videos: user.videosCreatedThisMonth,
      quizzes: user.quizzesCreatedThisMonth,
    };

    // Get current usage
    const currentUsage = fieldMap[feature];

    // -1 means unlimited
    if (limit === -1) {
      return {
        allowed: true,
        limit: -1,
        current: currentUsage,
      };
    }

    // 0 means no access
    if (limit === 0) {
      logger.warn('User has no access to feature', { userId, feature, tier: user.subscriptionTier });
      return {
        allowed: false,
        message: `This feature requires a paid subscription. Please upgrade your plan.`,
        limit: 0,
        current: currentUsage,
      };
    }

    // Check if user has exceeded their limit
    if (currentUsage >= limit) {
      logger.warn('User has exceeded usage limit', { 
        userId, 
        feature, 
        limit, 
        currentUsage,
        tier: user.subscriptionTier 
      });
      return {
        allowed: false,
        message: `You've reached your monthly limit of ${limit} ${feature}. Please upgrade your plan for more.`,
        limit,
        current: currentUsage,
      };
    }

    // User is within their limit
    return {
      allowed: true,
      limit,
      current: currentUsage,
    };
  } catch (error) {
    logger.error('Error checking usage limit', error as Error, { userId, feature });
    // In case of error, deny access to be safe
    return {
      allowed: false,
      message: 'Error checking usage limits. Please try again.',
    };
  }
}

/**
 * Increment the usage counter for a specific feature
 * This should be called after successful creation of a course, video, or quiz
 */
export async function incrementUsage(
  userId: string,
  feature: 'courses' | 'videos' | 'quizzes'
): Promise<void> {
  try {
    const fieldMap = {
      courses: 'coursesCreatedThisMonth',
      videos: 'videosCreatedThisMonth',
      quizzes: 'quizzesCreatedThisMonth',
    };

    const field = fieldMap[feature];

    await prisma.user.update({
      where: { id: userId },
      data: {
        [field]: {
          increment: 1,
        },
      },
    });

    logger.info('Usage counter incremented', { userId, feature });
  } catch (error) {
    logger.error('Error incrementing usage counter', error as Error, { userId, feature });
    // Don't throw error - we don't want to fail the request if tracking fails
  }
}
