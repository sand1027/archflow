import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { BrainIcon, LucideProps } from "lucide-react";

export const OpenAITask = {
  type: TaskType.OPENAI,
  label: "OpenAI",
  icon: (props: LucideProps) => (
    <BrainIcon className="stroke-emerald-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Chat Completion", value: "chat" },
        { label: "Text Completion", value: "completion" },
        { label: "Image Generation", value: "image" },
        { label: "Text to Speech", value: "tts" },
        { label: "Speech to Text", value: "stt" }
      ],
    },
    {
      name: "Model",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "GPT-4", value: "gpt-4" },
        { label: "GPT-4 Turbo", value: "gpt-4-turbo" },
        { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
        { label: "DALL-E 3", value: "dall-e-3" },
        { label: "Whisper", value: "whisper-1" }
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
      helperText: "0.0 to 2.0 (default: 1.0)",
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
      helperText: "AI-generated text response",
    },
    {
      name: "Usage",
      type: TaskParamType.STRING,
      helperText: "Token usage statistics (JSON)",
    },
    {
      name: "Model Used",
      type: TaskParamType.STRING,
      helperText: "Name of the AI model used",
    },
  ],
} satisfies WorkflowTask;