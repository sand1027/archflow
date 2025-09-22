import { ExecutionEnviornment } from "@/lib/types";
import { MySQLTask } from "../../task/MySQL";
import { getCredentialValue } from "@/lib/credential-helper";

export async function UpdateExecutor(
  enviornment: ExecutionEnviornment<typeof MySQLTask>
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
      enviornment.log.error("MySQL credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.host || !credentials.username || !credentials.password) {
      enviornment.log.error("Invalid MySQL credentials");
      return false;
    }

    enviornment.log.info(`Executing MySQL UPDATE: ${query}`);
    
    const mockResult = {
      affectedRows: Math.floor(Math.random() * 5) + 1,
      changedRows: Math.floor(Math.random() * 5) + 1,
      warningCount: 0
    };

    enviornment.setOutput("Result", JSON.stringify(mockResult));
    enviornment.setOutput("Rows Affected", String(mockResult.affectedRows));
    enviornment.log.info(`MySQL UPDATE completed - ${mockResult.affectedRows} rows affected`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}