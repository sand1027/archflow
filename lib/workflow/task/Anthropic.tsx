import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Brain, LucideProps } from "lucide-react";

export const AnthropicTask = {
  type: TaskType.ANTHROPIC,
  label: "Anthropic",
  icon: (props: LucideProps) => (
    <Brain className="stroke-purple-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Model",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Claude 3 Opus", value: "claude-3-opus-20240229" },
        { label: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229" },
        { label: "Claude 3 Haiku", value: "claude-3-haiku-20240307" },
      ],
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Your prompt or message",
    },
    {
      name: "Max Tokens",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Maximum tokens to generate (default: 1000)",
    },
    {
      name: "Temperature",
      type: TaskParamType.STRING,
      required: false,
      helperText: "0.0 to 1.0 (default: 1.0)",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
    {
      name: "Usage",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;