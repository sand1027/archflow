import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { MessageSquare, LucideProps } from "lucide-react";

export const MicrosoftTeamsTask = {
  type: TaskType.MICROSOFT_TEAMS,
  label: "Microsoft Teams",
  icon: (props: LucideProps) => (
    <MessageSquare className="stroke-blue-600" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Webhook URL",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Teams channel webhook URL",
    },
    {
      name: "Message",
      type: TaskParamType.TEXTAREA,
      required: true,
      helperText: "Message to send to Teams channel",
    },
    {
      name: "Title",
      type: TaskParamType.STRING,
      helperText: "Optional message title",
    },
  ],
  outputs: [
    {
      name: "Response",
      type: TaskParamType.STRING,
      helperText: "Teams message response",
    },
    {
      name: "Status",
      type: TaskParamType.STRING,
      helperText: "Message delivery status",
    },
  ],
} satisfies WorkflowTask;