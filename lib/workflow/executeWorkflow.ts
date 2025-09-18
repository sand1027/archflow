import { revalidatePath } from "next/cache";
import "server-only";
import initDB, { WorkflowExecution, Workflow, ExecutionPhase, ExecutionLog } from "../prisma";
import {
  AppNode,
  Enviornment,
  ExecutionEnviornment,
  ExecutionPhaseStatus,
  LogCollector,
  TaskParamType,
  WorkflowExecutionStatus,
} from "../types";
import { TaskRegistry } from "./task/Registry";
import { ExecutorRegistry } from "./executor/Registry";
// import { CloudBrowser, CloudPage } from "../puppeteer";

// type Browser = CloudBrowser;
// type Page = CloudPage;
import { Edge } from "@xyflow/react";
import { createLogCollector } from "../log";

export async function executeWorkflow(executionId: string, nextRunAt?: Date) {
  await initDB();
  const execution = await WorkflowExecution.findById(executionId);
  if (!execution) {
    throw new Error("Execution not found");
  }

  const workflow = await Workflow.findById(execution.workflowId);
  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const phases = await ExecutionPhase.find({ workflowExecutionId: executionId }).sort({ number: 1 });
  const edges = JSON.parse(execution.definition).edges as Edge[];

  const enviornment = { phases: {} };
  await initializeWorkflowExecution(
    executionId,
    execution.workflowId.toString(),
    nextRunAt
  );
  await initializePhaseStatues(phases);

  let executionFailed = false;

  for (const phase of phases) {
    const phaseExecution = await executeWorkflowPhase(
      phase,
      enviornment,
      edges,
      execution.userId
    );
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId.toString(),
    executionFailed
  );
  await cleanupEnviornment(enviornment);

  revalidatePath(`/worflow/runs`);
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
  nextRunAt?: Date
) {
  await WorkflowExecution.findByIdAndUpdate(executionId, {
    startedAt: new Date(),
    status: WorkflowExecutionStatus.RUNNING,
  });

  const updateData: any = {
    lastRunAt: new Date(),
    lastRunStatus: WorkflowExecutionStatus.RUNNING,
    lastRunId: executionId,
    updatedAt: new Date(),
  };
  
  if (nextRunAt) {
    updateData.nextRunAt = nextRunAt;
  }

  await Workflow.findByIdAndUpdate(workflowId, updateData);
}

async function initializePhaseStatues(phases: any[]) {
  const phaseIds = phases.map(phase => phase._id);
  await ExecutionPhase.updateMany(
    { _id: { $in: phaseIds } },
    { status: ExecutionPhaseStatus.PENDING }
  );
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await WorkflowExecution.findByIdAndUpdate(executionId, {
    status: finalStatus,
    completedAt: new Date(),
  });

  await Workflow.findOneAndUpdate(
    { _id: workflowId, lastRunId: executionId },
    { 
      lastRunStatus: finalStatus,
      updatedAt: new Date()
    }
  ).catch((err) => {
    // Ignoring the error
    // This means that we have triggred other runs for this workflow, while an execution was running
  });
}

async function executeWorkflowPhase(
  phase: any,
  enviornment: Enviornment,
  edges: Edge[],
  userId: string
) {
  const startedAt = new Date();
  const logCollector = createLogCollector();

  const node = JSON.parse(phase.node) as AppNode;
  setupEnviornmentForPhase(node, enviornment, edges);

  await ExecutionPhase.findByIdAndUpdate(phase._id, {
    status: ExecutionPhaseStatus.RUNNING,
    startedAt,
    inputs: JSON.stringify(enviornment.phases[node.id].inputs),
  });

  const success = await executePhase(phase, node, enviornment, logCollector);
  const outputs = enviornment.phases[node.id].outputs;
  await finalizePhase(
    phase._id.toString(),
    success,
    outputs,
    logCollector
  );
  return { success };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: Record<string, string>,
  logCollector: LogCollector
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await ExecutionPhase.findByIdAndUpdate(phaseId, {
    status: finalStatus,
    completedAt: new Date(),
    outputs: JSON.stringify(outputs),
  });

  // Create logs
  const logs = logCollector.getAll().map((log) => ({
    message: log.message,
    timestamp: log.timeStamp,
    logLevel: log.level,
    executionPhaseId: phaseId,
  }));

  if (logs.length > 0) {
    await ExecutionLog.insertMany(logs);
  }
}

async function executePhase(
  phase: any,
  node: AppNode,
  enviornment: Enviornment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFc = ExecutorRegistry[node.data.type];
  if (!runFc) {
    logCollector.error(`Executor not found for ${node.data.type}`);
    return false;
  }

  const executionEnviornment: ExecutionEnviornment<any> =
    createExecutionEnviornment(node, enviornment, logCollector);

  return await runFc(executionEnviornment);
}

function setupEnviornmentForPhase(
  node: AppNode,
  enviornment: Enviornment,
  edges: Edge[]
) {
  enviornment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    // Removed BROWSE_INSTANCE check as it doesn't exist
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      // Input value is defined by user
      enviornment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
    // The input value is coming form ouptut of previous node

    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.error(
        "Missing edge for input ",
        input.name,
        " node.id: ",
        node.id
      );
    }

    const outputValue =
      enviornment.phases[connectedEdge!.source].outputs[
        connectedEdge!.sourceHandle!
      ];

    enviornment.phases[node.id].inputs[input.name] = outputValue;
  }
}

function createExecutionEnviornment(
  node: AppNode,
  enviornment: Enviornment,
  logCollector: LogCollector
): ExecutionEnviornment<any> {
  return {
    getInput: (name: string) => enviornment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      enviornment.phases[node.id].outputs[name] = value;
    },
    // getBrowser: () => enviornment.browser,
    // setBrowser: (browser: Browser) => {
    //   enviornment.browser = browser;
    // },
    // setPage: (page: Page) => (enviornment.page = page),
    // getPage: () => enviornment.page,
    log: logCollector,
  };
}

async function cleanupEnviornment(enviornment: Enviornment) {
  // if (enviornment.browser) {
  //   await enviornment.browser.close().catch((err) => {
  //     console.log("Cannot close browser, reason:", err);
  //   });
  // }
}

