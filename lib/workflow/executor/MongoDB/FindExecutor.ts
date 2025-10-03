import { ExecutionEnviornment } from "@/lib/types";
import { MongoDBTask } from "../../task/MongoDB";
import { getCredentialValue } from "@/lib/credential-helper";
import { MongoClient } from "mongodb";

export async function FindExecutor(
  enviornment: ExecutionEnviornment<typeof MongoDBTask>
): Promise<boolean> {
  let client: MongoClient | null = null;
  
  try {
    const collection = enviornment.getInput("Collection");
    const query = enviornment.getInput("Query") || "{}";
    const credentialId = enviornment.getInput("Credentials");

    if (!collection) {
      enviornment.log.error("❌ Collection name is required");
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

    enviornment.log.info("🔍 Searching MongoDB documents...");
    client = new MongoClient(credentials.connection_string);
    await client.connect();
    const db = client.db();
    const coll = db.collection(collection);

    const queryObj = JSON.parse(query);
    
    // Enhanced query with common scenarios
    const options = {
      limit: 100, // Prevent overwhelming results
      sort: { createdAt: -1 as const } // Latest first
    };
    
    // Add user filter for security
    if (!queryObj.userId && enviornment.userId) {
      queryObj.userId = enviornment.userId;
      enviornment.log.info("🔒 Added user filter for security");
    }
    
    enviornment.log.info(`🔍 Query: ${JSON.stringify(queryObj, null, 2)}`);
    
    const results = await coll.find(queryObj, options).toArray();
    
    // Format results for better readability
    const formattedResults = results.map(doc => ({
      ...doc,
      _id: doc._id.toString(), // Convert ObjectId to string
      createdAt: doc.createdAt?.toISOString() || null
    }));
    
    enviornment.setOutput("Result", JSON.stringify(formattedResults, null, 2));
    enviornment.setOutput("Count", String(results.length));
    
    if (results.length === 0) {
      enviornment.log.info("🚨 No documents found matching the query");
    } else {
      enviornment.log.info(`✅ Found ${results.length} documents`);
      enviornment.log.info(`📊 Sample result: ${JSON.stringify(formattedResults[0], null, 2)}`);
    }

    return true;
  } catch (error: any) {
    enviornment.log.error(`❌ MongoDB Find Error: ${error.message}`);
    return false;
  } finally {
    if (client) {
      await client.close();
      enviornment.log.info("🔌 MongoDB connection closed");
    }
  }
}