import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Shuffle, LucideProps } from "lucide-react";

export const AIDataTransformerTask = {
  type: TaskType.AI_DATA_TRANSFORMER,
  label: "AI Data Transformer",
  icon: (props: LucideProps) => (
    <Shuffle className="stroke-cyan-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Input Data",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Data to transform (JSON format)",
    },
    {
      name: "Target Format",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Describe the desired output format",
    },
    {
      name: "AI Model",
      type: TaskParamType.SELECT,
      options: [
        { label: "GPT-4", value: "gpt-4" },
        { label: "GPT-3.5", value: "gpt-3.5-turbo" },
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
      name: "Transformed Data",
      type: TaskParamType.STRING,
      helperText: "AI-transformed data output",
    },
    {
      name: "Transformation Log",
      type: TaskParamType.STRING,
      helperText: "Transformation process details",
    },
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;