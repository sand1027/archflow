import { ExecutionEnviornment } from "@/lib/types";
import { ScheduleTriggerTask } from "../task/ScheduleTrigger";

export async function ScheduleTriggerExecutor(
  enviornment: ExecutionEnviornment<typeof ScheduleTriggerTask>
): Promise<boolean> {
  try {
    const schedule = enviornment.getInput("Schedule");
    const timezone = enviornment.getInput("Timezone") || "UTC";
    
    if (!schedule) {
      enviornment.log.error("Schedule is required");
      return false;
    }
    
    enviornment.log.info(`Schedule trigger: ${schedule} (${timezone})`);
    enviornment.setOutput("Timestamp", new Date().toISOString());
    
    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}