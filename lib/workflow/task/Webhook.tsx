import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Link, LucideProps } from "lucide-react";

export const WebhookTask = {
  type: TaskType.WEBHOOK,
  label: "Webhook",
  icon: (props: LucideProps) => (
    <Link className="stroke-blue-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Path",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Custom webhook path (optional)",
    },
  ],
  outputs: [
    {
      name: "Body",
      type: TaskParamType.STRING,
      helperText: "HTTP request body data",
    },
    {
      name: "Headers",
      type: TaskParamType.STRING,
      helperText: "HTTP request headers as JSON",
    },
  ],
} satisfies WorkflowTask;