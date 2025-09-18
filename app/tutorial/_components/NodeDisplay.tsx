"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskType } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { BookOpen } from "lucide-react";
import TutorialNode from "./TutorialNode";
import NodeDetails from "./NodeDetails";
import ConnectionGuide from "./ConnectionGuide";
import { motion, AnimatePresence } from "framer-motion";

interface NodeDisplayProps {
  selectedNode: TaskType | null;
}

export default function NodeDisplay({ selectedNode }: NodeDisplayProps) {
  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {selectedNode ? (
          <motion.div
            key={selectedNode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Node Visualization */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {(() => {
                    const task = TaskRegistry[selectedNode];
                    if (!task) return null;
                    const IconComponent = task.icon;
                    return (
                      <>
                        <IconComponent size={24} className="text-primary" />
                        <div>
                          <div className="flex items-center gap-2">
                            {task.label}
                            {task.isEntryPoint && (
                              <Badge variant="secondary">Trigger Node</Badge>
                            )}
                          </div>
                          <p className="text-sm font-normal text-muted-foreground mt-1">
                            {task.isEntryPoint 
                              ? "This node triggers workflow execution" 
                              : "This node processes data in your workflow"
                            }
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <TutorialNode taskType={selectedNode} className="border-primary shadow-xl" />
                  </motion.div>
                </div>
                
                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mt-6 grid grid-cols-2 gap-4"
                >
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {TaskRegistry[selectedNode]?.inputs.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Inputs</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {TaskRegistry[selectedNode]?.outputs.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Outputs</div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Node Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <NodeDetails taskType={selectedNode} />
            </motion.div>

            {/* Connection Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h3 className="text-xl font-bold mb-4">Connection Guide</h3>
              <ConnectionGuide sourceType={selectedNode} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-[500px] flex items-center justify-center border-2 border-dashed">
              <CardContent className="text-center p-8">
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
                <h3 className="text-2xl font-semibold mb-4">Select a Node to Explore</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Choose any node from the sidebar to see detailed information, 
                  visual representation, and connection examples.
                </p>
                <motion.div 
                  className="text-sm text-muted-foreground flex items-center justify-center gap-2"
                  animate={{ x: [-10, 0, -10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span>←</span>
                  <span>Browse nodes in the sidebar</span>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}