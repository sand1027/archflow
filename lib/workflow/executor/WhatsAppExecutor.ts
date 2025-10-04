import { ExecutionEnviornment } from "@/lib/types";
import { WhatsAppTask } from "../task/WhatsApp";

export async function WhatsAppExecutor(
  environment: ExecutionEnviornment<typeof WhatsAppTask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput("Credentials");
    const phoneNumber = environment.getInput("Phone Number");
    const message = environment.getInput("Message");

    const response = await fetch("https://graph.facebook.com/v17.0/messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: { body: message }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${data.error?.message || response.statusText}`);
    }

    environment.setOutput("Message ID", data.messages?.[0]?.id || "");
    environment.setOutput("Status", "sent");
    return true;
  } catch (error: any) {
    environment.log.error(`WhatsApp execution failed: ${error.message}`);
    return false;
  }
}