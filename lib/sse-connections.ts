import { ActiveUser } from "@/schema/activeUser";
import connectDB from "@/lib/mongodb";

// Global SSE connections store (still needed for real-time broadcasting)
const connections = new Map<string, Set<ReadableStreamDefaultController>>();

export async function addConnection(workflowId: string, controller: ReadableStreamDefaultController, user: any) {
  if (!connections.has(workflowId)) {
    connections.set(workflowId, new Set());
  }
  connections.get(workflowId)!.add(controller);
  
  // Store user in database
  await connectDB();
  await ActiveUser.findOneAndUpdate(
    { workflowId, userId: user.id },
    { workflowId, userId: user.id, name: user.name, email: user.email, lastSeen: new Date() },
    { upsert: true }
  );
  
  // Send current active users to new connection
  const activeUsers = await ActiveUser.find({ workflowId });
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
  
  try {
    controller.enqueue(`data: ${JSON.stringify(usersListEvent)}\n\n`);
  } catch (error) {
    // Ignore failed sends
  }
}

export async function removeConnection(workflowId: string, controller: ReadableStreamDefaultController, userId: string) {
  const workflowConnections = connections.get(workflowId);
  if (workflowConnections) {
    workflowConnections.delete(controller);
    if (workflowConnections.size === 0) {
      connections.delete(workflowId);
    }
  }
  
  // Remove user from database
  await connectDB();
  await ActiveUser.deleteOne({ workflowId, userId });
}

export function broadcastToWorkflow(workflowId: string, event: any) {
  const workflowConnections = connections.get(workflowId);
  if (!workflowConnections) {
    return;
  }

  const message = `data: ${JSON.stringify(event)}\n\n`;
  
  Array.from(workflowConnections).forEach(controller => {
    try {
      controller.enqueue(message);
    } catch (error) {
      workflowConnections.delete(controller);
    }
  });
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