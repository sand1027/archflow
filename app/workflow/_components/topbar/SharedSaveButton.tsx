"use client";

import { updateSharedWorkFlow } from "@/actions/workflows";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function SharedSaveButton({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: updateSharedWorkFlow,
    onSuccess: () => {
      toast.success("Shared workflow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Failed to save workflow", { id: "save-workflow" });
    },
  });

  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDef = JSON.stringify(toObject());
        toast.loading("Saving Workflow", { id: "save-workflow" });
        saveMutation.mutate({
          id: workflowId,
          definition: workflowDef,
        });
      }}
      disabled={saveMutation.isPending}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}

export default SharedSaveButton;