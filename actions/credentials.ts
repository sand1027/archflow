"use server";

import { symmetricEncrypt } from "@/lib/credential";
import connectDB from "@/lib/mongodb";
import { Credential } from "@/schema/credentials";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { requireAuth } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function getUserCredentials() {
  try {
    const { userId } = await requireAuth();
    
    await connectDB();
    const credentials = await Credential.find({ userId }).sort({ name: 1 }).lean();
    
    return credentials.map((cred: any) => ({
      id: cred._id.toString(),
      name: cred.name,
      type: cred.type,
      createdAt: cred.createdAt
    }));
  } catch (error) {
    console.error("getUserCredentials error:", error);
    return [];
  }
}

export async function createCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await requireAuth();

  const encryptedCredentials = symmetricEncrypt(JSON.stringify(data.credentials));

  await connectDB();
  const result = await Credential.create({
    userId,
    name: data.name,
    type: data.type,
    value: encryptedCredentials,
  });

  if (!result) {
    throw new Error("Failed to create credential");
  }
  revalidatePath("/credentials");
}

export async function deleteCredential(id: string) {
  const { userId } = await requireAuth();

  await connectDB();
  await Credential.findOneAndDelete({ _id: id, userId });

  revalidatePath("/credentials");
}