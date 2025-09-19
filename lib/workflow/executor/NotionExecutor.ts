import { ExecutionEnviornment } from "@/lib/types";
import { NotionTask } from "../task/Notion";
import { getCredentialValue } from "@/lib/credential-helper";

export async function NotionExecutor(
  enviornment: ExecutionEnviornment<typeof NotionTask>
): Promise<boolean> {
  try {
    const action = enviornment.getInput("Action");
    const databasePageId = enviornment.getInput("Database/Page ID");
    const title = enviornment.getInput("Title");
    const content = enviornment.getInput("Content");
    const credentialId = enviornment.getInput("Credentials");

    if (!action || !databasePageId) {
      enviornment.log.error("Action and Database/Page ID are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Notion credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.api_key) {
      enviornment.log.error("Invalid Notion credentials");
      return false;
    }

    enviornment.log.info(`Executing Notion ${action}`);
    
    try {
      let url = "";
      let method = "POST";
      let body: any = {};

      switch (action) {
        case "create_page":
          url = "https://api.notion.com/v1/pages";
          body = {
            parent: { database_id: databasePageId },
            properties: {
              title: {
                title: [{ text: { content: title || "New Page" } }]
              }
            }
          };
          if (content) {
            body.children = [
              {
                object: "block",
                type: "paragraph",
                paragraph: {
                  rich_text: [{ type: "text", text: { content: content } }]
                }
              }
            ];
          }
          break;
        case "get_page":
          url = `https://api.notion.com/v1/pages/${databasePageId}`;
          method = "GET";
          break;
        default:
          throw new Error(`Unsupported action: ${action}`);
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${credentials.api_key}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: method === "POST" ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status}`);
      }

      const data = await response.json();
      
      enviornment.setOutput("Page ID", data.id || "");
      enviornment.setOutput("Data", JSON.stringify(data));
      enviornment.setOutput("URL", data.url || "");

      enviornment.log.info("Notion request completed successfully");
      return true;
      
    } catch (apiError: any) {
      enviornment.log.error(`Notion API call failed: ${apiError.message}`);
      return false;
    }
    
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}