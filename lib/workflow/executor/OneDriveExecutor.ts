import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { StorageExecutor } from "./OneDrive";

export async function OneDriveExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.ONEDRIVE }>
): Promise<boolean> {
  return await StorageExecutor(enviornment as any);
}