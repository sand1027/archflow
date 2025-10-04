import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Lightbulb, LucideProps } from "lucide-react";

export const SmartNodeSuggestionsTask = {
  type: TaskType.SMART_NODE_SUGGESTIONS,
  label: "Smart Node Suggestions",
  icon: (props: LucideProps) => (
    <Lightbulb className="stroke-yellow-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Current Workflow",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Current workflow configuration (JSON)",
    },
    {
      name: "Context",
      type: TaskParamType.STRING,
      helperText: "Additional context about the workflow purpose",
    },
  ],
  outputs: [
    {
      name: "Suggested Nodes",
      type: TaskParamType.STRING,
      helperText: "AI-suggested workflow nodes",
    },
    {
      name: "Optimization Tips",
      type: TaskParamType.STRING,
      helperText: "Workflow optimization recommendations",
    },
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;