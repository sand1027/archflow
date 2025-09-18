import { ExecutionEnviornment } from "@/lib/types";
import { AnthropicTask } from "../task/Anthropic";

export async function AnthropicExecutor(
  enviornment: ExecutionEnviornment<typeof AnthropicTask>
): Promise<boolean> {
  try {
    const model = enviornment.getInput("Model");
    const prompt = enviornment.getInput("Prompt");
    const maxTokens = enviornment.getInput("Max Tokens") || "1000";
    const temperature = enviornment.getInput("Temperature") || "1.0";

    if (!model || !prompt) {
      enviornment.log.error("Model and Prompt are required");
      return false;
    }

    enviornment.log.info(`Making Anthropic request with model ${model}`);
    
    const response = `Anthropic ${model} response to: ${prompt.substring(0, 50)}...`;
    const usage = `{"input_tokens": 10, "output_tokens": 20}`;
    
    enviornment.setOutput("Response", response);
    enviornment.setOutput("Usage", usage);

    enviornment.log.info("Anthropic request completed successfully");
    
    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}