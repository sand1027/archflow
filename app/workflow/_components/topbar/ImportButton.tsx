"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";

function ImportButton() {
  const { setNodes, setEdges } = useReactFlow();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      if (file.type !== 'application/json') {
        toast.error('Please select a JSON file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const workflowData = JSON.parse(content);
          
          if (!workflowData.definition) {
            toast.error('Invalid workflow file format');
            return;
          }
          
          const flow = JSON.parse(workflowData.definition);
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          
          toast.success('Workflow imported successfully');
        } catch (error) {
          toast.error('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <TooltipWrapper content="Import workflow">
      <Button variant="outline" size="sm" onClick={handleImport}>
        <ArrowDown className="w-4 h-4" />
      </Button>
    </TooltipWrapper>
  );
}

export default ImportButton;