"use server";

import { currentUser } from "@clerk/nextjs/server";
import { getCurrentBusinessContext } from "@/lib/current-business";
import { redirect } from "next/navigation";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PLAN_AMOUNT_KOBO = 200000; // NGN 5,000 (Paystack uses kobo, so x100)

export async function initializePayment() {
  const { businessId } = await getCurrentBusinessContext();

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Could not determine your email");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: PLAN_AMOUNT_KOBO,
      currency: "NGN",
      callback_url: `${baseUrl}/api/paystack/callback`,
      metadata: { businessId },
    }),
  });

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || "Could not start payment");
  }

  redirect(data.data.authorization_url);
}