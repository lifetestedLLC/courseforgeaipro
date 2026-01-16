import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      logger.warn("Unauthorized access attempt to admin stats API");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!currentUser || currentUser.role !== 'admin') {
      logger.warn("Non-admin user attempted to access admin stats API", { 
        userId: session.user.id 
      });
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Fetch statistics
    const [
      totalUsers,
      totalCourses,
      totalVideos,
      totalQuizzes,
      adminUsers,
      activeSubscriptions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.video.count(),
      prisma.quiz.count(),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ 
        where: { 
          subscriptionStatus: 'active' 
        } 
      })
    ]);

    const stats = {
      totalUsers,
      totalCourses,
      totalVideos,
      totalQuizzes,
      adminUsers,
      activeSubscriptions
    };

    logger.info("Admin fetched system stats", { 
      adminId: session.user.id,
      stats 
    });

    return NextResponse.json(stats);
  } catch (error) {
    logger.error("Error fetching stats for admin", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
