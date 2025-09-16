"use server";

import { symmetricEncrypt } from "@/lib/credential";
import initDB, { Credential } from "@/lib/prisma";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserCredentials() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  return await Credential.find({ userId }).sort({ name: 1 }).lean();
}

export async function createCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const encryptedValue = symmetricEncrypt(data.value);

  await initDB();
  const result = await Credential.create({
    userId,
    name: data.name,
    value: encryptedValue,
  });

  if (!result) {
    throw new Error("Failed to create credential");
  }
  revalidatePath("/credentials");
}

export async function deleteCredential(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  await Credential.findOneAndDelete({ _id: id, userId });

  revalidatePath("/credentials");
}