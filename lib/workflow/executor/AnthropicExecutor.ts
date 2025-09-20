import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { ChatExecutor } from "./Anthropic";

export async function AnthropicExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.ANTHROPIC }>
): Promise<boolean> {
  // Anthropic only has chat completion, no action needed
  return await ChatExecutor(enviornment as any);
}