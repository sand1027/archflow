import { NextRequest } from "next/server";
import { ChatMessage } from "@/schema/collaboration";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest, { params }: { params: { workflowId: string } }) {
  const { workflowId } = params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const chatId = searchParams.get('chatId');
  
  await connectDB();
  
  let query: any = { workflowId };
  
  if (type === 'private' && chatId) {
    query.chatId = chatId;
    query.isPrivate = true;
  } else if (type === 'team') {
    query.isPrivate = { $ne: true };
  } else {
    // Default: only team messages
    query.isPrivate = { $ne: true };
  }
  
  console.log('🔍 Loading messages with query:', query);
  
  const messages = await ChatMessage.find(query)
    .sort({ timestamp: 1 })
    .limit(50)
    .lean();
  
  console.log(`💬 Found ${messages.length} messages for ${type || 'team'} chat`);
  
  return Response.json(messages);
}

export async function POST(request: NextRequest, { params }: { params: { workflowId: string } }) {
  const { workflowId } = params;
  const body = await request.json();
  
  await connectDB();
  
  try {
    const { message, isPrivate, chatId, targetUserId } = body;
    
    console.log('💾 Saving message:', {
      messageId: message.id,
      workflowId,
      isPrivate,
      chatId,
      targetUserId
    });
    
    const chatMessage = new ChatMessage({
      id: message.id,
      userId: message.userId,
      message: message.message,
      timestamp: message.timestamp,
      type: message.type || 'text',
      workflowId,
      isPrivate: isPrivate || false,
      chatId: chatId || `team-${workflowId}`,
      targetUserId: isPrivate ? targetUserId : undefined,
      sessionId: chatId || `team-${workflowId}`
    });
    
    const savedMessage = await chatMessage.save();
    console.log('✅ Message saved successfully:', savedMessage._id);
    
    return Response.json({ success: true, message: savedMessage });
    
  } catch (error) {
    console.error('❌ Error saving message:', error);
    return Response.json({ error: 'Failed to save message' }, { status: 500 });
  }
}