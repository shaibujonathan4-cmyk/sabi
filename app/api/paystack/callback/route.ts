import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/upgrade?error=missing_reference", req.url));
  }

  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  );
  const verifyData = await verifyRes.json();

  if (verifyData.status && verifyData.data.status === "success") {
    const businessId = verifyData.data.metadata?.businessId;

    if (businessId) {
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

      const trialEndsAt = new Date();

      await prisma.subscription.upsert({
        where: { businessId },
        update: { status: "ACTIVE", currentPeriodEnd },
        create: {
          businessId,
          status: "ACTIVE",
          trialEndsAt,
          currentPeriodEnd,
        },
      });
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.redirect(new URL("/upgrade?error=payment_failed", req.url));
}