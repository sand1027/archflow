import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { broadcastToWorkflow } from "@/lib/sse-connections";

export async function POST(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const workflowId = params.workflowId;

  const event = body;

  // Broadcast to ALL users including sender
  broadcastToWorkflow(workflowId, event);
  
  return NextResponse.json({ success: true });
}