"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentBusinessContext } from "@/lib/current-business";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";

export async function inviteStaff(formData: FormData) {
  const { businessId, role: myRole } = await getCurrentBusinessContext();

  if (myRole !== "OWNER" && myRole !== "MANAGER") {
    throw new Error("Only owners and managers can invite staff");
  }

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const role = formData.get("role") as Role;

  if (!email || !role) {
    throw new Error("Missing required fields");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const alreadyLinked = await prisma.businessUser.findFirst({
      where: { businessId, userId: existingUser.id },
    });

    if (alreadyLinked) {
      // Already part of the team — just update their role
      await prisma.businessUser.update({
        where: { id: alreadyLinked.id },
        data: { role },
      });
    } else {
      await prisma.businessUser.create({
        data: { businessId, userId: existingUser.id, role },
      });
    }
  } else {
    const existingInvite = await prisma.businessUser.findFirst({
      where: { businessId, inviteEmail: email },
    });

    if (existingInvite) {
      // Pending invite already exists — update the role instead of erroring
      await prisma.businessUser.update({
        where: { id: existingInvite.id },
        data: { role },
      });
    } else {
      await prisma.businessUser.create({
        data: { businessId, inviteEmail: email, role },
      });
    }
  }

  redirect("/staff");
}