"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskType } from "@/lib/types";
import TutorialNode from "./TutorialNode";
import { ArrowRight, Play, Lightbulb } from "lucide-react";

interface WorkflowExampleProps {
  title: string;
  description: string;
  nodes: TaskType[];
  connections?: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  useCase?: string;
}

export default function WorkflowExample({ title, description, nodes, connections, difficulty = "Beginner", useCase }: WorkflowExampleProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card className="w-full border-2 hover:border-primary/50 transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
            </div>
            <p className="text-muted-foreground">{description}</p>
            {useCase && (
              <div className="flex items-center gap-2 mt-2">
                <Lightbulb size={14} className="text-amber-500" />
                <span className="text-sm text-amber-700 dark:text-amber-400">{useCase}</span>
              </div>
            )}
          </div>
          <Play className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Workflow Visualization */}
        <div className="relative">
          <div className="flex items-center gap-6 overflow-x-auto py-8 px-4">
            {nodes.map((nodeType, idx) => (
              <div key={nodeType} className="flex items-center gap-6 flex-shrink-0">
                <div className="relative flex-shrink-0">
                  <TutorialNode taskType={nodeType} className="hover:scale-105 transition-transform" />
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                    {idx + 1}
                  </div>
                </div>
                {idx < nodes.length - 1 && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center">
                      <div className="w-12 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></div>
                      <ArrowRight className="h-5 w-5 text-primary ml-1" />
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Step {idx + 1} → {idx + 2}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Connection Flow Details */}
        {connections && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500" />
                Data Flow
              </h4>
              <ul className="space-y-2">
                {connections.map((connection, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                      {idx + 1}
                    </div>
                    <span>{connection}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-green-500" />
                Key Benefits
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Automated data processing
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Real-time notifications
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Scalable workflow
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Error handling included
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}