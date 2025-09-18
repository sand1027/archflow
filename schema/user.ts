import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  email: string;
  name: string;
  image?: string;
  provider: "github" | "google" | "credentials";
  providerId?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  provider: {
    type: String,
    enum: ["github", "google", "credentials"],
    required: true,
  },
  providerId: {
    type: String,
  },
  password: {
    type: String,
  },
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);