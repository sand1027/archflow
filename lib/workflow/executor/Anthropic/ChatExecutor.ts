import { ExecutionEnviornment } from "@/lib/types";
import { AnthropicTask } from "../../task/Anthropic";
import { getCredentialValue } from "@/lib/credential-helper";

export async function ChatExecutor(
  enviornment: ExecutionEnviornment<typeof AnthropicTask>
): Promise<boolean> {
  try {
    const model = enviornment.getInput("Model");
    const prompt = enviornment.getInput("Prompt");
    const maxTokens = enviornment.getInput("Max Tokens") || "1000";
    const credentialId = enviornment.getInput("Credentials");

    if (!model || !prompt) {
      enviornment.log.error("Model and Prompt are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("Anthropic credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.api_key) {
      enviornment.log.error("Invalid Anthropic credentials");
      return false;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": credentials.api_key,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: parseInt(maxTokens),
        messages: [{ role: "user", content: prompt }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0]?.text || "No response";

    enviornment.setOutput("Response", aiResponse);
    enviornment.setOutput("Usage", JSON.stringify(data.usage || {}));
    enviornment.setOutput("Model Used", model);
    enviornment.log.info("Anthropic request completed successfully");

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}