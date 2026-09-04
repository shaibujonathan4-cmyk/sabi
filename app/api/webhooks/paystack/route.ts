import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const businessId = event.data.metadata?.businessId;
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
  }

  return NextResponse.json({ received: true });
}