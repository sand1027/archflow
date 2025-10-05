const { MongoClient } = require('mongodb');

async function fixChatSessions() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('chatmessages');
    
    // Find all messages with undefined sessionId
    const messagesWithoutSession = await collection.find({ 
      sessionId: { $in: [null, undefined] } 
    }).toArray();
    
    console.log(`Found ${messagesWithoutSession.length} messages without sessionId`);
    
    // Group messages by workflowId and date
    const messagesByWorkflowAndDate = {};
    
    messagesWithoutSession.forEach(msg => {
      const date = new Date(msg.timestamp);
      const dateStr = date.toISOString().split('T')[0];
      const hourStr = String(date.getHours()).padStart(2, '0');
      const sessionId = `${msg.workflowId}-${dateStr}-${hourStr}h`;
      
      if (!messagesByWorkflowAndDate[sessionId]) {
        messagesByWorkflowAndDate[sessionId] = [];
      }
      messagesByWorkflowAndDate[sessionId].push(msg._id);
    });
    
    // Update messages with proper sessionId
    for (const [sessionId, messageIds] of Object.entries(messagesByWorkflowAndDate)) {
      const result = await collection.updateMany(
        { _id: { $in: messageIds } },
        { $set: { sessionId } }
      );
      console.log(`Updated ${result.modifiedCount} messages with sessionId: ${sessionId}`);
    }
    
    console.log('✅ Chat session fix completed');
    
  } catch (error) {
    console.error('❌ Error fixing chat sessions:', error);
  } finally {
    await client.close();
  }
}

fixChatSessions();