import "server-only";
import Stripe from "stripe";
import { getCreditsPack, PackId } from "../billing";
import initDB, { UserBalance, UserPurchase } from "../prisma";

export async function handleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  if (!event.metadata) {
    throw new Error("Missing metadata");
  }

  const { userId, packId } = event.metadata;

  if (!userId) {
    throw new Error("Missing user id");
  }
  if (!packId) {
    throw new Error("Missing pack id");
  }

  const purchasedPack = getCreditsPack(packId as PackId);
  if (!purchasedPack) {
    throw new Error("Purchase pack not found");
  }

  await initDB();
  
  // Update or create user balance
  const existingBalance = await UserBalance.findOne({ userId });
  if (existingBalance) {
    await UserBalance.findOneAndUpdate(
      { userId },
      { $inc: { credits: purchasedPack.credits } }
    );
  } else {
    await UserBalance.create({
      userId,
      credits: purchasedPack.credits,
    });
  }

  // Create purchase record
  await UserPurchase.create({
    userId,
    stripeId: event.id,
    description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
    amount: event.amount_total!,
    currency: event.currency!,
  });
}