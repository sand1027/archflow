import { NextRequest } from "next/server";
import { ChatMessage } from "@/schema/collaboration";
import connectDB from "@/lib/mongodb";

const rooms = new Map<string, Set<any>>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get('workflowId');
  const userId = searchParams.get('userId');
  
  if (!workflowId || !userId) {
    return new Response('Missing workflowId or userId', { status: 400 });
  }

  return new Response('WebSocket endpoint ready', { status: 200 });
}