import connectDB from "@/lib/mongodb";
import { Workflow } from "@/schema/workflows";
import { serializeForClient } from "@/lib/serialize";
import { getCurrentUser } from "@/lib/auth-utils";
import React from "react";
import Editor from "../../_components/Editor";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

async function WorkflowEditorPage({
  params,
}: {
  params: { workflowId: string };
}) {
  const { workflowId } = params;

  const auth = await getCurrentUser();

  if (!auth) {
    redirect("/auth/signin");
  }

  const { userId } = auth;

  await connectDB();
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
