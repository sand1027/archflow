import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { InsertExecutor, FindExecutor, UpdateExecutor, DeleteExecutor } from "./MongoDB";

export async function MongoDBExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.MONGODB }>
): Promise<boolean> {
  const action = enviornment.getInput("Action");

  if (!action) {
    enviornment.log.error("Action is required");
    return false;
  }

  switch (action) {
    case "insert":
      return await InsertExecutor(enviornment as any);
    case "find":
      return await FindExecutor(enviornment as any);
    case "update":
      return await UpdateExecutor(enviornment as any);
    case "delete":
      return await DeleteExecutor(enviornment as any);
    default:
      enviornment.log.error(`Unknown action: ${action}`);
      return false;
  }
}