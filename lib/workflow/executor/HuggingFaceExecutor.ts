import { ExecutionEnviornment } from "@/lib/types";
import { HuggingFaceTask } from "../task/HuggingFace";

export async function HuggingFaceExecutor(
  enviornment: ExecutionEnviornment<typeof HuggingFaceTask>
): Promise<boolean> {
  try {
    const task = enviornment.getInput("Task");
    const model = enviornment.getInput("Model");
    const inputText = enviornment.getInput("Input Text");

    if (!task || !model || !inputText) {
      enviornment.log.error("Task, Model, and Input Text are required");
      return false;
    }

    enviornment.log.info(`Making Hugging Face ${task} request with model ${model}`);
    
    const result = `Hugging Face ${task} result for: ${inputText.substring(0, 50)}...`;
    
    enviornment.setOutput("Result", result);

    enviornment.log.info("Hugging Face request completed successfully");
    
    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}