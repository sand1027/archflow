import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { SendMessageExecutor } from "./Slack";

export async function SlackExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.SLACK }>
): Promise<boolean> {
  const action = enviornment.getInput("Action");

  if (!action) {
    enviornment.log.error("Action is required");
    return false;
  }

  switch (action) {
    case "send_message":
      return await SendMessageExecutor(enviornment as any);
    default:
      enviornment.log.error(`Unknown action: ${action}`);
      return false;
  }
}