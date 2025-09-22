import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, Cloud } from "lucide-react";

export const AWSS3Task = {
  type: TaskType.AWS_S3,
  label: "AWS S3",
  icon: (props: LucideProps) => <Cloud {...props} className="stroke-orange-600" />,
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
      helperText: "Choose the S3 operation",
    },
    {
      name: "Bucket",
      type: TaskParamType.STRING,
      required: true,
      hideHandle: false,
      helperText: "S3 bucket name",
    },
    {
      name: "Key",
      type: TaskParamType.STRING,
      required: false,
      hideHandle: false,
      helperText: "File key/path in S3",
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
      helperText: "AWS credentials",
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