import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Video, LucideProps } from "lucide-react";

export const ZoomTask = {
  type: TaskType.ZOOM,
  label: "Zoom",
  icon: (props: LucideProps) => (
    <Video className="stroke-blue-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Action",
      type: TaskParamType.SELECT,
      options: [
        { label: "Create Meeting", value: "create" },
        { label: "Get Recordings", value: "recordings" },
        { label: "List Meetings", value: "list" },
        { label: "Delete Meeting", value: "delete" },
      ],
      required: true,
    },
    {
      name: "Meeting Topic",
      type: TaskParamType.STRING,
      helperText: "Meeting topic (for create action)",
    },
    {
      name: "Start Time",
      type: TaskParamType.STRING,
      helperText: "Meeting start time (ISO format)",
    },
  ],
  outputs: [
    {
      name: "Meeting Data",
      type: TaskParamType.STRING,
      helperText: "Meeting information (JSON)",
    },
    {
      name: "Join URL",
      type: TaskParamType.STRING,
      helperText: "Meeting join URL",
    },
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;