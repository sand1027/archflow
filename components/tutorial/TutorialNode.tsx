"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskType } from "@/lib/types";
import { GripVertical, Zap, Settings } from "lucide-react";

interface TutorialNodeProps {
  taskType: TaskType;
  className?: string;
}

export default function TutorialNode({ taskType, className = "" }: TutorialNodeProps) {
  const task = TaskRegistry[taskType];
  
  if (!task) return null;

  return (
    <div className="relative">
      <Card className={`w-[280px] border-2 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}>
        {/* Node Header */}
        <div className="flex items-center gap-2 p-2 border-b bg-gradient-to-r from-muted/50 to-muted/30">
          <div className="p-1.5 rounded bg-background shadow-sm">
            <task.icon size={16} className="text-primary" />
          </div>
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs truncate">{task.label}</p>
              <p className="text-xs text-muted-foreground">
                {task.isEntryPoint ? "Trigger" : "Action"}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {task.isEntryPoint && <Badge variant="secondary" className="text-xs px-1">T</Badge>}
              <GripVertical size={12} className="text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Inputs */}
        {task.inputs.length > 0 && (
          <div className="p-2 space-y-2">
            <div className="flex items-center gap-1 mb-1">
              <Settings size={12} className="text-blue-500" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">IN</span>
            </div>
            {task.inputs.slice(0, 2).map((input, idx) => (
              <div key={idx} className="relative pl-3">
                <div className="absolute -left-5 top-1 w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm"></div>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-medium truncate">{input.name}</span>
                    {input.required && <Badge variant="destructive" className="text-xs px-1">!</Badge>}
                  </div>
                  {(input as any).helperText && (
                    <p className="text-xs text-muted-foreground truncate">{(input as any).helperText}</p>
                  )}
                </div>
              </div>
            ))}
            {task.inputs.length > 2 && (
              <div className="text-xs text-muted-foreground text-center">+{task.inputs.length - 2} more</div>
            )}
          </div>
        )}

        {/* Outputs */}
        <div className="p-2 border-t bg-green-50/30 dark:bg-green-950/10 space-y-2">
          <div className="flex items-center gap-1 mb-1">
            <Zap size={12} className="text-green-500" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">OUT</span>
          </div>
          {task.outputs.slice(0, 2).map((output, idx) => (
            <div key={idx} className="relative pr-3">
              <div className="absolute -right-5 top-1 w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"></div>
              <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded border border-green-200 dark:border-green-800 text-right">
                <div className="flex items-center justify-end gap-1 mb-1">
                  <span className="text-xs font-medium truncate">{output.name}</span>
                </div>
                {(output as any).helperText && (
                  <p className="text-xs text-muted-foreground truncate">{(output as any).helperText}</p>
                )}
              </div>
            </div>
          ))}
          {task.outputs.length > 2 && (
            <div className="text-xs text-muted-foreground text-center">+{task.outputs.length - 2} more</div>
          )}
        </div>
      </Card>
    </div>
  );
}