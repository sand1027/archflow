import mongoose from 'mongoose';

// Workflow Schema
const workflowSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  definition: { type: String, required: true },
  executionPlan: { type: String },

  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastRunAt: { type: Date },
  lastRunId: { type: String },
  lastRunStatus: { type: String },
  updatedAt: { type: Date, default: Date.now },
  cron: { type: String },
  nextRunAt: { type: Date }
});

workflowSchema.index({ name: 1, userId: 1 }, { unique: true });
workflowSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// WorkflowExecution Schema
const workflowExecutionSchema = new mongoose.Schema({
  workflowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
  userId: { type: String, required: true },
  trigger: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date },
  completedAt: { type: Date },

  definition: { type: String, default: '{}' }
});

// ExecutionPhase Schema
const executionPhaseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  status: { type: String, required: true },
  number: { type: Number, required: true },
  node: { type: String, required: true },
  name: { type: String, required: true },
  startedAt: { type: Date },
  completedAt: { type: Date },
  inputs: { type: String },
  outputs: { type: String },

  workflowExecutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkflowExecution', required: true }
});

// ExecutionLog Schema
const executionLogSchema = new mongoose.Schema({
  logLevel: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  executionPhaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExecutionPhase', required: true }
});

// Credential Schema
const credentialSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

credentialSchema.index({ userId: 1, name: 1 }, { unique: true });

// Export models
export const Workflow = mongoose.models.Workflow || mongoose.model('Workflow', workflowSchema);
export const WorkflowExecution = mongoose.models.WorkflowExecution || mongoose.model('WorkflowExecution', workflowExecutionSchema);
export const ExecutionPhase = mongoose.models.ExecutionPhase || mongoose.model('ExecutionPhase', executionPhaseSchema);
export const ExecutionLog = mongoose.models.ExecutionLog || mongoose.model('ExecutionLog', executionLogSchema);
export const Credential = mongoose.models.Credential || mongoose.model('Credential', credentialSchema);