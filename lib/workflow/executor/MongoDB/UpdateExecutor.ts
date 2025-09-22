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
      enviornment.log.error("Collection, Query, and Document are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("MongoDB credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.connection_string) {
      enviornment.log.error("Invalid MongoDB credentials");
      return false;
    }

    client = new MongoClient(credentials.connection_string);
    await client.connect();
    const db = client.db();
    const coll = db.collection(collection);

    const updateQuery = JSON.parse(query);
    const updateDoc = JSON.parse(document);
    const result = await coll.updateMany(updateQuery, { $set: { ...updateDoc, updatedAt: new Date() } });
    
    enviornment.setOutput("Result", JSON.stringify({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }));
    enviornment.log.info(`Updated ${result.modifiedCount} documents`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  } finally {
    if (client) await client.close();
  }
}