import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";

export async function WaitExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.WAIT }>
): Promise<boolean> {
  try {
    const durationStr = enviornment.getInput("Duration");
    
    if (!durationStr) {
      enviornment.log.error("Duration is required");
      return false;
    }

    const duration = parseInt(durationStr);
    if (isNaN(duration) || duration < 0) {
      enviornment.log.error("Duration must be a positive number");
      return false;
    }

    enviornment.log.info(`Waiting for ${duration} seconds`);

    await new Promise(resolve => setTimeout(resolve, duration * 1000));

    enviornment.setOutput("Completed", new Date().toISOString());
    enviornment.log.info(`Wait completed after ${duration} seconds`);

    return true;
  } catch (error: any) {
    enviornment.log.error(`Wait error: ${error.message}`);
    return false;
  }
}