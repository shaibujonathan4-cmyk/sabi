"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function submitFeedback(formData: FormData) {
  const { userId: clerkId } = await auth();
  const message = formData.get("message") as string;

  if (!message || message.trim() === "") {
    throw new Error("Feedback cannot be empty");
  }

  let email: string | undefined;
  if (clerkId) {
    const clerkUser = await currentUser();
    email = clerkUser?.emailAddresses[0]?.emailAddress;
  }

  await prisma.feedback.create({
    data: {
      message: message.trim(),
      email,
    },
  });

  return { success: true };
}