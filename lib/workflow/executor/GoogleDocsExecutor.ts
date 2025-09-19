import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { getCredentialValue } from "@/lib/credential-helper";

export async function GoogleDocsExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.GOOGLE_DOCS }>
): Promise<boolean> {
  try {
    const action = enviornment.getInput("Action");
    const documentId = enviornment.getInput("Document ID");
    const title = enviornment.getInput("Title");
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
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Google Docs credentials - access token required");
      return false;
    }

    enviornment.log.info(`Executing Google Docs ${action}`);
    
    try {
      const accessToken = credentials.access_token;
      const baseUrl = 'https://docs.googleapis.com/v1/documents';
      
      switch (action) {
        case "create":
          const createPayload: any = {
            title: title || 'Untitled Document'
          };
          
          const createResponse = await fetch(baseUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(createPayload),
          });
          
          if (!createResponse.ok) {
            throw new Error(`Google Docs API error: ${createResponse.statusText}`);
          }
          
          const createData = await createResponse.json();
          enviornment.setOutput("Document ID", createData.documentId);
          enviornment.setOutput("Document URL", `https://docs.google.com/document/d/${createData.documentId}/edit`);
          enviornment.setOutput("Title", createData.title);
          enviornment.log.info(`Document created: ${createData.title}`);
          
          // Add content if provided
          if (content) {
            const insertResponse = await fetch(`${baseUrl}/${createData.documentId}:batchUpdate`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                requests: [{
                  insertText: {
                    location: { index: 1 },
                    text: content
                  }
                }]
              }),
            });
            
            if (insertResponse.ok) {
              enviornment.log.info("Content added to document");
            }
          }
          break;
          
        case "read":
          if (!documentId) {
            enviornment.log.error("Document ID is required for read operation");
            return false;
          }
          
          const readResponse = await fetch(`${baseUrl}/${documentId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          
          if (!readResponse.ok) {
            throw new Error(`Google Docs API error: ${readResponse.statusText}`);
          }
          
          const readData = await readResponse.json();
          const docContent = readData.body?.content?.map((element: any) => {
            if (element.paragraph) {
              return element.paragraph.elements?.map((el: any) => el.textRun?.content || '').join('') || '';
            }
            return '';
          }).join('\n') || '';
          
          enviornment.setOutput("Content", docContent);
          enviornment.setOutput("Title", readData.title);
          enviornment.setOutput("Document ID", documentId);
          enviornment.setOutput("Document URL", `https://docs.google.com/document/d/${documentId}/edit`);
          enviornment.log.info(`Document read: ${readData.title}`);
          break;
          
        case "update":
          if (!documentId) {
            enviornment.log.error("Document ID is required for update operation");
            return false;
          }
          
          if (!content) {
            enviornment.log.error("Content is required for update operation");
            return false;
          }
          
          const updateResponse = await fetch(`${baseUrl}/${documentId}:batchUpdate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requests: [{
                insertText: {
                  location: { index: 1 },
                  text: content
                }
              }]
            }),
          });
          
          if (!updateResponse.ok) {
            throw new Error(`Google Docs API error: ${updateResponse.statusText}`);
          }
          
          enviornment.setOutput("Document ID", documentId);
          enviornment.setOutput("Document URL", `https://docs.google.com/document/d/${documentId}/edit`);
          enviornment.log.info("Document updated successfully");
          break;
          
        default:
          enviornment.log.error(`Unknown action: ${action}`);
          return false;
      }

      enviornment.log.info(`Google Docs ${action} executed successfully`);
      return true;
      
    } catch (apiError: any) {
      enviornment.log.error(`Google Docs operation failed: ${apiError.message}`);
      return false;
    }
    
  } catch (error: any) {
    enviornment.log.error(`Google Docs error: ${error.message}`);
    return false;
  }
}