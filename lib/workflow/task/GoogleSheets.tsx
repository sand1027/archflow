import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { FileSpreadsheetIcon, LucideProps } from "lucide-react";

export const GoogleSheetsTask = {
  type: TaskType.GOOGLE_SHEETS,
  label: "Google Sheets",
  icon: (props: LucideProps) => (
    <FileSpreadsheetIcon className="stroke-green-600" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Action",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Read", value: "read" },
        { label: "Write", value: "write" },
        { label: "Update", value: "update" },
        { label: "Append", value: "append" },
        { label: "Clear", value: "clear" }
      ],
    },
    {
      name: "Spreadsheet ID",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Google Sheets spreadsheet ID",
    },
    {
      name: "Sheet Name",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Name of the sheet tab",
    },
    {
      name: "Range",
      type: TaskParamType.STRING,
      required: false,
      helperText: "A1:Z100 or leave empty for all data",
    },
    {
      name: "Data",
      type: TaskParamType.STRING,
      required: false,
      helperText: "JSON data to write/update",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
  ],
  outputs: [
    {
      name: "Data",
      type: TaskParamType.JSON,
    },
    {
      name: "Range",
      type: TaskParamType.STRING,
    },
    {
      name: "Spreadsheet ID",
      type: TaskParamType.STRING,
    },
    {
      name: "Updated Range",
      type: TaskParamType.STRING,
    },
    {
      name: "Updated Rows",
      type: TaskParamType.STRING,
    },
    {
      name: "Cleared Range",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;