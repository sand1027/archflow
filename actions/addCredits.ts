"use server";

import initDB, { UserBalance } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function addCreditsToUser(amount: number = 10000) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  
  const existingBalance = await UserBalance.findOne({ userId });
  if (existingBalance) {
    await UserBalance.findOneAndUpdate(
      { userId },
      { $inc: { credits: amount } }
    );
  } else {
    await UserBalance.create({
      userId,
      credits: amount,
    });
  }

  return { success: true, message: `Added ${amount} credits` };
}