import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Bot, LucideProps } from "lucide-react";

export const HuggingFaceTask = {
  type: TaskType.HUGGING_FACE,
  label: "Hugging Face",
  icon: (props: LucideProps) => (
    <Bot className="stroke-yellow-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Task",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Text Generation", value: "text-generation" },
        { label: "Text Classification", value: "text-classification" },
        { label: "Sentiment Analysis", value: "sentiment-analysis" },
        { label: "Question Answering", value: "question-answering" },
        { label: "Summarization", value: "summarization" },
        { label: "Translation", value: "translation" },
      ],
    },
    {
      name: "Model",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Model name (e.g., gpt2, bert-base-uncased)",
    },
    {
      name: "Input Text",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Text to process",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Result",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;