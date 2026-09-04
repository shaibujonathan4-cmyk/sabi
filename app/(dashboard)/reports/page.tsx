import { prisma } from "@/lib/prisma";
import { getCurrentBusinessContext } from "@/lib/current-business";
import Link from "next/link";

function getDateRange(period: string) {
  const now = new Date();
  const start = new Date();

  if (period === "weekly") {
    start.setDate(now.getDate() - 7);
  } else if (period === "monthly") {
    start.setMonth(now.getMonth() - 1);
  } else {
    // daily - just today
    start.setHours(0, 0, 0, 0);
  }

  return { start, end: now };
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { businessId, business } = await getCurrentBusinessContext();
  const { period = "daily" } = await searchParams;

  const { start, end } = getDateRange(period);

  const entries = await prisma.ledgerEntry.findMany({
    where: {
      businessId,
      isDeleted: false,
      date: { gte: start, lte: end },
    },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  const totals = entries.reduce(
    (acc, entry) => {
      const amount = Number(entry.amount);
      if (entry.type === "INCOME") acc.income += amount;
      if (entry.type === "EXPENSE") acc.expenses += amount;
      if (entry.type === "CUSTOMER_DEBT") acc.customerDebt += amount;
      if (entry.type === "SUPPLIER_DEBT") acc.supplierDebt += amount;
      return acc;
    },
    { income: 0, expenses: 0, customerDebt: 0, supplierDebt: 0 }
  );

  const net = totals.income - totals.expenses;
  const currency = business.currency;

  const tabs = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
  ];

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-semibold mb-1">Reports</h1>
      <p className="text-gray-500 mb-6">{business.name}</p>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/reports?period=${tab.key}`}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-transform duration-150 active:scale-95 ${
              period === tab.key
                ? "bg-black text-white"
                : "bg-transparent text-gray-600"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <span className="text-sm text-gray-500">Income</span>
          <p className="text-xl font-semibold text-green-600">
            {currency} {totals.income.toLocaleString()}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <span className="text-sm text-gray-500">Expenses</span>
          <p className="text-xl font-semibold text-red-600">
            {currency} {totals.expenses.toLocaleString()}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <span className="text-sm text-gray-500">New Customer Debt</span>
          <p className="text-xl font-semibold text-blue-600">
            {currency} {totals.customerDebt.toLocaleString()}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <span className="text-sm text-gray-500">New Supplier Debt</span>
          <p className="text-xl font-semibold text-orange-600">
            {currency} {totals.supplierDebt.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <span className="text-sm text-gray-500">Net (Income − Expenses)</span>
        <p
          className={`text-2xl font-semibold ${
            net >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {currency} {net.toLocaleString()}
        </p>
      </div>

      <h2 className="text-lg font-semibold mb-3">Entries in this period</h2>
      {entries.length === 0 ? (
        <p className="text-gray-500">No entries in this period.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between items-center border rounded-md p-3"
            >
              <div>
                <p className="font-medium">{entry.description}</p>
                <p className="text-sm text-gray-500">
                  {entry.type.replace("_", " ")}
                  {entry.category ? ` · ${entry.category.name}` : ""}
                  {" · "}
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
              <p className="font-semibold">
                {currency} {entry.amount.toString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}