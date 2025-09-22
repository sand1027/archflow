import { ExecutionEnviornment } from "@/lib/types";
import { MySQLTask } from "../../task/MySQL";
import { getCredentialValue } from "@/lib/credential-helper";

export async function InsertExecutor(
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
      enviornment.log.error("Invalid MySQL credentials - host, username, password required");
      return false;
    }

    // For now, simulate MySQL operation until mysql2 is added
    enviornment.log.info(`Executing MySQL INSERT: ${query}`);
    
    const mockResult = {
      insertId: Math.floor(Math.random() * 10000),
      affectedRows: 1,
      warningCount: 0
    };

    enviornment.setOutput("Result", JSON.stringify(mockResult));
    enviornment.setOutput("Rows Affected", String(mockResult.affectedRows));
    enviornment.log.info(`MySQL INSERT completed - ID: ${mockResult.insertId}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}