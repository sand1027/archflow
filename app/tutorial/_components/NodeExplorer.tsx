"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TaskType } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { BookOpen, ChevronDown } from "lucide-react";
import TutorialNode from "./TutorialNode";
import NodeDetails from "./NodeDetails";
import ConnectionGuide from "./ConnectionGuide";
import { motion, AnimatePresence } from "framer-motion";

const nodeCategories = {
  "Core Triggers": [TaskType.START, TaskType.WEBHOOK, TaskType.SCHEDULE_TRIGGER, TaskType.MANUAL_TRIGGER],
  "Google Workspace": [TaskType.GOOGLE_SHEETS, TaskType.GMAIL],
  "Communication": [TaskType.SLACK, TaskType.DISCORD],
  "AI & ML": [TaskType.OPENAI, TaskType.ANTHROPIC, TaskType.HUGGING_FACE],
  "Data Processing": [TaskType.HTTP_REQUEST, TaskType.JSON_PROCESSOR],
  "Utilities": [TaskType.CONDITION, TaskType.DELAY, TaskType.NOTION]
};

export default function NodeExplorer() {
  const [selectedNode, setSelectedNode] = useState<TaskType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Core Triggers");

  const allNodes = Object.entries(nodeCategories).flatMap(([category, nodes]) => 
    nodes.map(node => ({ node, category }))
  );

  const currentCategoryNodes = nodeCategories[selectedCategory as keyof typeof nodeCategories] || [];

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Interactive Node Explorer
        </h2>
        <p className="text-muted-foreground text-lg">Explore any node with detailed information and connection guides</p>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-xl">Node Explorer</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Category Selector */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(nodeCategories).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Node Selector */}
              <Select 
                value={selectedNode || ""} 
                onValueChange={(value) => setSelectedNode(value as TaskType)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select a node" />
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent>
                  {currentCategoryNodes.map((nodeType) => {
                    const task = TaskRegistry[nodeType];
                    if (!task) return null;
                    const IconComponent = task.icon;
                    return (
                      <SelectItem key={nodeType} value={nodeType}>
                        <div className="flex items-center gap-2">
                          <IconComponent size={16} />
                          {task.label}
                          {task.isEntryPoint && (
                            <Badge variant="secondary" className="text-xs ml-1">Trigger</Badge>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {/* Left Side - Node Visualization */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Node Visualization</h3>
                    <div className="flex justify-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                      >
                        <TutorialNode taskType={selectedNode} className="border-primary shadow-xl" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {TaskRegistry[selectedNode] && (() => {
                            const task = TaskRegistry[selectedNode];
                            const IconComponent = task.icon;
                            return (
                              <>
                                <IconComponent size={20} className="text-primary" />
                                <h4 className="font-semibold">{task.label}</h4>
                                {task.isEntryPoint && (
                                  <Badge variant="secondary">Trigger Node</Badge>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Inputs:</span>
                            <span className="ml-2 font-medium text-blue-600">
                              {TaskRegistry[selectedNode]?.inputs.length || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Outputs:</span>
                            <span className="ml-2 font-medium text-green-600">
                              {TaskRegistry[selectedNode]?.outputs.length || 0}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Right Side - Details and Connection Guide */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <NodeDetails taskType={selectedNode} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold mb-4">Connection Guide</h3>
                    <ConnectionGuide sourceType={selectedNode} />
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <BookOpen className="h-20 w-20 mx-auto mb-6 text-muted-foreground/50" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4">Choose a Node to Explore</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Select a category and then pick a specific node to see detailed information, 
                  connection examples, and setup instructions.
                </p>
                <motion.div 
                  className="text-sm text-muted-foreground flex items-center justify-center gap-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span>↑</span>
                  <span>Use the dropdowns above to get started</span>
                  <span>↑</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}