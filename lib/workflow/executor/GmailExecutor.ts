import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { SendEmailExecutor } from "./Gmail";

export async function GmailExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.GMAIL }>
): Promise<boolean> {
  const action = enviornment.getInput("Action");

  if (!action) {
    enviornment.log.error("Action is required");
    return false;
  }

  switch (action) {
    case "send":
    case "send_email":
      return await SendEmailExecutor(enviornment as any);
    default:
      enviornment.log.error(`Unknown action: ${action}`);
      return false;
  }
}