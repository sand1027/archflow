import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, ClockIcon } from "lucide-react";

export const WaitTask = {
  type: TaskType.WAIT,
  label: "Wait",
  icon: (props: LucideProps) => <ClockIcon {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Duration",
      type: TaskParamType.NUMBER,
      required: true,
      helperText: "Wait duration in seconds",
    },
  ],
  outputs: [
    {
      name: "Completed",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;