import { ExecutionEnviornment } from "@/lib/types";
import { SlackTask } from "../task/Slack";
import { getCredentialValue } from "@/lib/credential-helper";

export async function SlackExecutor(
  enviornment: ExecutionEnviornment<typeof SlackTask>
): Promise<boolean> {
  try {
    const action = enviornment.getInput("Action");
    const channel = enviornment.getInput("Channel");
    const message = enviornment.getInput("Message");
    const threadTs = enviornment.getInput("Thread TS");
    const credentialId = enviornment.getInput("Credentials");

    if (!action || !channel || !message) {
      enviornment.log.error("Action, Channel, and Message are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Slack credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.token) {
      enviornment.log.error("Invalid Slack credentials");
      return false;
    }

    enviornment.log.info(`Sending Slack ${action} to ${channel}`);
    
    try {
      const body: any = {
        channel: channel,
        text: message,
      };

      if (threadTs) {
        body.thread_ts = threadTs;
      }

      const response = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${credentials.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.ok) {
        throw new Error(`Slack API error: ${data.error}`);
      }

      enviornment.setOutput("Message ID", data.message?.ts || "");
      enviornment.setOutput("Timestamp", data.ts || "");
      enviornment.setOutput("Response", JSON.stringify(data));

      enviornment.log.info("Slack message sent successfully");
      return true;
      
    } catch (apiError: any) {
      enviornment.log.error(`Slack API call failed: ${apiError.message}`);
      return false;
    }
    
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}