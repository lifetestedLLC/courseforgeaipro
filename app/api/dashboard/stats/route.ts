import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      logger.warn("Unauthorized access attempt to dashboard stats API");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user's courses, videos, and quizzes counts
    const [coursesCount, videosCount, quizzesCount, recentCourses] = await Promise.all([
      prisma.course.count({
        where: { userId: session.user.id }
      }),
      prisma.video.count({
        where: { userId: session.user.id }
      }),
      prisma.quiz.count({
        where: { userId: session.user.id }
      }),
      prisma.course.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        }
      })
    ]);

    // Get monthly counts from user record
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        coursesCreatedThisMonth: true,
        videosCreatedThisMonth: true,
        quizzesCreatedThisMonth: true,
      }
    });

    logger.info("Dashboard stats retrieved", { userId: session.user.id });

    return NextResponse.json({
      stats: {
        totalCourses: coursesCount,
        totalVideos: videosCount,
        totalQuizzes: quizzesCount,
        coursesThisMonth: user?.coursesCreatedThisMonth || 0,
        videosThisMonth: user?.videosCreatedThisMonth || 0,
        quizzesThisMonth: user?.quizzesCreatedThisMonth || 0,
        // Placeholder for exports (not implemented yet)
        totalExports: 0,
        exportsThisMonth: 0,
      },
      recentCourses,
    });
  } catch (error) {
    logger.error("Error fetching dashboard stats", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
