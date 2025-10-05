import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addConnection, removeConnection, broadcastToWorkflow, getActiveUsers } from "@/lib/sse-connections";

export async function GET(
  request: NextRequest,
  { params }: { params: { workflowId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const workflowId = params.workflowId;
  
  let streamController: ReadableStreamDefaultController;
  
  const stream = new ReadableStream({
    start(controller) {
      streamController = controller;
      
      const user = {
        id: session.user.id || "anonymous",
        name: session.user.name || "User",
        email: session.user.email || "",
        isOnline: true,
        lastSeen: new Date(),
      };
      
      console.log(`🔗 SSE Connection started for user: ${user.name} (${user.id}) in workflow: ${workflowId}`);
      
      addConnection(workflowId, controller, user);

      const joinEvent = {
        type: 'user-joined',
        user
      };
      
      console.log(`📡 Broadcasting user-joined event:`, joinEvent);
      controller.enqueue(`data: ${JSON.stringify(joinEvent)}\n\n`);
      broadcastToWorkflow(workflowId, joinEvent);
    },
    
    cancel() {
      const userId = session.user.id || "anonymous";
      console.log(`🔌 SSE Connection closed for user: ${session.user.name} (${userId}) in workflow: ${workflowId}`);
      
      if (streamController) {
        removeConnection(workflowId, streamController, userId);
      }
      
      const leaveEvent = {
        type: 'user-left',
        userId
      };
      
      console.log(`📡 Broadcasting user-left event:`, leaveEvent);
      broadcastToWorkflow(workflowId, leaveEvent);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

