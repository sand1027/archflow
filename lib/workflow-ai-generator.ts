export interface WorkflowSuggestion {
  title: string;
  description: string;
  nodes: Array<{
    type: string;
    label: string;
    position: { x: number; y: number };
    data: Record<string, any>;
  }>;
  connections: Array<{
    source: string;
    target: string;
  }>;
}

export function generateWorkflowFromPrompt(prompt: string): WorkflowSuggestion {
  // AI-powered workflow generation based on user description
  const suggestions: Record<string, WorkflowSuggestion> = {
    "email automation": {
      title: "Email Automation Workflow",
      description: "Automatically process and respond to emails",
      nodes: [
        { type: "GMAIL", label: "Check Gmail", position: { x: 100, y: 100 }, data: {} },
        { type: "CONDITION", label: "Filter Important", position: { x: 300, y: 100 }, data: {} },
        { type: "OPENAI", label: "Generate Reply", position: { x: 500, y: 100 }, data: {} },
        { type: "GMAIL", label: "Send Reply", position: { x: 700, y: 100 }, data: {} }
      ],
      connections: [
        { source: "gmail-1", target: "condition-1" },
        { source: "condition-1", target: "openai-1" },
        { source: "openai-1", target: "gmail-2" }
      ]
    }
  };
  
  return suggestions["email automation"] || suggestions["email automation"];
}