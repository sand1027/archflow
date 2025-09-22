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
    const query = enviornment.getInput("Query");
    const credentialId = enviornment.getInput("Credentials");

    if (!collection) {
      enviornment.log.error("Collection is required");
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

    const findQuery = query ? JSON.parse(query) : {};
    const result = await coll.find(findQuery).limit(100).toArray();
    
    enviornment.setOutput("Result", JSON.stringify(result));
    enviornment.setOutput("Count", String(result.length));
    enviornment.log.info(`Found ${result.length} documents`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  } finally {
    if (client) await client.close();
  }
}