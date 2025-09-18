"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskType } from "@/lib/types";
import { ArrowRight, Target } from "lucide-react";
import ConnectionDemo from "./ConnectionDemo";
import { motion } from "framer-motion";

interface ConnectionGuideProps {
  sourceType: TaskType;
}

const connectionMap: Record<TaskType, TaskType[]> = {
  [TaskType.START]: [TaskType.HTTP_REQUEST, TaskType.OPENAI, TaskType.GOOGLE_SHEETS, TaskType.SLACK, TaskType.CONDITION],
  [TaskType.WEBHOOK]: [TaskType.CONDITION, TaskType.GOOGLE_SHEETS, TaskType.SLACK, TaskType.OPENAI, TaskType.HTTP_REQUEST],
  [TaskType.SCHEDULE_TRIGGER]: [TaskType.OPENAI, TaskType.HTTP_REQUEST, TaskType.GOOGLE_SHEETS, TaskType.GMAIL, TaskType.NOTION],
  [TaskType.HTTP_REQUEST]: [TaskType.JSON_PROCESSOR, TaskType.GOOGLE_SHEETS, TaskType.SLACK, TaskType.OPENAI, TaskType.CONDITION],
  [TaskType.OPENAI]: [TaskType.NOTION, TaskType.GMAIL, TaskType.SLACK, TaskType.GOOGLE_SHEETS, TaskType.DISCORD],
  [TaskType.GOOGLE_SHEETS]: [TaskType.SLACK, TaskType.GMAIL, TaskType.OPENAI, TaskType.HTTP_REQUEST, TaskType.CONDITION],
  [TaskType.SLACK]: [],
  [TaskType.GMAIL]: [],
  [TaskType.CONDITION]: [TaskType.SLACK, TaskType.GMAIL, TaskType.GOOGLE_SHEETS, TaskType.HTTP_REQUEST],
  [TaskType.JSON_PROCESSOR]: [TaskType.GOOGLE_SHEETS, TaskType.SLACK, TaskType.NOTION, TaskType.HTTP_REQUEST],
  [TaskType.NOTION]: [TaskType.GMAIL, TaskType.SLACK],
  [TaskType.DISCORD]: [],
  [TaskType.ANTHROPIC]: [TaskType.NOTION, TaskType.GMAIL, TaskType.SLACK, TaskType.GOOGLE_SHEETS],
  [TaskType.HUGGING_FACE]: [TaskType.NOTION, TaskType.GMAIL, TaskType.SLACK, TaskType.GOOGLE_SHEETS],
  [TaskType.MANUAL_TRIGGER]: [TaskType.HTTP_REQUEST, TaskType.OPENAI, TaskType.GOOGLE_SHEETS],
  [TaskType.DELAY]: [TaskType.SLACK, TaskType.GMAIL, TaskType.HTTP_REQUEST]
};

const inputConnectionMap: Record<TaskType, Record<string, string[]>> = {
  [TaskType.HTTP_REQUEST]: {
    "URL": ["Any STRING output", "Manual input"],
    "Headers": ["JSON data", "Manual JSON input"],
    "Body": ["JSON data", "Form data", "Raw text"]
  },
  [TaskType.OPENAI]: {
    "Prompt": ["Any STRING output", "HTTP Response Body", "Google Sheets Data"],
    "Model": ["Manual selection"],
    "Credentials": ["OpenAI API Key"]
  },
  [TaskType.GOOGLE_SHEETS]: {
    "Spreadsheet ID": ["Manual input"],
    "Data": ["HTTP Response Body", "OpenAI Response", "JSON Processor output"],
    "Credentials": ["Google OAuth"]
  },
  [TaskType.SLACK]: {
    "Channel": ["Manual input"],
    "Message": ["OpenAI Response", "HTTP Response Body", "Google Sheets Data"],
    "Credentials": ["Slack Bot Token"]
  }
};

export default function ConnectionGuide({ sourceType }: ConnectionGuideProps) {
  const sourceTask = TaskRegistry[sourceType];
  const canConnectTo = connectionMap[sourceType] || [];
  const inputGuide = inputConnectionMap[sourceType];

  if (!sourceTask) return null;

  const getConnectionReason = (source: TaskType, target: TaskType): string => {
    const reasons: Record<string, string> = {
      [`${TaskType.START}-${TaskType.HTTP_REQUEST}`]: "Trigger API calls",
      [`${TaskType.START}-${TaskType.OPENAI}`]: "Generate AI content",
      [`${TaskType.HTTP_REQUEST}-${TaskType.JSON_PROCESSOR}`]: "Process API response",
      [`${TaskType.HTTP_REQUEST}-${TaskType.GOOGLE_SHEETS}`]: "Save API data",
      [`${TaskType.OPENAI}-${TaskType.NOTION}`]: "Save AI content",
      [`${TaskType.OPENAI}-${TaskType.SLACK}`]: "Share AI response",
      [`${TaskType.GOOGLE_SHEETS}-${TaskType.SLACK}`]: "Notify with data",
      [`${TaskType.WEBHOOK}-${TaskType.CONDITION}`]: "Process webhook data",
      [`${TaskType.CONDITION}-${TaskType.SLACK}`]: "Conditional notifications"
    };
    
    return reasons[`${source}-${target}`] || "Process and forward data";
  };

  const getConnectionDemo = (sourceType: TaskType) => {
    const demos = {
      [TaskType.START]: {
        targetType: TaskType.HTTP_REQUEST,
        sourceOutput: "trigger",
        targetInput: "URL",
        description: "Connect Start trigger to HTTP Request URL input"
      },
      [TaskType.WEBHOOK]: {
        targetType: TaskType.CONDITION,
        sourceOutput: "Body",
        targetInput: "Value",
        description: "Connect Webhook body data to Condition for processing"
      },
      [TaskType.HTTP_REQUEST]: {
        targetType: TaskType.JSON_PROCESSOR,
        sourceOutput: "Response Body",
        targetInput: "JSON",
        description: "Connect HTTP response to JSON Processor for parsing"
      },
      [TaskType.OPENAI]: {
        targetType: TaskType.SLACK,
        sourceOutput: "Response",
        targetInput: "Message",
        description: "Connect AI response to Slack message input"
      }
    };
    return demos[sourceType];
  };

  const demo = getConnectionDemo(sourceType);

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Connection Demo */}
      {demo && (
        <ConnectionDemo
          sourceType={sourceType}
          targetType={demo.targetType}
          sourceOutput={demo.sourceOutput}
          targetInput={demo.targetInput}
          description={demo.description}
        />
      )}

      {/* What this node connects to */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-green-500" />
            Can Connect To
          </CardTitle>
        </CardHeader>
        <CardContent>
          {canConnectTo.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {canConnectTo.slice(0, 5).map((targetType) => {
                const targetTask = TaskRegistry[targetType];
                if (!targetTask) return null;
                
                return (
                  <div key={targetType} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded">
                      <targetTask.icon size={16} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{targetTask.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {getConnectionReason(sourceType, targetType)}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-green-500" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <div className="text-sm">This is typically an end node</div>
              <div className="text-xs">No further connections needed</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input connection guide */}
      {inputGuide && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ArrowRight className="h-5 w-5 text-blue-500" />
              Input Connection Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(inputGuide).map(([inputName, sources]) => (
                <div key={inputName} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="font-medium text-sm mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    {inputName}
                  </div>
                  <div className="space-y-1">
                    {sources.map((source, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        {source}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}