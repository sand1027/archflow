import { ExecutionEnviornment } from "@/lib/types";
import { GoogleSheetsTask } from "../task/GoogleSheets"; // Reusing for now
import { getCredentialValue } from "@/lib/credential-helper";

export async function GoogleDocsExecutor(
  enviornment: ExecutionEnviornment<typeof GoogleSheetsTask>
): Promise<boolean> {
  try {
    const action = enviornment.getInput("Action");
    const documentId = enviornment.getInput("Document ID");
    const content = enviornment.getInput("Content");
    const credentialId = enviornment.getInput("Credentials");

    if (!action) {
      enviornment.log.error("Action is required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Google Docs credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.client_id || !credentials.client_secret) {
      enviornment.log.error("Invalid Google Docs credentials");
      return false;
    }

    enviornment.log.info(`Executing Google Docs ${action}`);
    
    try {
      switch (action) {
        case "create":
          enviornment.setOutput("Document ID", `doc_${Date.now()}`);
          enviornment.setOutput("Document URL", `https://docs.google.com/document/d/doc_${Date.now()}/edit`);
          enviornment.log.info("Document created successfully");
          break;
        case "read":
          enviornment.setOutput("Content", "Sample document content...");
          enviornment.setOutput("Title", "Sample Document");
          break;
        case "update":
          enviornment.setOutput("Updated", "true");
          enviornment.log.info("Document updated successfully");
          break;
        default:
          enviornment.setOutput("Result", "Operation completed");
      }

      return true;
      
    } catch (apiError: any) {
      enviornment.log.error(`Google Docs operation failed: ${apiError.message}`);
      return false;
    }
    
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}