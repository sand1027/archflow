import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, GitBranchIcon } from "lucide-react";

export const SwitchTask = {
  type: TaskType.SWITCH,
  label: "Switch",
  icon: (props: LucideProps) => <GitBranchIcon {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Input Value",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Value to compare against cases",
    },
    {
      name: "Case 1",
      type: TaskParamType.STRING,
      required: false,
      helperText: "First case value",
    },
    {
      name: "Case 2",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Second case value",
    },
    {
      name: "Case 3",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Third case value",
    },
  ],
  outputs: [
    {
      name: "Case 1 Match",
      type: TaskParamType.STRING,
    },
    {
      name: "Case 2 Match",
      type: TaskParamType.STRING,
    },
    {
      name: "Case 3 Match",
      type: TaskParamType.STRING,
    },
    {
      name: "Default",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;