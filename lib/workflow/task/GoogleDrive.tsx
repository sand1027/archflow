import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, HardDriveIcon } from "lucide-react";

export const GoogleDriveTask = {
  type: TaskType.GOOGLE_DRIVE,
  label: "Google Drive",
  icon: (props: LucideProps) => <HardDriveIcon {...props} className="stroke-yellow-600" />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "List Files", value: "list" },
        { label: "Upload File", value: "upload" },
        { label: "Download File", value: "download" },
        { label: "Delete File", value: "delete" },
      ],
      helperText: "Choose the action to perform",
    },
    {
      name: "File ID",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Google Drive file ID (required for download/delete)",
    },
    {
      name: "File Name",
      type: TaskParamType.STRING,
      required: false,
      helperText: "File name (for upload)",
    },
    {
      name: "File Content",
      type: TaskParamType.STRING,
      required: false,
      helperText: "File content (for upload)",
    },
    {
      name: "Folder ID",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Parent folder ID (optional)",
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
      name: "Files",
      type: TaskParamType.STRING,
    },
    {
      name: "File ID",
      type: TaskParamType.STRING,
    },
    {
      name: "File URL",
      type: TaskParamType.STRING,
    },
    {
      name: "Content",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;