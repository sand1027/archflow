import { symmetricDecrypt } from "./credential";
import connectDB from "./mongodb";
import { Credential } from "@/schema/credentials";

export async function getCredentialValue(credentialId: string, userId: string): Promise<Record<string, string> | null> {
  try {
    await connectDB();
    const credential = await Credential.findOne({ _id: credentialId, userId }).lean();
    
    if (!credential) {
      return null;
    }

    const decryptedValue = symmetricDecrypt(credential.value);
    return JSON.parse(decryptedValue);
  } catch (error) {
    console.error("Error getting credential:", error);
    return null;
  }
}

export async function getCredentialByName(name: string, userId: string): Promise<Record<string, string> | null> {
  try {
    await connectDB();
    const credential = await Credential.findOne({ name, userId }).lean();
    
    if (!credential) {
      return null;
    }

    const decryptedValue = symmetricDecrypt(credential.value);
    return JSON.parse(decryptedValue);
  } catch (error) {
    console.error("Error getting credential by name:", error);
    return null;
  }
}