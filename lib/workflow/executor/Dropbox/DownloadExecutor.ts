import { ExecutionEnviornment } from "@/lib/types";
import { DropboxTask } from "../../task/Dropbox";
import { getCredentialValue } from "@/lib/credential-helper";

export async function DownloadExecutor(
  enviornment: ExecutionEnviornment<typeof DropboxTask>
): Promise<boolean> {
  try {
    const path = enviornment.getInput("Path");
    const credentialId = enviornment.getInput("Credentials");

    if (!path) {
      enviornment.log.error("Path is required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Dropbox credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Dropbox credentials");
      return false;
    }

    const response = await fetch('https://content.dropboxapi.com/2/files/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Dropbox-API-Arg': JSON.stringify({
          path: path.startsWith('/') ? path : `/${path}`
        })
      }
    });

    if (!response.ok) {
      throw new Error(`Dropbox download failed: ${response.statusText}`);
    }

    const content = await response.text();
    enviornment.setOutput("Content", content);
    enviornment.setOutput("URL", `https://dropbox.com/home${path}`);
    enviornment.log.info(`File downloaded from Dropbox: ${path}`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}