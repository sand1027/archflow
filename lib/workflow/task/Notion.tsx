import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { BookOpenIcon, LucideProps } from "lucide-react";

export const NotionTask = {
  type: TaskType.NOTION,
  label: "Notion",
  icon: (props: LucideProps) => (
    <BookOpenIcon className="stroke-gray-700" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Create Page", value: "create_page" },
        { label: "Update Page", value: "update_page" },
        { label: "Get Page", value: "get_page" },
        { label: "Query Database", value: "query_database" },
        { label: "Create Database Item", value: "create_db_item" },
        { label: "Update Database Item", value: "update_db_item" }
      ],
    },
    {
      name: "Database/Page ID",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Notion database or page ID",
    },
    {
      name: "Title",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Page title",
    },
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Page content or properties (JSON)",
    },
    {
      name: "Filter",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Query filter (JSON)",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Page ID",
      type: TaskParamType.STRING,
    },
    {
      name: "Data",
      type: TaskParamType.STRING,
    },
    {
      name: "URL",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;