import initDB, { Workflow } from "@/lib/prisma";
import { serializeForClient } from "@/lib/serialize";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import Editor from "../../_components/Editor";

async function WorkflowEditorPage({
  params,
}: {
  params: { workflowId: string };
}) {
  const { workflowId } = params;

  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthenticated</div>;
  }

  await initDB();
  const workflow = await Workflow.findOne({
    _id: workflowId,
    userId,
  }).lean();
  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return <Editor workflow={serializeForClient(workflow)} />;
}

export default WorkflowEditorPage;
