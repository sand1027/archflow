"use client";

// Workflow type is now inferred from Mongoose model
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import Topbar from "./topbar/Topbar";
import TaskMenu from "./TaskMenu";
import { CollaborationPanel } from "./CollaborationPanel";
import { FlowValidationContextProvider } from "@/components/context/FlowValidationContext";
import { WorkflowStatus, CollaborationUser } from "@/lib/types";
import { useSession } from "next-auth/react";

function Editor({ workflow }: { workflow: any }) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <Topbar
            title="Workflow editor"
            subtitle={workflow.name}
            workflowId={workflow._id.toString()}
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
            workflow={workflow}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}

export default Editor;
