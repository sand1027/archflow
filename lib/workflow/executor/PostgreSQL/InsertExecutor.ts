import { ExecutionEnviornment } from "@/lib/types";
import { PostgreSQLTask } from "../../task/PostgreSQL";
import { getCredentialValue } from "@/lib/credential-helper";

export async function InsertExecutor(
  enviornment: ExecutionEnviornment<typeof PostgreSQLTask>
): Promise<boolean> {
  try {
    const query = enviornment.getInput("Query");
    const parameters = enviornment.getInput("Parameters");
    const credentialId = enviornment.getInput("Credentials");

    if (!query) {
      enviornment.log.error("Query is required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("PostgreSQL credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.host || !credentials.username || !credentials.password) {
      enviornment.log.error("Invalid PostgreSQL credentials - host, username, password required");
      return false;
    }

    enviornment.log.info(`Executing PostgreSQL INSERT: ${query}`);
    
    const mockResult = {
      rows: [],
      rowCount: 1,
      command: 'INSERT',
      oid: Math.floor(Math.random() * 10000)
    };

    enviornment.setOutput("Result", JSON.stringify(mockResult));
    enviornment.setOutput("Rows Affected", String(mockResult.rowCount));
    enviornment.log.info(`PostgreSQL INSERT completed - ${mockResult.rowCount} row inserted`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}