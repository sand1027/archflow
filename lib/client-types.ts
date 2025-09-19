import { WorkflowExecutionStatus, WorkflowExecutionTrigger } from "./types";

// Client-side types that mirror the server-side interfaces
// but don't import Mongoose schemas
export interface ClientWorkflowExecution {
  _id?: string;
  id: string;
  workflowId: string;
  userId: string;
  definition: string;
  status: WorkflowExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  trigger: WorkflowExecutionTrigger;
  creditsConsumed: number;
  createdAt: Date;
  updatedAt: Date;
}