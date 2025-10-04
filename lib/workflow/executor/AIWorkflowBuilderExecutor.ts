import { ExecutionEnviornment } from "@/lib/types";
import { AIWorkflowBuilderTask } from "../task/AIWorkflowBuilder";

export async function AIWorkflowBuilderExecutor(
  environment: ExecutionEnviornment<typeof AIWorkflowBuilderTask>
): Promise<boolean> {
  try {
    const description = environment.getInput("Description");
    const aiModel = environment.getInput("AI Model");
    const credentials = environment.getInput("Credentials");

    const prompt = `Convert this automation request into a WorkFlex workflow JSON:
"${description}"

Return a JSON object with:
- nodes: array of workflow nodes with type, inputs, outputs
- connections: array of node connections
- suggestedNodes: array of recommended additional nodes

Available node types: START, HTTP_REQUEST, CONDITION, SLACK, DISCORD, GMAIL, GOOGLE_SHEETS, OPENAI, etc.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const workflowJson = JSON.parse(data.choices[0].message.content);

    environment.setOutput("Workflow JSON", JSON.stringify(workflowJson));
    environment.setOutput("Suggested Nodes", JSON.stringify(workflowJson.suggestedNodes || []));
    return true;
  } catch (error: any) {
    environment.log.error(`AI Workflow Builder failed: ${error.message}`);
    return false;
  }
}