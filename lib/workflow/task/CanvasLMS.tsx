import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { GraduationCap, LucideProps } from "lucide-react";

export const CanvasLMSTask = {
  type: TaskType.CANVAS_LMS,
  label: "Canvas LMS",
  icon: (props: LucideProps) => (
    <GraduationCap className="stroke-indigo-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Canvas URL",
      type: TaskParamType.STRING,
      required: true,
      helperText: "Your Canvas instance URL (e.g., school.instructure.com)",
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Action",
      type: TaskParamType.SELECT,
      options: [
        { label: "Get Assignments", value: "assignments" },
        { label: "Get Grades", value: "grades" },
        { label: "Get Courses", value: "courses" },
        { label: "Submit Assignment", value: "submit" },
      ],
      required: true,
    },
    {
      name: "Course ID",
      type: TaskParamType.STRING,
      helperText: "Course ID (required for assignments/grades)",
    },
  ],
  outputs: [
    {
      name: "Data",
      type: TaskParamType.STRING,
      helperText: "Canvas API response data",
    },
    {
      name: "Status",
      type: TaskParamType.STRING,
      helperText: "API request status",
    },
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;