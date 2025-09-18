import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { PlayIcon, LucideProps } from "lucide-react";

export const StartTask = {
  type: TaskType.START,
  label: "Start",
  icon: (props: LucideProps) => (
    <PlayIcon className="stroke-green-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [],
  outputs: [
    {
      name: "trigger",
      type: TaskParamType.STRING,
      helperText: "Workflow start signal",
    },
  ],
} satisfies WorkflowTask;