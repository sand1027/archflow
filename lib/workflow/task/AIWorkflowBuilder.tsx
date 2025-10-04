import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Brain, LucideProps } from "lucide-react";

export const AIWorkflowBuilderTask = {
  type: TaskType.AI_WORKFLOW_BUILDER,
  label: "AI Workflow Builder",
  icon: (props: LucideProps) => (
    <Brain className="stroke-purple-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Description",
      type: TaskParamType.TEXTAREA,
      required: true,
      helperText: "Describe what you want to automate in natural language",
    },
    {
      name: "AI Model",
      type: TaskParamType.SELECT,
      options: [
        { label: "GPT-4", value: "gpt-4" },
        { label: "GPT-3.5", value: "gpt-3.5-turbo" },
        { label: "Claude", value: "claude-3" },
      ],
      required: true,
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Workflow JSON",
      type: TaskParamType.STRING,
      helperText: "Generated workflow configuration",
    },
    {
      name: "Suggested Nodes",
      type: TaskParamType.STRING,
      helperText: "Recommended additional nodes",
    },
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;