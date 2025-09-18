import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Hand, LucideProps } from "lucide-react";

export const ManualTriggerTask = {
  type: TaskType.MANUAL_TRIGGER,
  label: "Manual Trigger",
  icon: (props: LucideProps) => (
    <Hand className="stroke-purple-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Input Data",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Optional data to pass to workflow",
    },
  ],
  outputs: [
    {
      name: "Data",
      type: TaskParamType.STRING,
      helperText: "Input data passed to workflow",
    },
  ],
} satisfies WorkflowTask;