import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { MessageSquareIcon, LucideProps } from "lucide-react";

export const SlackTask = {
  type: TaskType.SLACK,
  label: "Slack",
  icon: (props: LucideProps) => (
    <MessageSquareIcon className="stroke-purple-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Send Message", value: "send_message" },
        { label: "Send Direct Message", value: "send_dm" },
        { label: "Create Channel", value: "create_channel" },
        { label: "Get Channel Info", value: "get_channel" },
        { label: "Upload File", value: "upload_file" }
      ],
    },
    {
      name: "Channel",
      type: TaskParamType.STRING,
      required: true,
      helperText: "#channel-name or @username",
    },
    {
      name: "Message",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Message content to send",
    },
    {
      name: "Thread TS",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Reply to thread (timestamp)",
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
      name: "Timestamp",
      type: TaskParamType.STRING,
    },
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;