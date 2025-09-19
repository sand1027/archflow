import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, ListIcon } from "lucide-react";

export const ItemListsTask = {
  type: TaskType.ITEM_LISTS,
  label: "Item Lists",
  icon: (props: LucideProps) => <ListIcon {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Operation",
      type: TaskParamType.SELECT,
      required: true,
      options: [
        { label: "Split Out Items", value: "split" },
        { label: "Aggregate Items", value: "aggregate" },
        { label: "Remove Duplicates", value: "unique" },
        { label: "Sort Items", value: "sort" },
      ],
      helperText: "Choose list operation",
    },
    {
      name: "Input List",
      type: TaskParamType.STRING,
      required: true,
      helperText: "JSON array or comma-separated values",
    },
    {
      name: "Sort Field",
      type: TaskParamType.STRING,
      required: false,
      helperText: "Field to sort by (for objects)",
    },
  ],
  outputs: [
    {
      name: "Output",
      type: TaskParamType.STRING,
    },
    {
      name: "Count",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;