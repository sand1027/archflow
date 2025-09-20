import { ExecutionEnviornment, TaskType, WorkflowTask } from "@/lib/types";
import { ChatCompletionExecutor } from "./OpenAI";

export async function OpenAIExecutor(
  enviornment: ExecutionEnviornment<WorkflowTask & { type: TaskType.OPENAI }>
): Promise<boolean> {
  const action = enviornment.getInput("Action");

  if (!action) {
    enviornment.log.error("Action is required");
    return false;
  }

  switch (action) {
    case "chat_completion":
    case "text_completion":
      return await ChatCompletionExecutor(enviornment as any);
    default:
      enviornment.log.error(`Unknown action: ${action}`);
      return false;
  }
}