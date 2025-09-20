import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { ReadExecutor, WriteExecutor, AppendExecutor, ClearExecutor } from "./GoogleSheets";

export async function GoogleSheetsExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.GOOGLE_SHEETS }>
): Promise<boolean> {
  const action = enviornment.getInput("Action");

  if (!action) {
    enviornment.log.error("Action is required");
    return false;
  }

  switch (action) {
    case "read":
      return await ReadExecutor(enviornment as any);
    case "write":
      return await WriteExecutor(enviornment as any);
    case "append":
      return await AppendExecutor(enviornment as any);
    case "clear":
      return await ClearExecutor(enviornment as any);
    default:
      enviornment.log.error(`Unknown action: ${action}`);
      return false;
  }
}