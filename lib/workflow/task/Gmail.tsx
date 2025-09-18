import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { MailIcon, LucideProps } from "lucide-react";

export const GmailTask = {
  type: TaskType.GMAIL,
  label: "Gmail",
  icon: (props: LucideProps) => (
    <MailIcon className="stroke-red-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Send Email", value: "send" },
        { label: "Read Emails", value: "read" },
        { label: "Search Emails", value: "search" },
        { label: "Mark as Read", value: "mark_read" },
        { label: "Delete Email", value: "delete" }
      ],
    },
    {
      name: "To",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Recipient email addresses (comma separated)",
    },
    {
      name: "Subject",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Email subject",
    },
    {
      name: "Body",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Email body content",
    },
    {
      name: "Query",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Search query (for search/read actions)",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Message ID",
      type: TaskParamType.STRING,
    },
    {
      name: "Emails",
      type: TaskParamType.STRING,
    },
    {
      name: "Count",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;