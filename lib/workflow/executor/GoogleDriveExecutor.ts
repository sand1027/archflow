import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { getCredentialValue } from "@/lib/credential-helper";

export async function GoogleDriveExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.GOOGLE_DRIVE }>
): Promise<boolean> {
  try {
    const action = enviornment.getInput("Action");
    const fileId = enviornment.getInput("File ID");
    const fileName = enviornment.getInput("File Name");
    const fileContent = enviornment.getInput("File Content");
    const folderId = enviornment.getInput("Folder ID");
    const credentialId = enviornment.getInput("Credentials");

    if (!action) {
      enviornment.log.error("Action is required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Google Drive credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Google Drive credentials - access token required");
      return false;
    }

    enviornment.log.info(`Executing Google Drive ${action}`);

    try {
      const accessToken = credentials.access_token;
      const baseUrl = 'https://www.googleapis.com/drive/v3';

      switch (action) {
        case "list":
          const listResponse = await fetch(`${baseUrl}/files?pageSize=10${folderId ? `&q='${folderId}'+in+parents` : ''}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (!listResponse.ok) {
            throw new Error(`Google Drive API error: ${listResponse.statusText}`);
          }

          const listData = await listResponse.json();
          enviornment.setOutput("Files", JSON.stringify(listData.files || []));
          enviornment.log.info(`Found ${listData.files?.length || 0} files`);
          break;

        case "upload":
          if (!fileName || !fileContent) {
            enviornment.log.error("File Name and File Content are required for upload");
            return false;
          }

          const metadata = {
            name: fileName,
            ...(folderId && { parents: [folderId] })
          };

          const uploadResponse = await fetch(`${baseUrl}/files?uploadType=multipart`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/related; boundary="foo_bar_baz"',
            },
            body: [
              '--foo_bar_baz',
              'Content-Type: application/json',
              '',
              JSON.stringify(metadata),
              '--foo_bar_baz',
              'Content-Type: text/plain',
              '',
              fileContent,
              '--foo_bar_baz--'
            ].join('\r\n'),
          });

          if (!uploadResponse.ok) {
            throw new Error(`Google Drive API error: ${uploadResponse.statusText}`);
          }

          const uploadData = await uploadResponse.json();
          enviornment.setOutput("File ID", uploadData.id);
          enviornment.setOutput("File URL", `https://drive.google.com/file/d/${uploadData.id}/view`);
          enviornment.log.info(`File uploaded: ${fileName}`);
          break;

        case "download":
          if (!fileId) {
            enviornment.log.error("File ID is required for download");
            return false;
          }

          const downloadResponse = await fetch(`${baseUrl}/files/${fileId}?alt=media`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (!downloadResponse.ok) {
            throw new Error(`Google Drive API error: ${downloadResponse.statusText}`);
          }

          const content = await downloadResponse.text();
          enviornment.setOutput("Content", content);
          enviornment.setOutput("File ID", fileId);
          enviornment.log.info(`File downloaded: ${fileId}`);
          break;

        case "delete":
          if (!fileId) {
            enviornment.log.error("File ID is required for delete");
            return false;
          }

          const deleteResponse = await fetch(`${baseUrl}/files/${fileId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (!deleteResponse.ok) {
            throw new Error(`Google Drive API error: ${deleteResponse.statusText}`);
          }

          enviornment.setOutput("File ID", fileId);
          enviornment.log.info(`File deleted: ${fileId}`);
          break;

        default:
          enviornment.log.error(`Unknown action: ${action}`);
          return false;
      }

      enviornment.log.info(`Google Drive ${action} executed successfully`);
      return true;
    } catch (apiError: any) {
      enviornment.log.error(`Google Drive operation failed: ${apiError.message}`);
      return false;
    }
  } catch (error: any) {
    enviornment.log.error(`Google Drive error: ${error.message}`);
    return false;
  }
}