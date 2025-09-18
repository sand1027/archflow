"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskType } from "@/lib/types";
import { GripVertical } from "lucide-react";

interface CompactNodeProps {
  taskType: TaskType;
  className?: string;
}

export default function CompactNode({ taskType, className = "" }: CompactNodeProps) {
  const task = TaskRegistry[taskType];
  
  if (!task) return null;

  return (
    <Card className={`w-[200px] border shadow-sm hover:shadow-md transition-all ${className}`}>
      <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
        <task.icon size={14} className="text-primary" />
        <div className="flex items-center justify-between w-full min-w-0">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-xs truncate">{task.label}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {task.isEntryPoint && <Badge variant="secondary" className="text-xs px-1">T</Badge>}
            <GripVertical size={10} className="text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <div className="p-2 space-y-1">
        {task.inputs.length > 0 && (
          <div className="text-xs text-blue-600">
            {task.inputs.length} input{task.inputs.length > 1 ? 's' : ''}
          </div>
        )}
        <div className="text-xs text-green-600">
          {task.outputs.length} output{task.outputs.length > 1 ? 's' : ''}
        </div>
      </div>
    </Card>
  );
}