import { ActiveUser } from "@/schema/activeUser";
import connectDB from "@/lib/mongodb";

// Global SSE connections store (still needed for real-time broadcasting)
const connections = new Map<string, Set<ReadableStreamDefaultController>>();

export async function addConnection(workflowId: string, controller: ReadableStreamDefaultController, user: any) {
  if (!connections.has(workflowId)) {
    connections.set(workflowId, new Set());
    console.log(`🆕 Created new connection set for workflow: ${workflowId}`);
  }
  connections.get(workflowId)!.add(controller);
  
  const totalConnections = connections.get(workflowId)!.size;
  console.log(`🔗 Added connection for ${user.name} (${user.id}). Total connections for ${workflowId}: ${totalConnections}`);
  
  // Store user in database
  await connectDB();
  await ActiveUser.findOneAndUpdate(
    { workflowId, userId: user.id },
    { workflowId, userId: user.id, name: user.name, email: user.email, lastSeen: new Date() },
    { upsert: true }
  );
  
  // Send current active users to new connection
  const activeUsers = await ActiveUser.find({ workflowId });
  console.log(`👥 Active users in DB for ${workflowId}:`, activeUsers.map(u => `${u.name} (${u.userId})`));
  
  const usersListEvent = {
    type: 'users-list',
    users: activeUsers.map(u => ({
      id: u.userId,
      name: u.name,
      email: u.email,
      isOnline: true,
      lastSeen: u.lastSeen
    }))
  };
  
  console.log(`📡 Sending users-list to new connection:`, usersListEvent.users.length, 'users');
  
  try {
    controller.enqueue(`data: ${JSON.stringify(usersListEvent)}\n\n`);
  } catch (error) {
    console.error('Failed to send users-list to new connection:', error);
  }
}

export async function removeConnection(workflowId: string, controller: ReadableStreamDefaultController, userId: string) {
  const workflowConnections = connections.get(workflowId);
  if (workflowConnections) {
    workflowConnections.delete(controller);
    const remainingConnections = workflowConnections.size;
    console.log(`🔌 Removed connection for user ${userId}. Remaining connections for ${workflowId}: ${remainingConnections}`);
    
    if (workflowConnections.size === 0) {
      connections.delete(workflowId);
      console.log(`🗑️ Deleted connection set for workflow: ${workflowId}`);
    }
  }
  
  // Remove user from database
  await connectDB();
  const deleteResult = await ActiveUser.deleteOne({ workflowId, userId });
  console.log(`🗑️ Removed user ${userId} from DB. Deleted count: ${deleteResult.deletedCount}`);
}

export function broadcastToWorkflow(workflowId: string, event: any) {
  const workflowConnections = connections.get(workflowId);
  if (!workflowConnections) {
    console.log(`⚠️ No connections found for workflow ${workflowId} to broadcast:`, event.type);
    return;
  }

  const message = `data: ${JSON.stringify(event)}\n\n`;
  const connectionCount = workflowConnections.size;
  console.log(`📡 Broadcasting ${event.type} to ${connectionCount} connections in workflow ${workflowId}`);
  
  let successCount = 0;
  let failCount = 0;
  
  Array.from(workflowConnections).forEach(controller => {
    try {
      controller.enqueue(message);
      successCount++;
    } catch (error) {
      console.error(`Failed to send to connection:`, error instanceof Error ? error.message : 'Unknown error');
      workflowConnections.delete(controller);
      failCount++;
    }
  });
  
  console.log(`📡 Broadcast complete: ${successCount} success, ${failCount} failed`);
}

export async function getActiveUsers(workflowId: string) {
  await connectDB();
  const activeUsers = await ActiveUser.find({ workflowId });
  return activeUsers.map(u => ({
    id: u.userId,
    name: u.name,
    email: u.email,
    isOnline: true,
    lastSeen: u.lastSeen
  }));
}