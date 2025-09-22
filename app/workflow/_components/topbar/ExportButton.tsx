"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { toast } from "sonner";

interface ExportButtonProps {
  workflow: any;
}

function ExportButton({ workflow }: ExportButtonProps) {
  const handleExport = () => {
    try {
      const exportData = {
        name: workflow.name,
        description: workflow.description,
        definition: workflow.definition,
        status: workflow.status,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${workflow.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-workflow.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Workflow exported successfully');
    } catch (error) {
      toast.error('Failed to export workflow');
    }
  };

  return (
    <TooltipWrapper content="Export workflow">
      <Button variant="outline" size="sm" onClick={handleExport}>
        <ArrowUp className="w-4 h-4" />
      </Button>
    </TooltipWrapper>
  );
}

export default ExportButton;