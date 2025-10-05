import { Schema, model, models } from "mongoose";

const WorkflowShareSchema = new Schema({
  workflowId: { type: String, required: true },
  shareToken: { type: String, required: true, unique: true },
  permissions: { type: String, enum: ['view', 'edit', 'admin'], default: 'edit' },
  expiresAt: { type: Date },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatMessageSchema = new Schema({
  workflowId: { type: String, required: true },
  sessionId: { type: String, required: true },
  userId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['text', 'system', 'file'], default: 'text' },
  replyTo: { type: String },
  isPrivate: { type: Boolean, default: false },
  chatId: { type: String },
  targetUserId: { type: String },
});

// Add indexes for better query performance
ChatMessageSchema.index({ workflowId: 1, sessionId: 1, timestamp: 1 });
ChatMessageSchema.index({ workflowId: 1, timestamp: 1 });
ChatMessageSchema.index({ workflowId: 1, chatId: 1, timestamp: 1 });
ChatMessageSchema.index({ workflowId: 1, isPrivate: 1, timestamp: 1 });

export const WorkflowShare = models.WorkflowShare || model("WorkflowShare", WorkflowShareSchema);
export const ChatMessage = models.ChatMessage || model("ChatMessage", ChatMessageSchema);