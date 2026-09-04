import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getCurrentBusinessContext() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      businesses: {
        include: {
          business: {
            include: { subscription: true },
          },
        },
      },
    },
  });

  if (!user || user.businesses.length === 0) {
    redirect("/setup-business");
  }

  const businessUser = user.businesses[0];
  const subscription = businessUser.business.subscription;

  let isAccessAllowed = true;
  if (subscription) {
    if (subscription.status === "TRIALING") {
      isAccessAllowed = new Date() < subscription.trialEndsAt;
    } else if (subscription.status === "ACTIVE") {
      isAccessAllowed = true;
    } else {
      isAccessAllowed = false;
    }
  }

  return {
    userId: user.id,
    businessId: businessUser.businessId,
    business: businessUser.business,
    role: businessUser.role,
    subscription,
    isAccessAllowed,
  };
}