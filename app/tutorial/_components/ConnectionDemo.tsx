"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskType } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface ConnectionDemoProps {
  sourceType: TaskType;
  targetType: TaskType;
  sourceOutput: string;
  targetInput: string;
  description: string;
}

export default function ConnectionDemo({ 
  sourceType, 
  targetType, 
  sourceOutput, 
  targetInput, 
  description 
}: ConnectionDemoProps) {
  const sourceTask = TaskRegistry[sourceType];
  const targetTask = TaskRegistry[targetType];

  if (!sourceTask || !targetTask) return null;

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          Connection Example
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-8">
          {/* Source Node */}
          <div className="relative">
            <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center gap-2 mb-2">
                <sourceTask.icon size={16} className="text-green-600" />
                <span className="font-semibold text-sm">{sourceTask.label}</span>
              </div>
              <div className="text-xs text-muted-foreground">Output:</div>
              <div className="font-medium text-sm text-green-700 dark:text-green-400">
                {sourceOutput}
              </div>
            </div>
            {/* Output Connection Point */}
            <motion.div 
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Connection Arrow */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div 
              className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 1, duration: 1 }}
            />
            <ArrowRight className="h-6 w-6 text-primary" />
          </motion.div>

          {/* Target Node */}
          <div className="relative">
            <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 mb-2">
                <targetTask.icon size={16} className="text-blue-600" />
                <span className="font-semibold text-sm">{targetTask.label}</span>
              </div>
              <div className="text-xs text-muted-foreground">Input:</div>
              <div className="font-medium text-sm text-blue-700 dark:text-blue-400">
                {targetInput}
              </div>
            </div>
            {/* Input Connection Point */}
            <motion.div 
              className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Connection Steps */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">How to Connect:</h4>
          <ol className="text-sm space-y-1 text-muted-foreground">
            <li>1. Drag from the <span className="text-green-600 font-medium">{sourceOutput}</span> output (green circle)</li>
            <li>2. Drop on the <span className="text-blue-600 font-medium">{targetInput}</span> input (blue circle)</li>
            <li>3. The connection will automatically transfer data between nodes</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}