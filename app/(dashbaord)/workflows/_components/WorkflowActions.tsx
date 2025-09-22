"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, TrashIcon, ArrowUp } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";

function WorkflowActions({
  workflowName,
  workflowId,
  workflow,
}: {
  workflowName: string;
  workflowId: string;
  workflow: any;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  
  const handleExportWorkflow = () => {
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
      console.error('Export failed:', error);
      toast.error('Failed to export workflow');
    }
  };
  

  return (
    <Fragment>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <TooltipWrapper content="More actions">
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={handleExportWorkflow}
          >
            <ArrowUp size={18} />
            Export
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <TrashIcon size={18} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}

export default WorkflowActions;
