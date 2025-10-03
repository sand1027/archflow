import { ExecutionEnviornment } from "@/lib/types";
import { MongoDBTask } from "../../task/MongoDB";
import { getCredentialValue } from "@/lib/credential-helper";
import { MongoClient } from "mongodb";

export async function DeleteExecutor(
  enviornment: ExecutionEnviornment<typeof MongoDBTask>
): Promise<boolean> {
  let client: MongoClient | null = null;
  
  try {
    const collection = enviornment.getInput("Collection");
    const query = enviornment.getInput("Query");
    const credentialId = enviornment.getInput("Credentials");

    if (!collection || !query) {
      enviornment.log.error("❌ Collection and Query are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("❌ MongoDB credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.connection_string) {
      enviornment.log.error("❌ Invalid MongoDB credentials");
      return false;
    }

    enviornment.log.info("🗑️ Deleting MongoDB documents...");
    client = new MongoClient(credentials.connection_string);
    await client.connect();
    const db = client.db();
    const coll = db.collection(collection);

    const queryObj = JSON.parse(query);
    
    // Add user filter for security - CRITICAL for delete operations
    if (!queryObj.userId && enviornment.userId) {
      queryObj.userId = enviornment.userId;
      enviornment.log.info("🔒 Added user filter for security (CRITICAL for delete)");
    }
    
    // Safety check - prevent accidental mass deletion
    if (Object.keys(queryObj).length === 0 || (Object.keys(queryObj).length === 1 && queryObj.userId)) {
      enviornment.log.error("🚨 SAFETY CHECK: Query too broad, refusing to delete all documents");
      return false;
    }
    
    enviornment.log.info(`🔍 Delete Query: ${JSON.stringify(queryObj, null, 2)}`);
    
    // First, count what will be deleted
    const countToDelete = await coll.countDocuments(queryObj);
    
    if (countToDelete === 0) {
      enviornment.log.info("🚨 No documents found matching the query");
      enviornment.setOutput("Result", JSON.stringify({ deletedCount: 0 }));
      enviornment.setOutput("Count", "0");
      return true;
    }
    
    enviornment.log.info(`⚠️ About to delete ${countToDelete} documents`);
    
    // Perform soft delete by default (add deletedAt field instead of actual deletion)
    const softDeleteResult = await coll.updateMany(queryObj, {
      $set: {
        deletedAt: new Date(),
        deletedBy: enviornment.userId,
        isDeleted: true
      }
    });
    
    enviornment.setOutput("Result", JSON.stringify({
      deletedCount: softDeleteResult.modifiedCount,
      method: "soft_delete",
      acknowledged: softDeleteResult.acknowledged
    }));
    enviornment.setOutput("Count", String(softDeleteResult.modifiedCount));
    
    enviornment.log.info(`✅ Soft deleted ${softDeleteResult.modifiedCount} documents`);
    enviornment.log.info("💡 Documents marked as deleted (soft delete) - can be recovered");

    return true;
  } catch (error: any) {
    enviornment.log.error(`❌ MongoDB Delete Error: ${error.message}`);
    return false;
  } finally {
    if (client) {
      await client.close();
      enviornment.log.info("🔌 MongoDB connection closed");
    }
  }
}