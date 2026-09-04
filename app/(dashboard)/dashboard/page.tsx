import { prisma } from "@/lib/prisma";
import { getCurrentBusinessContext } from "@/lib/current-business";

export default async function DashboardPage() {
  const { businessId, business } = await getCurrentBusinessContext();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Today's income and expenses
  const [todayIncome, todayExpenses] = await Promise.all([
    prisma.ledgerEntry.aggregate({
      where: {
        businessId,
        type: "INCOME",
        date: { gte: startOfToday, lte: endOfToday },
        isDeleted: false,
      },
      _sum: { amount: true },
    }),
    prisma.ledgerEntry.aggregate({
      where: {
        businessId,
        type: "EXPENSE",
        date: { gte: startOfToday, lte: endOfToday },
        isDeleted: false,
      },
      _sum: { amount: true },
    }),
  ]);

  // All-time totals for balance calculation
  const [allIncome, allExpenses] = await Promise.all([
    prisma.ledgerEntry.aggregate({
      where: { businessId, type: "INCOME", isDeleted: false },
      _sum: { amount: true },
    }),
    prisma.ledgerEntry.aggregate({
      where: { businessId, type: "EXPENSE", isDeleted: false },
      _sum: { amount: true },
    }),
  ]);

  // Debts owed TO the business (customer debts, still open) minus what's been settled
  const customerDebts = await prisma.ledgerEntry.findMany({
    where: {
      businessId,
      type: "CUSTOMER_DEBT",
      isDeleted: false,
      debtStatus: { in: ["OPEN", "PARTIALLY_SETTLED"] },
    },
    select: { amount: true, settledAmount: true },
  });

  // Debts the business owes (supplier debts, still open)
  const supplierDebts = await prisma.ledgerEntry.findMany({
    where: {
      businessId,
      type: "SUPPLIER_DEBT",
      isDeleted: false,
      debtStatus: { in: ["OPEN", "PARTIALLY_SETTLED"] },
    },
    select: { amount: true, settledAmount: true },
  });

  const totalOwedToBusiness = customerDebts.reduce(
    (sum, d) => sum + (Number(d.amount) - Number(d.settledAmount ?? 0)),
    0
  );

  const totalOwedByBusiness = supplierDebts.reduce(
    (sum, d) => sum + (Number(d.amount) - Number(d.settledAmount ?? 0)),
    0
  );

  const currentBalance =
    Number(allIncome._sum.amount ?? 0) - Number(allExpenses._sum.amount ?? 0);

  const currency = business.currency;

  const cards = [
    {
      label: "Today's Income",
      value: Number(todayIncome._sum.amount ?? 0),
      color: "text-green-600",
    },
    {
      label: "Today's Expenses",
      value: Number(todayExpenses._sum.amount ?? 0),
      color: "text-red-600",
    },
    {
      label: "Current Balance",
      value: currentBalance,
      color: currentBalance >= 0 ? "text-green-600" : "text-red-600",
    },
    {
      label: "Owed to You",
      value: totalOwedToBusiness,
      color: "text-blue-600",
    },
    {
      label: "You Owe",
      value: totalOwedByBusiness,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-6">{business.name}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="border rounded-lg p-4 flex flex-col gap-1"
          >
            <span className="text-sm text-gray-500">{card.label}</span>
            <span className={`text-2xl font-semibold ${card.color}`}>
              {currency} {card.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}