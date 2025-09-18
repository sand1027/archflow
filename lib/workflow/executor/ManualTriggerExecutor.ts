import { ExecutionEnviornment } from "@/lib/types";
import { ManualTriggerTask } from "../task/ManualTrigger";

export async function ManualTriggerExecutor(
  enviornment: ExecutionEnviornment<typeof ManualTriggerTask>
): Promise<boolean> {
  try {
    const inputData = enviornment.getInput("Input Data") || "{}";
    
    enviornment.log.info("Manual trigger executed");
    enviornment.setOutput("Data", inputData);
    
    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}