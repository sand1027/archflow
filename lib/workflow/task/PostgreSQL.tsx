import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, Database } from "lucide-react";

export const PostgreSQLTask = {
  type: TaskType.POSTGRESQL,
  label: "PostgreSQL",
  icon: (props: LucideProps) => <Database {...props} className="stroke-indigo-600" />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      hideHandle: false,
      options: [
        { label: "Execute Query", value: "query" },
        { label: "Insert Record", value: "insert" },
        { label: "Update Record", value: "update" },
        { label: "Delete Record", value: "delete" },
      ],
      helperText: "Choose the PostgreSQL operation",
    },
    {
      name: "Query",
      type: TaskParamType.TEXTAREA,
      required: true,
      hideHandle: false,
      helperText: "SQL query to execute",
    },
    {
      name: "Parameters",
      type: TaskParamType.JSON,
      required: false,
      hideHandle: false,
      helperText: "Query parameters (JSON array)",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
      hideHandle: true,
      helperText: "PostgreSQL connection credentials",
    },
  ],
  outputs: [
    {
      name: "Result",
      type: TaskParamType.JSON,
    },
    {
      name: "Rows Affected",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;