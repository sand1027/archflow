import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, Database } from "lucide-react";

export const MongoDBTask = {
  type: TaskType.MONGODB,
  label: "MongoDB",
  icon: (props: LucideProps) => <Database {...props} className="stroke-green-600" />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      hideHandle: false,
      options: [
        { label: "Insert Document", value: "insert" },
        { label: "Find Documents", value: "find" },
        { label: "Update Document", value: "update" },
        { label: "Delete Document", value: "delete" },
      ],
      helperText: "Choose the MongoDB operation",
    },
    {
      name: "Collection",
      type: TaskParamType.STRING,
      required: true,
      hideHandle: false,
      helperText: "MongoDB collection name",
    },
    {
      name: "Document",
      type: TaskParamType.JSON,
      required: false,
      hideHandle: false,
      helperText: "Document data (JSON format)",
    },
    {
      name: "Query",
      type: TaskParamType.JSON,
      required: false,
      hideHandle: false,
      helperText: "Query filter (JSON format)",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
      hideHandle: true,
      helperText: "MongoDB connection credentials",
    },
  ],
  outputs: [
    {
      name: "Result",
      type: TaskParamType.JSON,
    },
    {
      name: "Count",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;