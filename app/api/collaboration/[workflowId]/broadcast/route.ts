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

  const { message } = await request.json();
  const workflowId = params.workflowId;

  const messageEvent = {
    type: 'new-message',
    message: {
      ...message,
      userId: session.user.id || "anonymous",
      timestamp: new Date(),
    }
  };

  // Broadcast to ALL users including sender
  broadcastToWorkflow(workflowId, messageEvent);
  
  return NextResponse.json({ success: true });
}