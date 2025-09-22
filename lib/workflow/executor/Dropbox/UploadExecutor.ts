import { ExecutionEnviornment } from "@/lib/types";
import { DropboxTask } from "../../task/Dropbox";
import { getCredentialValue } from "@/lib/credential-helper";

export async function UploadExecutor(
  enviornment: ExecutionEnviornment<typeof DropboxTask>
): Promise<boolean> {
  try {
    const path = enviornment.getInput("Path");
    const content = enviornment.getInput("Content");
    const credentialId = enviornment.getInput("Credentials");

    if (!path || !content) {
      enviornment.log.error("Path and Content are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Dropbox credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Dropbox credentials - access_token required");
      return false;
    }

    const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: path.startsWith('/') ? path : `/${path}`,
          mode: 'add',
          autorename: true
        })
      },
      body: content
    });

    if (!response.ok) {
      throw new Error(`Dropbox upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    enviornment.setOutput("URL", `https://dropbox.com/home${result.path_display}`);
    enviornment.log.info(`File uploaded to Dropbox: ${result.path_display}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}