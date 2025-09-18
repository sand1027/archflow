"use server";

import { calculateWorkflowCost } from "@/lib/helper";
import { serializeForClient } from "@/lib/serialize";
import initDB, { Workflow, WorkflowExecution, ExecutionPhase, ExecutionLog } from "@/lib/prisma";
import { AppNode, TaskType, WorkflowStatus } from "@/lib/types";
import { createFlowNode } from "@/lib/workflow/CreateFlowNode";
import { flowToExecutionPlan } from "@/lib/workflow/executionPlan";
import {
  createWorkflowShema,
  createWorkflowShemaType,
  duplicateWorkflowSchemaType,
} from "@/schema/workflows";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import parser from "cron-parser";

export async function getWorkflowsForUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }
  await initDB();
  return Workflow.find({ userId }).sort({ createdAt: 1 }).lean();
}

export async function createWorkflow(form: createWorkflowShemaType) {
  const { success, data } = createWorkflowShema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    const initWorkflow: { nodes: AppNode[]; edges: Edge[] } = {
      nodes: [],
      edges: [],
    };
    initWorkflow.nodes.push(createFlowNode(TaskType.START));
    await initDB();
    const result = await Workflow.create({
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initWorkflow),
      ...data,
    });
    if (!result) {
      throw new Error("Failed to create workflow");
    }

    redirect(`/workflow/editor/${result._id}`);
  } catch (error: any) {
    // Don't catch Next.js redirect errors
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Error creating workflow:', error);
    if (error.code === 11000) {
      throw new Error("A workflow with this name already exists");
    }
    throw new Error("Failed to create workflow: " + error.message);
  }
}

export async function deleteWorkflow(workflowId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  await Workflow.findOneAndDelete({ _id: workflowId, userId });

  revalidatePath("/workflows");
}

export async function updateWorkFlow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  const workflow = await Workflow.findOne({ _id: id, userId });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not draft");
  }

  await Workflow.findOneAndUpdate(
    { _id: id, userId },
    { definition, updatedAt: new Date() }
  );
  revalidatePath("/workflows");
}

export async function getWorkflowExecutionWithPhases(executionId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  const execution = await WorkflowExecution.findOne({ _id: executionId, userId }).lean();
  if (!execution) return null;
  
  const phases = await ExecutionPhase.find({ workflowExecutionId: executionId }).sort({ number: 1 }).lean() as any[];
  return serializeForClient({ ...execution, phases });
}

export async function getWorkflowPhaseDetails(phaseId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  if (!phaseId || phaseId.trim() === "") {
    return null;
  }

  await initDB();
  const phase = await ExecutionPhase.findOne({ _id: phaseId }).lean() as any;
  if (!phase) return null;
  
  const execution = await WorkflowExecution.findOne({ _id: phase.workflowExecutionId, userId }).lean();
  if (!execution) return null;
  
  const logs = await ExecutionLog.find({ executionPhaseId: phaseId }).sort({ timestamp: 1 }).lean();
  return serializeForClient({ ...phase, logs });
}

export async function getWorkflowExecutions(workflowId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  return await WorkflowExecution.find({ workflowId, userId }).sort({ createdAt: 1 }).lean();
}

export async function publishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  const workflow = await Workflow.findOne({ _id: id, userId });
  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not draft");
  }

  const flow = JSON.parse(flowDefinition);

  const result = flowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    throw new Error("Flow definition not valid");
  }

  if (!result.executionPlan) {
    throw new Error("Something went wrong, No eexecution plan generated");
  }

  const creditsCost = calculateWorkflowCost(flow.nodes);

  await Workflow.findOneAndUpdate(
    { _id: id, userId },
    {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED,
      updatedAt: new Date()
    }
  );
  revalidatePath(`/worflow/editor/${id}`);
}

export async function unPublishWorkflow(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }
  await initDB();
  const workflow = await Workflow.findOne({ _id: id, userId });
  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("Workflow is not published");
  }

  await Workflow.findOneAndUpdate(
    { _id: id, userId },
    {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
      updatedAt: new Date()
    }
  );
  revalidatePath(`/worflow/editor/${id}`);
}

export async function updateWorkFlowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  try {
    await initDB();
    const interval = parser.parseExpression(cron, { utc: true });
    await Workflow.findOneAndUpdate(
      { _id: id, userId },
      {
        cron,
        nextRunAt: interval.next().toDate(),
        updatedAt: new Date()
      }
    );
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Invalid cron expression");
  }
  revalidatePath("/workflows");
}

export async function removeWorkflowSchedule(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }
  await initDB();
  await Workflow.findOneAndUpdate(
    { _id: id, userId },
    {
      cron: null,
      nextRunAt: null,
      updatedAt: new Date()
    }
  );
  revalidatePath("/workflows");
}

export async function duplicateWorkflow(form: duplicateWorkflowSchemaType) {
  const { success, data } = createWorkflowShema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  const sourceWorkflow = await Workflow.findOne({ _id: form.workflowId, userId });

  if (!sourceWorkflow) {
    throw new Error("Workflow not found");
  }

  const result = await Workflow.create({
    userId,
    status: WorkflowStatus.DRAFT,
    name: data.name,
    description: data.description,
    definition: sourceWorkflow.definition,
  });
  if (!result) {
    throw new Error("Failed to duplicate workflow");
  }

  redirect("/workflows");
}