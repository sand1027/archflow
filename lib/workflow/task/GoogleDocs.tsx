import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, FileTextIcon } from "lucide-react";

export const GoogleDocsTask = {
  type: TaskType.GOOGLE_DOCS,
  label: "Google Docs",
  icon: (props: LucideProps) => <FileTextIcon {...props} className="stroke-blue-600" />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Create Document", value: "create" },
        { label: "Read Document", value: "read" },
        { label: "Update Document", value: "update" },
      ],
      helperText: "Choose the action to perform",
    },
    {
      name: "Document ID",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Google Docs document ID (required for read/update)",
    },
    {
      name: "Title",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Document title (for create)",
    },
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Document content",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
      helperText: "Google OAuth credentials",
    },
  ],
  outputs: [
    {
      name: "Document ID",
      type: TaskParamType.STRING,
    },
    {
      name: "Document URL",
      type: TaskParamType.STRING,
    },
    {
      name: "Content",
      type: TaskParamType.STRING,
    },
    {
      name: "Title",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;