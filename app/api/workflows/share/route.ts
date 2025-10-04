import { NextRequest, NextResponse } from "next/server";
import { WorkflowShare } from "@/schema/collaboration";
import connectDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    // Require authentication for creating shares
    const auth = await getCurrentUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const { workflowId, permissions, expiresIn } = await request.json();
    
    const shareToken = Math.random().toString(36).substring(2, 18);
    
    let expiresAt = null;
    if (expiresIn && expiresIn !== "never") {
      const now = new Date();
      switch (expiresIn) {
        case "1h":
          expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
          break;
        case "24h":
          expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case "7d":
          expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
      }
    }
    
    const share = await WorkflowShare.create({
      workflowId,
      shareToken,
      permissions: permissions || "edit",
      expiresAt,
      createdBy: auth.userId,
    });
    
    return NextResponse.json({ shareToken, expiresAt });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }
    
    const share = await WorkflowShare.findOne({ shareToken: token });
    
    if (!share) {
      return NextResponse.json({ error: "Invalid share link" }, { status: 404 });
    }
    
    if (share.expiresAt && new Date() > share.expiresAt) {
      return NextResponse.json({ error: "Share link expired" }, { status: 410 });
    }
    
    return NextResponse.json({
      workflowId: share.workflowId,
      permissions: share.permissions,
      expiresAt: share.expiresAt,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to validate share link" }, { status: 500 });
  }
}