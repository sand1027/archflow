"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TaskType } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon } from "lucide-react";

function TaskMenu() {
  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={[
          "core",
          "google",
          "communication",
          "ai",
          "data",
          "database",
          "storage",
          "utilities",
        ]}
      >
        <AccordionItem value="core">
          <AccordionTrigger className="font-bold">
            Core Triggers
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.START} />
            <TaskMenuButton taskType={TaskType.WEBHOOK} />
            <TaskMenuButton taskType={TaskType.SCHEDULE_TRIGGER} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="google">
          <AccordionTrigger className="font-bold">
            Google Workspace
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.GOOGLE_SHEETS} />
            <TaskMenuButton taskType={TaskType.GOOGLE_DOCS} />
            <TaskMenuButton taskType={TaskType.GOOGLE_DRIVE} />
            <TaskMenuButton taskType={TaskType.GOOGLE_CALENDAR} />
            <TaskMenuButton taskType={TaskType.GMAIL} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="communication">
          <AccordionTrigger className="font-bold">
            Communication
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.SLACK} />
            <TaskMenuButton taskType={TaskType.DISCORD} />
            <TaskMenuButton taskType={TaskType.EMAIL} />
            <TaskMenuButton taskType={TaskType.SMS} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ai">
          <AccordionTrigger className="font-bold">
            AI & ML
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.OPENAI} />
            <TaskMenuButton taskType={TaskType.ANTHROPIC} />
            <TaskMenuButton taskType={TaskType.HUGGING_FACE} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="data">
          <AccordionTrigger className="font-bold">
            Data Processing
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.HTTP_REQUEST} />
            <TaskMenuButton taskType={TaskType.JSON_PROCESSOR} />
            <TaskMenuButton taskType={TaskType.READ_PROPERTY_FROM_JSON} />
            <TaskMenuButton taskType={TaskType.ADD_PROPERTY_TO_JSON} />
            <TaskMenuButton taskType={TaskType.CODE} />
            <TaskMenuButton taskType={TaskType.ITEM_LISTS} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="database">
          <AccordionTrigger className="font-bold">
            Database
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.MONGODB} />
            <TaskMenuButton taskType={TaskType.MYSQL} />
            <TaskMenuButton taskType={TaskType.POSTGRESQL} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="storage">
          <AccordionTrigger className="font-bold">
            Storage
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.AWS_S3} />
            <TaskMenuButton taskType={TaskType.DROPBOX} />
            <TaskMenuButton taskType={TaskType.ONEDRIVE} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="utilities">
          <AccordionTrigger className="font-bold">
            Utilities
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.CONDITION} />
            <TaskMenuButton taskType={TaskType.SWITCH} />
            <TaskMenuButton taskType={TaskType.SET_VARIABLE} />
            <TaskMenuButton taskType={TaskType.WAIT} />
            <TaskMenuButton taskType={TaskType.DELAY} />
            <TaskMenuButton taskType={TaskType.DELIVER_VIA_WEBHOOK} />
            <TaskMenuButton taskType={TaskType.NOTION} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}

export default TaskMenu;

function TaskMenuButton({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType];
  
  if (!task || !task.icon) {
    return null;
  }
  
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow", taskType);
    event.dataTransfer.effectAllowed = "move";
  };
  
  return (
    <Button
      variant={"secondary"}
      className="flex justify-between items-center gap-2 border w-full"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
    </Button>
  );
}
