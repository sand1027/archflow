"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskType } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface NodeSidebarProps {
  selectedNode: TaskType | null;
  onNodeSelect: (nodeType: TaskType) => void;
}

const nodeCategories = {
  "Core Triggers": [TaskType.START, TaskType.WEBHOOK, TaskType.SCHEDULE_TRIGGER, TaskType.MANUAL_TRIGGER],
  "Google Workspace": [TaskType.GOOGLE_SHEETS, TaskType.GMAIL],
  "Communication": [TaskType.SLACK, TaskType.DISCORD],
  "AI & ML": [TaskType.OPENAI, TaskType.ANTHROPIC, TaskType.HUGGING_FACE],
  "Data Processing": [TaskType.HTTP_REQUEST, TaskType.JSON_PROCESSOR],
  "Database": [TaskType.MONGODB, TaskType.MYSQL, TaskType.POSTGRESQL],
  "Storage": [TaskType.AWS_S3, TaskType.DROPBOX, TaskType.ONEDRIVE],
  "Utilities": [TaskType.CONDITION, TaskType.DELAY, TaskType.NOTION]
};

export default function NodeSidebar({ selectedNode, onNodeSelect }: NodeSidebarProps) {
  return (
    <Card className="h-[700px] border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Node Library</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[620px]">
          <div className="space-y-4 p-4">
            {Object.entries(nodeCategories).map(([category, nodeTypes]) => (
              <div key={category}>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2 px-2">
                  {category}
                </h3>
                <div className="space-y-1">
                  {nodeTypes.map((nodeType) => {
                    const task = TaskRegistry[nodeType];
                    if (!task) return null;
                    
                    const IconComponent = task.icon;
                    const isSelected = selectedNode === nodeType;
                    
                    return (
                      <motion.button
                        key={nodeType}
                        onClick={() => onNodeSelect(nodeType)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all hover:bg-muted/50 ${
                          isSelected 
                            ? "bg-primary/10 border border-primary/20 shadow-sm" 
                            : "hover:bg-muted/30"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`p-1.5 rounded ${
                          isSelected ? "bg-primary/20" : "bg-muted"
                        }`}>
                          <IconComponent 
                            size={16} 
                            className={isSelected ? "text-primary" : "text-muted-foreground"} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium text-sm truncate ${
                              isSelected ? "text-primary" : ""
                            }`}>
                              {task.label}
                            </span>
                            {task.isEntryPoint && (
                              <Badge variant="secondary" className="text-xs">T</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-blue-600">
                              {task.inputs.length} in
                            </span>
                            <span className="text-xs text-green-600">
                              {task.outputs.length} out
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}