import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { GitBranchIcon, LucideProps } from "lucide-react";

export const ConditionTask = {
  type: TaskType.CONDITION,
  label: "Condition",
  icon: (props: LucideProps) => (
    <GitBranchIcon className="stroke-yellow-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Value 1",
      type: TaskParamType.STRING,
      required: true,
      helperText: "First value to compare",
    },
    {
      name: "Operator",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Equals", value: "equals" },
        { label: "Not Equals", value: "not_equals" },
        { label: "Greater Than", value: "greater_than" },
        { label: "Less Than", value: "less_than" },
        { label: "Contains", value: "contains" },
        { label: "Starts With", value: "starts_with" },
        { label: "Ends With", value: "ends_with" },
        { label: "Is Empty", value: "is_empty" },
        { label: "Is Not Empty", value: "is_not_empty" }
      ],
    },
    {
      name: "Value 2",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Second value to compare (not needed for empty checks)",
    },
  ],
  outputs: [
    {
      name: "True",
      type: TaskParamType.STRING,
    },
    {
      name: "False",
      type: TaskParamType.STRING,
    },
    {
      name: "Result",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;