import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      logger.warn("Unauthorized account deletion attempt");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password, confirmation } = body;

    if (!password || confirmation !== "DELETE") {
      return NextResponse.json(
        { error: "Password and confirmation required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || !user.password) {
      logger.warn("User not found during account deletion", { userId: session.user.id });
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      logger.warn("Incorrect password for account deletion", { userId: user.id });
      return NextResponse.json(
        { error: "Password is incorrect" },
        { status: 400 }
      );
    }

    // Delete user (cascade will delete related records)
    await prisma.user.delete({
      where: { id: user.id }
    });

    logger.info("Account deleted successfully", { 
      userId: user.id, 
      email: user.email 
    });

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error deleting account", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
