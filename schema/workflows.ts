import mongoose from "mongoose";
import { WorkflowExecutionStatus, WorkflowExecutionTrigger, ExecutionPhaseStatus, LogLevel } from "@/lib/types";
import {
  createWorkflowShema,
  createWorkflowShemaType,
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from "@/lib/validation-schemas";

// Workflow Schema
export interface IWorkflow {
  _id?: string;
  userId: string;
  name: string;
  description?: string;
  definition: string;
  executionPlan?: string;
  status: string;
  cron?: string;
  nextRunAt?: Date;
  lastRunAt?: Date;
  lastRunStatus?: string;
  lastRunId?: string;
  creditsCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowSchema = new mongoose.Schema<IWorkflow>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  definition: { type: String, required: true },
  executionPlan: { type: String },
  status: { type: String, required: true },
  cron: { type: String },
  nextRunAt: { type: Date },
  lastRunAt: { type: Date },
  lastRunStatus: { type: String },
  lastRunId: { type: String },
  creditsCost: { type: Number, default: 0 },
}, { timestamps: true });

// Workflow Execution Schema
export interface IWorkflowExecution {
  _id?: string;
  workflowId: string;
  userId: string;
  definition: string;
  status: WorkflowExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  trigger: WorkflowExecutionTrigger;
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowExecutionSchema = new mongoose.Schema<IWorkflowExecution>({
  workflowId: { type: String, required: true },
  userId: { type: String, required: true },
  definition: { type: String, required: true },
  status: { type: String, enum: Object.values(WorkflowExecutionStatus), required: true },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date },
  trigger: { type: String, enum: Object.values(WorkflowExecutionTrigger), required: true },
}, { timestamps: true });

// Execution Phase Schema
export interface IExecutionPhase {
  _id?: string;
  userId: string;
  status: ExecutionPhaseStatus;
  number: number;
  node: string;
  name: string;
  startedAt?: Date;
  completedAt?: Date;
  inputs?: string;
  outputs?: string;
  workflowExecutionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExecutionPhaseSchema = new mongoose.Schema<IExecutionPhase>({
  userId: { type: String, required: true },
  status: { type: String, enum: Object.values(ExecutionPhaseStatus), required: true },
  number: { type: Number, required: true },
  node: { type: String, required: true },
  name: { type: String, required: true },
  startedAt: { type: Date },
  completedAt: { type: Date },
  inputs: { type: String },
  outputs: { type: String },
  workflowExecutionId: { type: String, required: true },
}, { timestamps: true });

// Execution Log Schema
export interface IExecutionLog {
  _id?: string;
  executionPhaseId: string;
  message: string;
  logLevel: LogLevel;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExecutionLogSchema = new mongoose.Schema<IExecutionLog>({
  executionPhaseId: { type: String, required: true },
  message: { type: String, required: true },
  logLevel: { type: String, enum: ["info", "error", "warn", "debug"], required: true },
  timestamp: { type: Date, required: true },
}, { timestamps: true });

export const Workflow = mongoose.models.Workflow || mongoose.model<IWorkflow>("Workflow", WorkflowSchema);
export const WorkflowExecution = mongoose.models.WorkflowExecution || mongoose.model<IWorkflowExecution>("WorkflowExecution", WorkflowExecutionSchema);
export const ExecutionPhase = mongoose.models.ExecutionPhase || mongoose.model<IExecutionPhase>("ExecutionPhase", ExecutionPhaseSchema);
export const ExecutionLog = mongoose.models.ExecutionLog || mongoose.model<IExecutionLog>("ExecutionLog", ExecutionLogSchema);

// Re-export validation schemas for backward compatibility
export {
  createWorkflowShema,
  duplicateWorkflowSchema,
} from "@/lib/validation-schemas";

export type {
  createWorkflowShemaType,
  duplicateWorkflowSchemaType,
} from "@/lib/validation-schemas";