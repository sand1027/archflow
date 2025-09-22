import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, CodeIcon } from "lucide-react";

export const CodeTask = {
  type: TaskType.CODE,
  label: "Code",
  icon: (props: LucideProps) => <CodeIcon {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "JavaScript Code",
      type: TaskParamType.TEXTAREA,
      required: true,
      helperText: "JavaScript code to execute. Use 'return' to output data.",
      hideHandle: true,
    },
    {
      name: "Input Data",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Optional input data accessible as 'inputData' variable",
      hideHandle: false,
    },
  ],
  outputs: [
    {
      name: "Result",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;