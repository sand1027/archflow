import { ExecutionEnviornment } from "@/lib/types";
import { HuggingFaceTask } from "../task/HuggingFace";
import { getCredentialValue } from "@/lib/credential-helper";

export async function HuggingFaceExecutor(
  enviornment: ExecutionEnviornment<typeof HuggingFaceTask>
): Promise<boolean> {
  try {
    const task = enviornment.getInput("Task");
    const model = enviornment.getInput("Model");
    const inputText = enviornment.getInput("Input Text");
    const credentialId = enviornment.getInput("Credentials");

    if (!task || !model || !inputText) {
      enviornment.log.error("Task, Model, and Input Text are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Hugging Face credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.api_key) {
      enviornment.log.error("Invalid Hugging Face credentials");
      return false;
    }

    enviornment.log.info(`Making Hugging Face ${task} request with model ${model}`);
    
    try {
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${credentials.api_key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: inputText }),
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.stringify(data);
      
      enviornment.setOutput("Result", result);

      enviornment.log.info("Hugging Face request completed successfully");
      return true;
      
    } catch (apiError: any) {
      enviornment.log.error(`Hugging Face API call failed: ${apiError.message}`);
      return false;
    }
    
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}