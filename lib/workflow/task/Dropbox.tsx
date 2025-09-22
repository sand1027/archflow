import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, Cloud } from "lucide-react";

export const DropboxTask = {
  type: TaskType.DROPBOX,
  label: "Dropbox",
  icon: (props: LucideProps) => <Cloud {...props} className="stroke-blue-500" />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      hideHandle: false,
      options: [
        { label: "Upload File", value: "upload" },
        { label: "Download File", value: "download" },
        { label: "Delete File", value: "delete" },
        { label: "List Files", value: "list" },
      ],
      helperText: "Choose the Dropbox operation",
    },
    {
      name: "Path",
      type: TaskParamType.STRING,
      required: true,
      hideHandle: false,
      helperText: "File path in Dropbox",
    },
    {
      name: "Content",
      type: TaskParamType.TEXTAREA,
      required: false,
      hideHandle: false,
      helperText: "File content for upload",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
      hideHandle: true,
      helperText: "Dropbox access token",
    },
  ],
  outputs: [
    {
      name: "URL",
      type: TaskParamType.STRING,
    },
    {
      name: "Content",
      type: TaskParamType.STRING,
    },
    {
      name: "Files",
      type: TaskParamType.JSON,
    },
  ],
} satisfies WorkflowTask;