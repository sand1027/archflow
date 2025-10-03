import { ExecutionEnviornment } from "@/lib/types";
import { MongoDBTask } from "../../task/MongoDB";
import { getCredentialValue } from "@/lib/credential-helper";
import { MongoClient } from "mongodb";

export async function UpdateExecutor(
  enviornment: ExecutionEnviornment<typeof MongoDBTask>
): Promise<boolean> {
  let client: MongoClient | null = null;
  
  try {
    const collection = enviornment.getInput("Collection");
    const query = enviornment.getInput("Query");
    const document = enviornment.getInput("Document");
    const credentialId = enviornment.getInput("Credentials");

    if (!collection || !query || !document) {
      enviornment.log.error("❌ Collection, Query, and Document are required");
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

    enviornment.log.info("🔄 Updating MongoDB documents...");
    client = new MongoClient(credentials.connection_string);
    await client.connect();
    const db = client.db();
    const coll = db.collection(collection);

    const queryObj = JSON.parse(query);
    const updateDoc = JSON.parse(document);
    
    // Add user filter for security
    if (!queryObj.userId && enviornment.userId) {
      queryObj.userId = enviornment.userId;
      enviornment.log.info("🔒 Added user filter for security");
    }
    
    // Add metadata to update
    const updateOperation = {
      $set: {
        ...updateDoc,
        updatedAt: new Date(),
        updatedBy: enviornment.userId
      }
    };
    
    enviornment.log.info(`🔍 Update Query: ${JSON.stringify(queryObj, null, 2)}`);
    enviornment.log.info(`📝 Update Data: ${JSON.stringify(updateOperation, null, 2)}`);
    
    const result = await coll.updateMany(queryObj, updateOperation);
    
    enviornment.setOutput("Result", JSON.stringify({
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      acknowledged: result.acknowledged
    }));
    enviornment.setOutput("Count", String(result.modifiedCount));
    
    if (result.matchedCount === 0) {
      enviornment.log.info("🚨 No documents matched the query");
    } else if (result.modifiedCount === 0) {
      enviornment.log.info("⚠️ Documents matched but no changes were made");
    } else {
      enviornment.log.info(`✅ Updated ${result.modifiedCount} out of ${result.matchedCount} documents`);
    }

    return true;
  } catch (error: any) {
    enviornment.log.error(`❌ MongoDB Update Error: ${error.message}`);
    return false;
  } finally {
    if (client) {
      await client.close();
      enviornment.log.info("🔌 MongoDB connection closed");
    }
  }
}