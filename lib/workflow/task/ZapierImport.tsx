import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Download, LucideProps } from "lucide-react";

export const ZapierImportTask = {
  type: TaskType.ZAPIER_IMPORT,
  label: "Zapier Import",
  icon: (props: LucideProps) => (
    <Download className="stroke-orange-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Zapier Export URL",
      type: TaskParamType.STRING,
      required: true,
      helperText: "URL to Zapier workflow export",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: false,
      helperText: "Optional Zapier API key for private workflows",
    },
  ],
  outputs: [
    {
      name: "Workflow JSON",
      type: TaskParamType.STRING,
      helperText: "Imported workflow configuration",
    },
    {
      name: "Import Status",
      type: TaskParamType.STRING,
      helperText: "Import operation status",
    },
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;