import { ExecutionEnviornment } from "@/lib/types";
import { WebhookTask } from "../task/Webhook";

export async function WebhookExecutor(
  enviornment: ExecutionEnviornment<typeof WebhookTask>
): Promise<boolean> {
  try {
    const path = enviornment.getInput("Path") || "/webhook";
    
    enviornment.log.info(`Webhook triggered at path: ${path}`);
    enviornment.setOutput("Body", "{}");
    enviornment.setOutput("Headers", "{}");
    
    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}