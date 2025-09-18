import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { GlobeIcon, LucideProps } from "lucide-react";

export const HttpRequestTask = {
  type: TaskType.HTTP_REQUEST,
  label: "HTTP Request",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-blue-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Method",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "GET", value: "GET" },
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
        { label: "DELETE", value: "DELETE" },
        { label: "PATCH", value: "PATCH" }
      ],
    },
    {
      name: "URL",
      type: TaskParamType.STRING,
      required: true,
      helperText: "https://api.example.com/endpoint",
    },
    {
      name: "Headers",
      type: TaskParamType.STRING,
      required: false,
      helperText: "JSON object with headers",
    },
    {
      name: "Body",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Request body (JSON, form data, etc.)",
    },
    {
      name: "Authentication",
      type: TaskParamType.CREDENTIAL,
      required: false,
    },
  ],
  outputs: [
    {
      name: "Response Body",
      type: TaskParamType.STRING,
      helperText: "HTTP response body content",
    },
    {
      name: "Status Code",
      type: TaskParamType.STRING,
      helperText: "HTTP status code (200, 404, etc.)",
    },
    {
      name: "Headers",
      type: TaskParamType.STRING,
      helperText: "Response headers as JSON object",
    },
  ],
} satisfies WorkflowTask;