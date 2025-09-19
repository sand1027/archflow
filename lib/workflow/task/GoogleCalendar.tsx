import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, CalendarIcon } from "lucide-react";

export const GoogleCalendarTask = {
  type: TaskType.GOOGLE_CALENDAR,
  label: "Google Calendar",
  icon: (props: LucideProps) => <CalendarIcon {...props} className="stroke-red-600" />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Create Event", value: "create_event" },
        { label: "List Events", value: "list_events" },
        { label: "Update Event", value: "update_event" },
        { label: "Delete Event", value: "delete_event" },
      ],
      helperText: "Choose the action to perform",
    },
    {
      name: "Event ID",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Event ID (required for update/delete)",
    },
    {
      name: "Title",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Event title/summary",
    },
    {
      name: "Start Time",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Start time (ISO format: 2024-01-15T10:00:00Z)",
    },
    {
      name: "End Time",
      type: TaskParamType.STRING,
      required: false,
      helperText: "End time (ISO format: 2024-01-15T11:00:00Z)",
    },
    {
      name: "Description",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Event description",
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
      name: "Event ID",
      type: TaskParamType.STRING,
    },
    {
      name: "Event URL",
      type: TaskParamType.STRING,
    },
    {
      name: "Events",
      type: TaskParamType.STRING,
    },
    {
      name: "Count",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;