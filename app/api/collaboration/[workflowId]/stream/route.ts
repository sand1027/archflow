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
      
      addConnection(workflowId, controller, user);

      const joinEvent = {
        type: 'user-joined',
        user
      };
      
      controller.enqueue(`data: ${JSON.stringify(joinEvent)}\n\n`);
      broadcastToWorkflow(workflowId, joinEvent);
    },
    
    cancel() {
      if (streamController) {
        removeConnection(workflowId, streamController, session.user.id || "anonymous");
      }
      
      broadcastToWorkflow(workflowId, {
        type: 'user-left',
        userId: session.user.id || "anonymous"
      });
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

