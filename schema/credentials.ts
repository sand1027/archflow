import mongoose from "mongoose";

export interface ICredential {
  _id?: string;
  userId: string;
  name: string;
  type: "GMAIL" | "SLACK" | "OPENAI" | "NOTION" | "DISCORD" | "GITHUB" | "GOOGLE_OAUTH" | "GOOGLE_SHEETS" | "ANTHROPIC" | "HUGGING_FACE" | "WEBHOOK" | "HTTP" | "CUSTOM";
  value: string; // Encrypted JSON string of key-value pairs
  createdAt: Date;
  updatedAt: Date;
}

const CredentialSchema = new mongoose.Schema<ICredential>({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 30,
  },
  type: {
    type: String,
    enum: ["GMAIL", "SLACK", "OPENAI", "NOTION", "DISCORD", "GITHUB", "GOOGLE_OAUTH", "GOOGLE_SHEETS", "ANTHROPIC", "HUGGING_FACE", "WEBHOOK", "HTTP", "CUSTOM"],
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Credential = mongoose.models.Credential || mongoose.model<ICredential>("Credential", CredentialSchema);