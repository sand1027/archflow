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
      enviornment.log.error("Collection and Query are required");
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

    const deleteQuery = JSON.parse(query);
    const result = await coll.deleteMany(deleteQuery);
    
    enviornment.setOutput("Result", JSON.stringify({ deletedCount: result.deletedCount }));
    enviornment.log.info(`Deleted ${result.deletedCount} documents`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  } finally {
    if (client) await client.close();
  }
}