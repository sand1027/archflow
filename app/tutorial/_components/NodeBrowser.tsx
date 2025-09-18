"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskType } from "@/lib/types";
import { BookOpen } from "lucide-react";
import NodeSidebar from "./NodeSidebar";
import NodeDisplay from "./NodeDisplay";

export default function NodeBrowser() {
  const [selectedNode, setSelectedNode] = useState<TaskType | null>(null);

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Interactive Node Browser
        </h2>
        <p className="text-muted-foreground text-lg">
          Explore every node with detailed information and visual examples
        </p>
      </div>

      <Card className="border-2 shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl">Node Explorer</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select any node from the sidebar to see its details, inputs, outputs, and connection examples
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-5 min-h-[700px]">
            {/* Sidebar - 2 columns */}
            <div className="lg:col-span-2 border-r bg-muted/20 p-4">
              <NodeSidebar 
                selectedNode={selectedNode} 
                onNodeSelect={setSelectedNode} 
              />
            </div>
            
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3 p-6 max-h-[700px] overflow-y-auto">
              <NodeDisplay selectedNode={selectedNode} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}