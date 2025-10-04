import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { MessageCircle, LucideProps } from "lucide-react";

export const WhatsAppTask = {
  type: TaskType.WHATSAPP,
  label: "WhatsApp Business",
  icon: (props: LucideProps) => (
    <MessageCircle className="stroke-green-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Phone Number",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Recipient phone number (with country code)",
    },
    {
      name: "Message",
      type: TaskParamType.TEXTAREA,
      required: true,
      helperText: "Message to send",
    },
  ],
  outputs: [
    {
      name: "Message ID",
      type: TaskParamType.STRING,
      helperText: "WhatsApp message ID",
    },
    {
      name: "Status",
      type: TaskParamType.STRING,
      helperText: "Message delivery status",
    },
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;