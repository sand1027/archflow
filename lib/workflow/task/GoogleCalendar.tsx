import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, CalendarIcon } from "lucide-react";

export const GoogleCalendarTask = {
  type: TaskType.GOOGLE_CALENDAR,
  label: "Google Calendar",
  icon: (props: LucideProps) => <CalendarIcon {...props} className="stroke-blue-600" />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      hideHandle: false,
      options: [
        { label: "Create Event", value: "create_event" },
        { label: "List Events", value: "list_events" },
        { label: "Update Event", value: "update_event" },
        { label: "Delete Event", value: "delete_event" },
      ],
      helperText: "Choose the calendar action to perform",
    },
    {
      name: "Event ID",
      type: TaskParamType.STRING,
      required: false,
      hideHandle: false,
      helperText: "Event ID (required for update/delete operations)",
    },
    {
      name: "Title",
      type: TaskParamType.STRING,
      required: false,
      hideHandle: false,
      helperText: "Event title/summary",
    },
    {
      name: "Start Time",
      type: TaskParamType.STRING,
      required: false,
      hideHandle: false,
      helperText: "Start time in ISO format (e.g., 2025-09-25T09:00:00)",
    },
    {
      name: "End Time",
      type: TaskParamType.STRING,
      required: false,
      hideHandle: false,
      helperText: "End time in ISO format (e.g., 2025-09-25T10:00:00)",
    },
    {
      name: "Description",
      type: TaskParamType.TEXTAREA,
      required: false,
      hideHandle: false,
      helperText: "Event description or notes",
    },

    {
      name: "Data",
      type: TaskParamType.JSON,
      required: false,
      hideHandle: false,
      helperText: "Data from Google Sheets (connect from Google Sheets Data output)",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
      hideHandle: true,
      helperText: "Google OAuth2 credentials with Calendar access",
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
      type: TaskParamType.JSON,
    },
    {
      name: "Count",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;