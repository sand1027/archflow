import { NextRequest } from "next/server";
import { ChatMessage } from "@/schema/collaboration";
import connectDB from "@/lib/mongodb";

const connections = new Map<string, Set<any>>();

export async function POST(request: NextRequest, { params }: { params: { workflowId: string } }) {
  const { workflowId } = params;
  const { message } = await request.json();
  
  await connectDB();
  
  await ChatMessage.create({
    workflowId,
    userId: message.userId,
    message: message.message,
    timestamp: new Date(message.timestamp),
    type: message.type || 'text'
  });
  
  return new Response('OK');
}