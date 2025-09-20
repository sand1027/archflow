import { ExecutionEnviornment } from "@/lib/types";
import { OpenAITask } from "../../task/OpenAI";
import { getCredentialValue } from "@/lib/credential-helper";

export async function ChatCompletionExecutor(
  enviornment: ExecutionEnviornment<typeof OpenAITask>
): Promise<boolean> {
  try {
    const model = enviornment.getInput("Model");
    const prompt = enviornment.getInput("Prompt");
    const maxTokens = enviornment.getInput("Max Tokens") || "1000";
    const temperature = enviornment.getInput("Temperature") || "1.0";
    const credentialId = enviornment.getInput("Credentials");

    if (!model || !prompt) {
      enviornment.log.error("Model and Prompt are required");
      return false;
    }

    if (!credentialId) {
      enviornment.log.error("OpenAI credentials are required");
      return false;
    }

    const credentials = await getCredentialValue(credentialId, enviornment.userId);
    if (!credentials || !credentials.api_key) {
      enviornment.log.error("Invalid OpenAI credentials");
      return false;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${credentials.api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: parseInt(maxTokens),
        temperature: parseFloat(temperature),
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "No response";
    const usage = JSON.stringify(data.usage || {});

    enviornment.setOutput("Response", aiResponse);
    enviornment.setOutput("Usage", usage);
    enviornment.setOutput("Model Used", model);
    enviornment.log.info("OpenAI chat completion completed successfully");

    return true;
  } catch (error: any) {
    enviornment.log.error(error.message);
    return false;
  }
}