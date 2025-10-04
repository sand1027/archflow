import { NextRequest } from "next/server";
import { ChatMessage } from "@/schema/collaboration";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest, { params }: { params: { workflowId: string } }) {
  const { workflowId } = params;
  
  await connectDB();
  
  const messages = await ChatMessage.find({ workflowId })
    .sort({ timestamp: 1 })
    .limit(50)
    .lean();
  
  return Response.json(messages);
}