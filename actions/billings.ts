"use server";

import { getCreditsPack, PackId } from "@/lib/billing";
import { getAppUrl } from "@/lib/helper";
import initDB, { UserBalance, UserPurchase } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getAvailableCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  let balance = await UserBalance.findOne({ userId });

  if (!balance) {
    // Auto-create balance with 50000 credits
    balance = await UserBalance.create({
      userId,
      credits: 50000,
    });
  }

  return balance.credits;
}

export async function setupUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  const userBalance = await UserBalance.findOne({ userId });

  if (!userBalance) {
    await UserBalance.create({
      userId,
      credits: 10000,
    });
  } else {
    // Add more credits if balance exists
    await UserBalance.findOneAndUpdate(
      { userId },
      { $inc: { credits: 10000 } }
    );
  }

  redirect("/home");
}

export async function purchaseCredits(packId: PackId) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const seletedPack = getCreditsPack(packId);

  if (!seletedPack) {
    throw new Error("Inavlid package");
  }

  const priceId = seletedPack?.priceId;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    success_url: getAppUrl("billing"),
    cancel_url: getAppUrl("billing"),

    // adding custom details to session info via metadata
    metadata: {
      userId,
      packId,
    },
    line_items: [
      {
        quantity: 1,
        price: priceId, // here price refer to priceId from stripe
      },
    ],
  });

  if (!session.url) {
    throw new Error("Cannot create stripe session");
  }

  redirect(session.url);
}

export async function getUserPurchases() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  return await UserPurchase.find({ userId }).sort({ date: -1 }).lean();
}

export async function downloadInvoice(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  await initDB();
  const purchase = await UserPurchase.findOne({ _id: id, userId });

  if (!purchase) {
    throw new Error("Bad request");
  }

  const session = await stripe.checkout.sessions.retrieve(purchase.stripeId);
  if (!session.invoice) {
    throw new Error("Invoice not found");
  }

  const invoice = await stripe.invoices.retrieve(session.invoice as string);
  return invoice.hosted_invoice_url;
}