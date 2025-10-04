import { ExecutionEnviornment } from "@/lib/types";
import { MicrosoftTeamsTask } from "../task/MicrosoftTeams";

export async function MicrosoftTeamsExecutor(
  environment: ExecutionEnviornment<typeof MicrosoftTeamsTask>
): Promise<boolean> {
  try {
    const webhookUrl = environment.getInput("Webhook URL");
    const message = environment.getInput("Message");
    const title = environment.getInput("Title");

    const payload = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      themeColor: "0076D7",
      summary: title || "WorkFlex Notification",
      sections: [{
        activityTitle: title || "WorkFlex Notification",
        activitySubtitle: message,
        markdown: true
      }]
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Teams API error: ${response.statusText}`);
    }

    environment.setOutput("Response", "Message sent successfully");
    return true;
  } catch (error: any) {
    environment.log.error(`Teams execution failed: ${error.message}`);
    return false;
  }
}