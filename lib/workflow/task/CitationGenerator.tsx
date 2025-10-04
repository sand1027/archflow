import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Quote, LucideProps } from "lucide-react";

export const CitationGeneratorTask = {
  type: TaskType.CITATION_GENERATOR,
  label: "Citation Generator",
  icon: (props: LucideProps) => (
    <Quote className="stroke-amber-500" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "URL",
      type: TaskParamType.STRING,
      required: true,
      helperText: "URL of the source to cite",
    },
    {
      name: "Citation Style",
      type: TaskParamType.SELECT,
      options: [
        { label: "APA", value: "apa" },
        { label: "MLA", value: "mla" },
        { label: "Chicago", value: "chicago" },
        { label: "Harvard", value: "harvard" },
      ],
      required: true,
    },
    {
      name: "Source Type",
      type: TaskParamType.SELECT,
      options: [
        { label: "Website", value: "website" },
        { label: "Journal Article", value: "journal" },
        { label: "Book", value: "book" },
        { label: "News Article", value: "news" },
      ],
      required: true,
    },
  ],
  outputs: [
    {
      name: "Citation",
      type: TaskParamType.STRING,
      helperText: "Formatted citation",
    },
    {
      name: "Bibliography Entry",
      type: TaskParamType.STRING,
      helperText: "Bibliography format",
    },
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
} satisfies WorkflowTask;