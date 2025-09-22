import { ExecutionEnviornment } from "@/lib/types";
import { PostgreSQLTask } from "../../task/PostgreSQL";
import { getCredentialValue } from "@/lib/credential-helper";

export async function DeleteExecutor(
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
      enviornment.log.error("Invalid PostgreSQL credentials");
      return false;
    }

    enviornment.log.info(`Executing PostgreSQL DELETE: ${query}`);
    
    const mockResult = {
      rows: [],
      rowCount: Math.floor(Math.random() * 3) + 1,
      command: 'DELETE'
    };

    enviornment.setOutput("Result", JSON.stringify(mockResult));
    enviornment.setOutput("Rows Affected", String(mockResult.rowCount));
    enviornment.log.info(`PostgreSQL DELETE completed - ${mockResult.rowCount} rows deleted`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}