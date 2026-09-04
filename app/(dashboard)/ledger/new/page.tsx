import { createLedgerEntry } from "@/server/actions/ledger.actions";

export default function NewLedgerEntryPage() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Entry</h1>

      <form action={createLedgerEntry} className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Type
          </label>
          <select
            id="type"
            name="type"
            required
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
            className="w-full border rounded-md px-3 py-2"
            placeholder="0.00"
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
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g. Sold 2 bags of rice"
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
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g. Sales, Transport, Rent"
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
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g. Customer or supplier name"
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
            defaultValue={today}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white rounded-md py-2 font-medium"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
}