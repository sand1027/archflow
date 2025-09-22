import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, Cloud } from "lucide-react";

export const OneDriveTask = {
  type: TaskType.ONEDRIVE,
  label: "OneDrive",
  icon: (props: LucideProps) => <Cloud {...props} className="stroke-blue-700" />,
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
      helperText: "Choose the OneDrive operation",
    },
    {
      name: "Path",
      type: TaskParamType.STRING,
      required: true,
      hideHandle: false,
      helperText: "File path in OneDrive",
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
      helperText: "Microsoft Graph API credentials",
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