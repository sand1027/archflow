import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { QueryExecutor, InsertExecutor, UpdateExecutor, DeleteExecutor } from "./PostgreSQL";

export async function PostgreSQLExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.POSTGRESQL }>
): Promise<boolean> {
  const action = enviornment.getInput("Action");

  if (!action) {
    enviornment.log.error("Action is required");
    return false;
  }

  switch (action) {
    case "query":
      return await QueryExecutor(enviornment as any);
    case "insert":
      return await InsertExecutor(enviornment as any);
    case "update":
      return await UpdateExecutor(enviornment as any);
    case "delete":
      return await DeleteExecutor(enviornment as any);
    default:
      enviornment.log.error(`Unknown action: ${action}`);
      return false;
  }
}