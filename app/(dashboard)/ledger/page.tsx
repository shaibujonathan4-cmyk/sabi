import { prisma } from "@/lib/prisma";
import { getCurrentBusinessContext } from "@/lib/current-business";
import { canEditOrDeleteEntry } from "@/lib/permissions";
import { deleteLedgerEntry } from "@/server/actions/ledger.actions";
import Link from "next/link";

export default async function LedgerPage() {
  const { userId, businessId, business, role } = await getCurrentBusinessContext();

  const entries = await prisma.ledgerEntry.findMany({
    where: { businessId, isDeleted: false },
    orderBy: { date: "desc" },
    include: { category: true },
    take: 50,
  });

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Ledger</h1>
        <Link href="/ledger/new" className="btn-primary text-sm">
          + Add Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="text-gray-500">No entries yet. Add your first one.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const canManage = canEditOrDeleteEntry(role, entry.createdById, userId);

            return (
              <div key={entry.id} className="border rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{entry.description}</p>
                    <p className="text-sm text-gray-500">
                      {entry.type.replace("_", " ")}
                      {entry.category ? ` · ${entry.category.name}` : ""}
                      {entry.personName ? ` · ${entry.personName}` : ""}
                      {" · "}
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${
                      entry.type === "INCOME" || entry.type === "CUSTOMER_DEBT"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {business.currency} {entry.amount.toString()}
                  </p>
                </div>

                {canManage && (
                  <div className="flex gap-3 mt-2 pt-2 border-t">
                    <Link
                      href={`/ledger/${entry.id}/edit`}
                      className="text-sm text-blue-600 font-medium"
                    >
                      Edit
                    </Link>
                    <form action={deleteLedgerEntry}>
                      <input type="hidden" name="entryId" value={entry.id} />
                      <button
                        type="submit"
                        className="text-sm text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}