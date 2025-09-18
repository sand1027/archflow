"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskType } from "@/lib/types";
import { Settings, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface NodeDetailsProps {
  taskType: TaskType;
}

export default function NodeDetails({ taskType }: NodeDetailsProps) {
  const task = TaskRegistry[taskType];
  
  if (!task) return null;

  const getSetupSteps = (nodeType: TaskType): string[] => {
    const steps = {
      [TaskType.START]: [
        "Drag the Start node to your canvas",
        "This node requires no configuration",
        "Connect its 'trigger' output to any action node",
        "Click Execute to run your workflow"
      ],
      [TaskType.WEBHOOK]: [
        "Add Webhook node to canvas",
        "Optionally set a custom path in inputs",
        "Publish your workflow to get webhook URL",
        "Send HTTP requests to trigger the workflow"
      ],
      [TaskType.HTTP_REQUEST]: [
        "Select HTTP method (GET, POST, PUT, DELETE, PATCH)",
        "Enter the target URL",
        "Add headers as JSON object if needed",
        "Add request body for POST/PUT requests"
      ],
      [TaskType.OPENAI]: [
        "Add your OpenAI API key in credentials",
        "Select the AI model (GPT-4, GPT-3.5, etc.)",
        "Write your prompt or connect from previous node",
        "Set temperature and max tokens if needed"
      ]
    };
    return steps[nodeType] || [
      "Drag the node to your canvas",
      "Configure the required inputs",
      "Connect to other nodes as needed",
      "Test your workflow"
    ];
  };

  const getConnectionExamples = (nodeType: TaskType): string[] => {
    const examples = {
      [TaskType.START]: [
        "Start → HTTP Request (Fetch data from API)",
        "Start → OpenAI → Slack (Generate AI content and send to Slack)"
      ],
      [TaskType.WEBHOOK]: [
        "Webhook → Condition → Slack (Process webhook conditionally)",
        "Webhook → Google Sheets (Save webhook data to spreadsheet)"
      ],
      [TaskType.HTTP_REQUEST]: [
        "HTTP Request → JSON Processor (Parse API response)",
        "HTTP Request → Google Sheets (Save API data)"
      ],
      [TaskType.OPENAI]: [
        "OpenAI → Notion (Save AI content to Notion)",
        "OpenAI → Gmail (Send AI-generated email)"
      ]
    };
    return examples[nodeType] || ["Connect to any compatible node"];
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Inputs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Inputs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {task.inputs.length > 0 ? (
            <div className="space-y-3">
              {task.inputs.map((input, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{input.name}</span>
                    <div className="flex items-center gap-2">
                      {input.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                      <Badge variant="outline">{input.type}</Badge>
                    </div>
                  </div>
                  {input.helperText && (
                    <p className="text-sm text-muted-foreground">{input.helperText}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No inputs required</p>
          )}
        </CardContent>
      </Card>

      {/* Outputs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5" />
            Outputs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {task.outputs.map((output, idx) => (
              <div key={idx} className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{output.name}</span>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900">{output.type}</Badge>
                </div>
                {output.helperText && (
                  <p className="text-sm text-muted-foreground">{output.helperText}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Setup Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getSetupSteps(taskType).map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowRight className="h-5 w-5" />
            Connection Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getConnectionExamples(taskType).map((example, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <ArrowRight className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-mono">{example}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}