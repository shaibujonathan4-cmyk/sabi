"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentBusinessContext } from "@/lib/current-business";
import { canEditOrDeleteEntry } from "@/lib/permissions";
import { redirect } from "next/navigation";
import type { LedgerEntryType } from "@prisma/client";

export async function createLedgerEntry(formData: FormData) {
  const { userId, businessId } = await getCurrentBusinessContext();

  const type = formData.get("type") as LedgerEntryType;
  const amount = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const personName = formData.get("personName") as string | null;
  const categoryName = formData.get("category") as string | null;

  if (!type || !amount || !description || !date) {
    throw new Error("Missing required fields");
  }

  let categoryId: string | undefined;

  if (categoryName && categoryName.trim() !== "") {
    const category = await prisma.category.upsert({
      where: {
        businessId_name_type: {
          businessId,
          name: categoryName.trim(),
          type,
        },
      },
      update: {},
      create: {
        businessId,
        name: categoryName.trim(),
        type,
      },
    });
    categoryId = category.id;
  }

  const isDebt = type === "CUSTOMER_DEBT" || type === "SUPPLIER_DEBT";

  await prisma.ledgerEntry.create({
    data: {
      type,
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      personName: personName || null,
      categoryId,
      businessId,
      createdById: userId,
      debtStatus: isDebt ? "OPEN" : null,
      settledAmount: isDebt ? 0 : null,
    },
  });

  redirect("/ledger");
}

export async function updateLedgerEntry(entryId: string, formData: FormData) {
  const { userId, businessId, role } = await getCurrentBusinessContext();

  const entry = await prisma.ledgerEntry.findFirst({
    where: { id: entryId, businessId },
  });

  if (!entry) {
    throw new Error("Entry not found");
  }

  if (!canEditOrDeleteEntry(role, entry.createdById, userId)) {
    throw new Error("You don't have permission to edit this entry");
  }

  const type = formData.get("type") as LedgerEntryType;
  const amount = formData.get("amount") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const personName = formData.get("personName") as string | null;
  const categoryName = formData.get("category") as string | null;

  if (!type || !amount || !description || !date) {
    throw new Error("Missing required fields");
  }

  let categoryId: string | undefined;

  if (categoryName && categoryName.trim() !== "") {
    const category = await prisma.category.upsert({
      where: {
        businessId_name_type: {
          businessId,
          name: categoryName.trim(),
          type,
        },
      },
      update: {},
      create: {
        businessId,
        name: categoryName.trim(),
        type,
      },
    });
    categoryId = category.id;
  }

  await prisma.ledgerEntry.update({
    where: { id: entryId },
    data: {
      type,
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      personName: personName || null,
      categoryId,
    },
  });

  redirect("/ledger");
}

export async function deleteLedgerEntry(formData: FormData) {
  const { userId, businessId, role } = await getCurrentBusinessContext();
  const entryId = formData.get("entryId") as string;

  const entry = await prisma.ledgerEntry.findFirst({
    where: { id: entryId, businessId },
  });

  if (!entry) {
    throw new Error("Entry not found");
  }

  if (!canEditOrDeleteEntry(role, entry.createdById, userId)) {
    throw new Error("You don't have permission to delete this entry");
  }

  // Soft delete — never hard-delete financial records
  await prisma.ledgerEntry.update({
    where: { id: entryId },
    data: { isDeleted: true },
  });

  redirect("/ledger");
}