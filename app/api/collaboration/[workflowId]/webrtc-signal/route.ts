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

  const signal = await request.json();
  const workflowId = params.workflowId;
  
  console.log(`🔄 WebRTC Signal received:`, {
    type: signal.type,
    from: signal.fromUserId,
    to: signal.targetUserId,
    workflow: workflowId
  });

  const signalEvent = {
    type: 'webrtc-signal',
    signal
  };

  broadcastToWorkflow(workflowId, signalEvent);
  
  return NextResponse.json({ success: true });
}