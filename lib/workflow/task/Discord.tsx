import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { MessageCircleIcon, LucideProps } from "lucide-react";

export const DiscordTask = {
  type: TaskType.DISCORD,
  label: "Discord",
  icon: (props: LucideProps) => (
    <MessageCircleIcon className="stroke-indigo-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Send Message", value: "send_message" },
        { label: "Send Embed", value: "send_embed" },
        { label: "Create Channel", value: "create_channel" },
        { label: "Get Channel Messages", value: "get_messages" },
        { label: "Add Reaction", value: "add_reaction" }
      ],
    },
    {
      name: "Channel ID",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Discord channel ID",
    },
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Message content or embed JSON",
    },
    {
      name: "Username",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Override bot username",
    },
    {
      name: "Avatar URL",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Override bot avatar",
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
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;