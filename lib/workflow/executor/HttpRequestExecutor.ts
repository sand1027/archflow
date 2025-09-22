import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { RequestExecutor } from "./HttpRequest";

export async function HttpRequestExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.HTTP_REQUEST }>
): Promise<boolean> {
  // HttpRequest only has one action - making requests
  return await RequestExecutor(enviornment as any);
}