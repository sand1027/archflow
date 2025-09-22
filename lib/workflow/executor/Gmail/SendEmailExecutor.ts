import { ExecutionEnviornment } from "@/lib/types";
import { GmailTask } from "../../task/Gmail";
import { getCredentialValue } from "@/lib/credential-helper";

export async function SendEmailExecutor(
  enviornment: ExecutionEnviornment<typeof GmailTask>
): Promise<boolean> {
  try {
    const to = enviornment.getInput("To");
    const subject = enviornment.getInput("Subject");
    const body = enviornment.getInput("Body");
    const credentialId = enviornment.getInput("Credentials");

    if (!to || !subject || !body) {
      enviornment.log.error("To, Subject, and Body are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Gmail credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.access_token) {
      enviornment.log.error("Invalid Gmail credentials");
      return false;
    }

    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedEmail
      }),
    });

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.statusText}`);
    }

    const data = await response.json();
    enviornment.setOutput("Message ID", data.id);
    enviornment.setOutput("Thread ID", data.threadId);
    enviornment.log.info("Email sent successfully");

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}