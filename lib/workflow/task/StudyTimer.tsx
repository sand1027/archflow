import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Timer, LucideProps } from "lucide-react";

export const StudyTimerTask = {
  type: TaskType.STUDY_TIMER,
  label: "Study Timer",
  icon: (props: LucideProps) => (
    <Timer className="stroke-red-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Study Duration",
      type: TaskParamType.NUMBER,
      required: true,
      helperText: "Study session duration in minutes (default: 25)",
    },
    {
      name: "Break Duration",
      type: TaskParamType.NUMBER,
      required: true,
      helperText: "Break duration in minutes (default: 5)",
    },
    {
      name: "Sessions",
      type: TaskParamType.NUMBER,
      required: true,
      helperText: "Number of study sessions (default: 4)",
    },
    {
      name: "Notification Method",
      type: TaskParamType.SELECT,
      options: [
        { label: "Slack", value: "slack" },
        { label: "Discord", value: "discord" },
        { label: "Email", value: "email" },
        { label: "Teams", value: "teams" },
      ],
      required: true,
    },
    {
      name: "Notification Target",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Channel/email for notifications",
    },
  ],
  outputs: [
    {
      name: "Session Status",
      type: TaskParamType.STRING,
      helperText: "Current session status",
    },
    {
      name: "Total Time",
      type: TaskParamType.STRING,
      helperText: "Total study time in minutes",
    },
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;