import { prisma } from "@/lib/prisma";
import { getCurrentBusinessContext } from "@/lib/current-business";
import { canEditOrDeleteEntry } from "@/lib/permissions";
import { updateLedgerEntry } from "@/server/actions/ledger.actions";
import { notFound } from "next/navigation";

export default async function EditLedgerEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, businessId, role } = await getCurrentBusinessContext();

  const entry = await prisma.ledgerEntry.findFirst({
    where: { id, businessId },
    include: { category: true },
  });

  if (!entry) {
    notFound();
  }

  if (!canEditOrDeleteEntry(role, entry.createdById, userId)) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          You don&apos;t have permission to edit this entry.
        </p>
      </div>
    );
  }

  const updateWithId = updateLedgerEntry.bind(null, id);
  const dateValue = entry.date.toISOString().split("T")[0];

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Entry</h1>

      <form action={updateWithId} className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Type
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={entry.type}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
            <option value="CUSTOMER_DEBT">Customer Debt (owed to you)</option>
            <option value="SUPPLIER_DEBT">Supplier Debt (you owe)</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={entry.amount.toString()}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            defaultValue={entry.description}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category (optional)
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={entry.category?.name ?? ""}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="personName" className="block text-sm font-medium mb-1">
            Person (optional)
          </label>
          <input
            id="personName"
            name="personName"
            type="text"
            defaultValue={entry.personName ?? ""}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={dateValue}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button type="submit" className="w-full btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}