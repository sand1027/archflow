import { ExecutionEnviornment } from "@/lib/types";
import { OneDriveTask } from "../../task/OneDrive";
import { getCredentialValue } from "@/lib/credential-helper";

export async function StorageExecutor(
  enviornment: ExecutionEnviornment<typeof OneDriveTask>
): Promise<boolean> {
  try {
    const action = enviornment.getInput("Action");
    const path = enviornment.getInput("Path");
    const content = enviornment.getInput("Content");
    const credentialId = enviornment.getInput("Credentials");

    if (!path) {
      enviornment.log.error("Path is required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("OneDrive credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials) {
      enviornment.log.error("Invalid OneDrive credentials");
      return false;
    }

    enviornment.log.info(`Executing OneDrive ${action} on path ${path}`);
    
    // Mock OneDrive operations for now
    switch (action) {
      case "upload":
        enviornment.setOutput("URL", `https://onedrive.live.com/redir?resid=${path}`);
        enviornment.log.info(`File uploaded to OneDrive: ${path}`);
        break;
      case "download":
        enviornment.setOutput("Content", "Mock file content");
        enviornment.log.info(`File downloaded from OneDrive: ${path}`);
        break;
      case "delete":
        enviornment.log.info(`File deleted from OneDrive: ${path}`);
        break;
      case "list":
        enviornment.setOutput("Files", JSON.stringify([{name: "file1.txt"}, {name: "file2.txt"}]));
        enviornment.log.info(`Listed files in OneDrive`);
        break;
    }

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}