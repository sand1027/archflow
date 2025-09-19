import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, VariableIcon } from "lucide-react";

export const SetVariableTask = {
  type: TaskType.SET_VARIABLE,
  label: "Set Variable",
  icon: (props: LucideProps) => <VariableIcon {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Variable Name",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Name of the variable to set",
    },
    {
      name: "Value",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Value to assign to the variable",
    },
  ],
  outputs: [
    {
      name: "Variable Name",
      type: TaskParamType.STRING,
    },
    {
      name: "Value",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;