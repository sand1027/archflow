"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { TaskType } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CoinsIcon, Wand2, Brain, Zap } from "lucide-react";
import { ReinforcementWorkflowAI } from "@/lib/workflow-ai-engine";
import { toast } from "sonner";
import { createFlowNode } from "@/lib/workflow/CreateFlowNode";
import { useReactFlow } from "@xyflow/react";

const ai = new ReinforcementWorkflowAI();

function TaskMenu() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { setNodes, setEdges } = useReactFlow();

  const generateAIWorkflow = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a workflow description");
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const workflow = ai.generateWorkflow(aiPrompt);
    setGeneratedWorkflow(workflow);
    setIsGenerating(false);
    
    toast.success("AI workflow generated!");
  };

  const addToCanvas = () => {
    if (generatedWorkflow) {
      try {
        // Convert AI nodes to ReactFlow nodes with matching IDs
        const flowNodes = generatedWorkflow.nodes.map((node: any) => {
          const flowNode = createFlowNode(node.type, node.position);
          return {
            ...flowNode,
            id: node.id, // Use AI-generated ID
            position: node.position, // Ensure position is preserved
            data: {
              ...flowNode.data,
              ...node.data // Preserve AI-generated data including inputs
            }
          };
        });
        
        // Convert AI edges to ReactFlow edges
        const flowEdges = generatedWorkflow.edges.map((edge: any) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          animated: true
        }));
        
        // Add to canvas
        setNodes(flowNodes);
        setEdges(flowEdges);
        
        // Record successful workflow generation
        ai.recordSuccess(aiPrompt, true);
        
        toast.success(`${generatedWorkflow.title} added to canvas!`);
        setGeneratedWorkflow(null);
        setAiPrompt("");
      } catch (error) {
        // Record failed workflow generation
        ai.recordSuccess(aiPrompt, false);
        toast.error("Failed to add workflow to canvas");
        console.error("Canvas integration error:", error);
      }
    }
  };

  const provideFeedback = (helpful: boolean) => {
    if (generatedWorkflow) {
      generatedWorkflow.nodes.forEach((node: any) => {
        ai.recordNodeFeedback(node.type, helpful);
      });
      toast.success(helpful ? "Thanks for the positive feedback!" : "Thanks for the feedback, we'll improve!");
    }
  };

  return (
    <aside className="w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full overflow-hidden">
      <Tabs defaultValue="nodes" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2 m-2">
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nodes" className="flex-1 overflow-auto p-2 px-4">
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
              "education",
              "productivity",
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
            <TaskMenuButton taskType={TaskType.MICROSOFT_TEAMS} />
            <TaskMenuButton taskType={TaskType.WHATSAPP} />
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
            <TaskMenuButton taskType={TaskType.AI_WORKFLOW_BUILDER} />
            <TaskMenuButton taskType={TaskType.SMART_NODE_SUGGESTIONS} />
            <TaskMenuButton taskType={TaskType.AI_DATA_TRANSFORMER} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="data">
          <AccordionTrigger className="font-bold">
            Data Processing
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.HTTP_REQUEST} />
            <TaskMenuButton taskType={TaskType.JSON_PROCESSOR} />
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
        <AccordionItem value="education">
          <AccordionTrigger className="font-bold">
            Education
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.CANVAS_LMS} />
            <TaskMenuButton taskType={TaskType.CITATION_GENERATOR} />
            <TaskMenuButton taskType={TaskType.STUDY_TIMER} />
            <TaskMenuButton taskType={TaskType.ZOOM} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="productivity">
          <AccordionTrigger className="font-bold">
            Productivity
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuButton taskType={TaskType.NOTION} />
            <TaskMenuButton taskType={TaskType.ZAPIER_IMPORT} />
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
          </AccordionContent>
        </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="ai" className="flex-1 overflow-auto p-4 space-y-4">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-purple-800 text-sm">AI Workflow Builder</h3>
              </div>
              <p className="text-xs text-purple-700">
                Describe your workflow and AI will generate nodes with connections
              </p>
            </div>
            
            <div className="space-y-3">
              <Textarea
                placeholder="e.g., Send daily email reports from Google Sheets data"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              
              <Button 
                onClick={generateAIWorkflow}
                disabled={isGenerating}
                className="w-full"
                size="sm"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Workflow"}
              </Button>
            </div>
            
            {generatedWorkflow && (
              <Card className="p-3 space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">{generatedWorkflow.title}</h4>
                  <p className="text-xs text-muted-foreground">{generatedWorkflow.description}</p>
                </div>
                
                <div>
                  <p className="text-xs font-medium mb-2">Nodes ({generatedWorkflow.nodes.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {generatedWorkflow.nodes.map((node: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {node.data.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    {Math.round(generatedWorkflow.confidence * 100)}% confidence
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {generatedWorkflow.usage} uses
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={addToCanvas}
                    size="sm"
                    className="w-full"
                  >
                    Add to Canvas
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => provideFeedback(true)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-green-600 border-green-200"
                    >
                      👍 Helpful
                    </Button>
                    <Button 
                      onClick={() => provideFeedback(false)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200"
                    >
                      👎 Not Helpful
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            <div className="space-y-2">
              <p className="text-xs font-medium">Quick Examples:</p>
              {[
                "Email automation with AI replies",
                "Daily data processing pipeline",
                "Social media content scheduler"
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs h-auto p-2 text-left justify-start"
                  onClick={() => setAiPrompt(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
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
