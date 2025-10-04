import mongoose from "mongoose";

const activeUserSchema = new mongoose.Schema({
  workflowId: { type: String, required: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  lastSeen: { type: Date, default: Date.now, expires: 300 } // Auto-delete after 5 minutes
});

activeUserSchema.index({ workflowId: 1, userId: 1 }, { unique: true });

export const ActiveUser = mongoose.models.ActiveUser || mongoose.model("ActiveUser", activeUserSchema);