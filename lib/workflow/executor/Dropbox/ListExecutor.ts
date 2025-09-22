import { ExecutionEnviornment } from "@/lib/types";
import { DropboxTask } from "../../task/Dropbox";
import { getCredentialValue } from "@/lib/credential-helper";

export async function ListExecutor(
  enviornment: ExecutionEnviornment<typeof DropboxTask>
): Promise<boolean> {
  try {
    const path = enviornment.getInput("Path") || "";
    const credentialId = enviornment.getInput("Credentials");

    if (!credentialId) {
      enviornment.log.error("Dropbox credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Dropbox credentials");
      return false;
    }

    const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: path.startsWith('/') ? path : `/${path}` || "",
        recursive: false,
        include_media_info: false,
        include_deleted: false,
        include_has_explicit_shared_members: false
      })
    });

    if (!response.ok) {
      throw new Error(`Dropbox list failed: ${response.statusText}`);
    }

    const result = await response.json();
    const files = result.entries.map((entry: any) => ({
      name: entry.name,
      path: entry.path_display,
      type: entry['.tag']
    }));

    enviornment.setOutput("Files", JSON.stringify(files));
    enviornment.log.info(`Listed ${files.length} items in Dropbox folder`);

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}