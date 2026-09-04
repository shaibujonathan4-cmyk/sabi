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
        include: { business: true },
      },
    },
  });

  if (!user || user.businesses.length === 0) {
    redirect("/setup-business");
  }

  // MVP assumption: one business per user for now
  const businessUser = user.businesses[0];

  return {
    userId: user.id,
    businessId: businessUser.businessId,
    business: businessUser.business,
    role: businessUser.role,
  };
}