import { ExecutionEnviornment } from "@/lib/types";
import { GmailTask } from "../task/Gmail";
import { getCredentialValue } from "@/lib/credential-helper";

export async function GmailExecutor(
  enviornment: ExecutionEnviornment<typeof GmailTask>
): Promise<boolean> {
  try {
    const action = enviornment.getInput("Action");
    const to = enviornment.getInput("To");
    const subject = enviornment.getInput("Subject");
    const body = enviornment.getInput("Body");
    const credentialId = enviornment.getInput("Credentials");

    if (!action) {
      enviornment.log.error("Action is required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Gmail credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Gmail credentials - access token required");
      return false;
    }

    enviornment.log.info(`Executing Gmail ${action}`);
    
    if (action === "send" && (!to || !subject || !body)) {
      enviornment.log.error("To, Subject, and Body are required for sending emails");
      return false;
    }

    try {
      const accessToken = credentials.access_token;
      const baseUrl = 'https://gmail.googleapis.com/gmail/v1/users/me';
      
      switch (action) {
        case "send":
          // Create email message
          const emailContent = [
            `To: ${to}`,
            `Subject: ${subject}`,
            '',
            body
          ].join('\n');
          
          const encodedMessage = Buffer.from(emailContent).toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
          
          const sendResponse = await fetch(`${baseUrl}/messages/send`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              raw: encodedMessage
            }),
          });
          
          if (!sendResponse.ok) {
            throw new Error(`Gmail API error: ${sendResponse.statusText}`);
          }
          
          const sendData = await sendResponse.json();
          enviornment.setOutput("Message ID", sendData.id);
          enviornment.setOutput("Thread ID", sendData.threadId);
          enviornment.log.info(`Email sent to ${to} with subject: ${subject}`);
          break;
          
        case "read":
        case "search":
          const query = action === "search" ? `&q=${encodeURIComponent(subject || '')}` : '';
          const listResponse = await fetch(`${baseUrl}/messages?maxResults=10${query}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          
          if (!listResponse.ok) {
            throw new Error(`Gmail API error: ${listResponse.statusText}`);
          }
          
          const listData = await listResponse.json();
          const messages = listData.messages || [];
          
          // Get details for each message
          const emailDetails = [];
          for (const msg of messages.slice(0, 5)) { // Limit to 5 for performance
            const detailResponse = await fetch(`${baseUrl}/messages/${msg.id}`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            });
            
            if (detailResponse.ok) {
              const detail = await detailResponse.json();
              const headers = detail.payload?.headers || [];
              emailDetails.push({
                id: detail.id,
                subject: headers.find((h: any) => h.name === 'Subject')?.value || 'No Subject',
                from: headers.find((h: any) => h.name === 'From')?.value || 'Unknown',
                snippet: detail.snippet || ''
              });
            }
          }
          
          enviornment.setOutput("Emails", JSON.stringify(emailDetails));
          enviornment.setOutput("Count", String(emailDetails.length));
          enviornment.log.info(`Found ${emailDetails.length} emails`);
          break;
          
        default:
          enviornment.log.error(`Unknown action: ${action}`);
          return false;
      }

      enviornment.log.info(`Gmail ${action} executed successfully`);
      return true;
      
    } catch (apiError: any) {
      enviornment.log.error(`Gmail operation failed: ${apiError.message}`);
      return false;
    }
    
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}