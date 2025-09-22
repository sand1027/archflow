import { ExecutionEnviornment } from "@/lib/types";
import { MongoDBTask } from "../../task/MongoDB";
import { getCredentialValue } from "@/lib/credential-helper";
import { MongoClient } from "mongodb";

export async function InsertExecutor(
  enviornment: ExecutionEnviornment<typeof MongoDBTask>
): Promise<boolean> {
  let client: MongoClient | null = null;
  
  try {
    const collection = enviornment.getInput("Collection");
    const document = enviornment.getInput("Document");
    const credentialId = enviornment.getInput("Credentials");

    if (!collection || !document) {
      enviornment.log.error("Collection and Document are required");
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

    const doc = JSON.parse(document);
    const result = await coll.insertOne({ ...doc, createdAt: new Date() });
    
    enviornment.setOutput("Result", JSON.stringify({ insertedId: result.insertedId }));
    enviornment.log.info(`Document inserted with ID: ${result.insertedId}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  } finally {
    if (client) await client.close();
  }
}