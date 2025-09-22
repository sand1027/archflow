import { ExecutionEnviornment } from "@/lib/types";
import { MongoDBTask } from "../../task/MongoDB";
import { getCredentialValue } from "@/lib/credential-helper";
import { MongoClient } from "mongodb";

export async function QueryExecutor(
  enviornment: ExecutionEnviornment<typeof MongoDBTask>
): Promise<boolean> {
  let client: MongoClient | null = null;
  
  try {
    const action = enviornment.getInput("Action");
    const collection = enviornment.getInput("Collection");
    const document = enviornment.getInput("Document");
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
      enviornment.log.error("Invalid MongoDB credentials - connection_string required");
      return false;
    }

    client = new MongoClient(credentials.connection_string);
    await client.connect();
    const db = client.db();
    const coll = db.collection(collection);

    let result;
    switch (action) {
      case "insert":
        if (!document) {
          enviornment.log.error("Document is required for insert operation");
          return false;
        }
        const doc = JSON.parse(document);
        result = await coll.insertOne({ ...doc, createdAt: new Date() });
        enviornment.setOutput("Result", JSON.stringify({ insertedId: result.insertedId, acknowledged: result.acknowledged }));
        enviornment.log.info(`Inserted document with ID: ${result.insertedId}`);
        break;
        
      case "find":
        const findQuery = query ? JSON.parse(query) : {};
        result = await coll.find(findQuery).limit(100).toArray();
        enviornment.setOutput("Result", JSON.stringify(result));
        enviornment.setOutput("Count", String(result.length));
        enviornment.log.info(`Found ${result.length} documents`);
        break;
        
      case "update":
        if (!query || !document) {
          enviornment.log.error("Both Query and Document are required for update operation");
          return false;
        }
        const updateQuery = JSON.parse(query);
        const updateDoc = JSON.parse(document);
        result = await coll.updateMany(updateQuery, { $set: { ...updateDoc, updatedAt: new Date() } });
        enviornment.setOutput("Result", JSON.stringify({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount }));
        enviornment.log.info(`Updated ${result.modifiedCount} documents`);
        break;
        
      case "delete":
        if (!query) {
          enviornment.log.error("Query is required for delete operation");
          return false;
        }
        const deleteQuery = JSON.parse(query);
        result = await coll.deleteMany(deleteQuery);
        enviornment.setOutput("Result", JSON.stringify({ deletedCount: result.deletedCount }));
        enviornment.log.info(`Deleted ${result.deletedCount} documents`);
        break;
        
      default:
        enviornment.log.error(`Unknown action: ${action}`);
        return false;
    }

    return true;
  } catch (error: any) {
    enviornment.log.error(`MongoDB operation failed: ${error.message}`);
    return false;
  } finally {
    if (client) {
      await client.close();
    }
  }
}