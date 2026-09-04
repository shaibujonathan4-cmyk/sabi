"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getCurrentBusinessContext } from "@/lib/current-business";
import { redirect } from "next/navigation";

export async function createBusiness(formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Not authenticated");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const currency = formData.get("currency") as string;

  if (!name || !type || !currency) {
    throw new Error("Missing required fields");
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Could not load user details");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const fullName = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "User";

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { clerkId },
      update: {},
      create: {
        clerkId,
        email,
        fullName,
      },
    });

    const business = await tx.business.create({
      data: {
        name,
        type,
        currency,
      },
    });

    await tx.businessUser.create({
      data: {
        userId: user.id,
        businessId: business.id,
        role: "OWNER",
      },
    });

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    await tx.subscription.create({
      data: {
        businessId: business.id,
        status: "TRIALING",
        trialEndsAt,
      },
    });
  });

  redirect("/dashboard");
}

export async function updateBusinessProfile(formData: FormData) {
  const { businessId, role } = await getCurrentBusinessContext();

  if (role !== "OWNER") {
    throw new Error("Only the owner can edit business settings");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const currency = formData.get("currency") as string;

  if (!name || !type || !currency) {
    throw new Error("Missing required fields");
  }

  await prisma.business.update({
    where: { id: businessId },
    data: { name, type, currency },
  });

  redirect("/settings");
}