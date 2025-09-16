"use server";

import initDB, { UserBalance } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function checkAndAddCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  
  // Force create/update balance with 50000 credits
  const result = await UserBalance.findOneAndUpdate(
    { userId },
    { $set: { credits: 50000 } },
    { upsert: true, new: true }
  );
  
  return { 
    success: true, 
    message: `Set balance to 50000 credits`,
    userId,
    credits: result.credits
  };
}