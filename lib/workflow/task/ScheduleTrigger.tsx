import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Clock, LucideProps } from "lucide-react";

export const ScheduleTriggerTask = {
  type: TaskType.SCHEDULE_TRIGGER,
  label: "Schedule Trigger",
  icon: (props: LucideProps) => (
    <Clock className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Schedule",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Cron expression (e.g., 0 9 * * * for daily at 9 AM)",
    },
    {
      name: "Timezone",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Timezone (e.g., America/New_York)",
    },
  ],
  outputs: [
    {
      name: "Timestamp",
      type: TaskParamType.STRING,
      helperText: "Current execution timestamp",
    },
  ],
} satisfies WorkflowTask;