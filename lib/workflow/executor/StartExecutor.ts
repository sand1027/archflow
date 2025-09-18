import { ExecutionEnviornment } from "@/lib/types";
import { StartTask } from "../task/Start";

export async function StartExecutor(
  enviornment: ExecutionEnviornment<typeof StartTask>
): Promise<boolean> {
  try {
    enviornment.log.info("Workflow started");
    enviornment.setOutput("trigger", "started");
    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}