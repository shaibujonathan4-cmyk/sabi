import { createBusiness } from "@/server/actions/business.actions";

export default function SetupBusinessPage() {
  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-2xl font-semibold mb-2">Set up your business</h1>
      <p className="text-gray-500 mb-6">
        This creates your workspace on Sabi.
      </p>

      <form action={createBusiness} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Business name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full btn-primary"
            placeholder="e.g. Amaka's Store"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Business type
          </label>
          <input
            id="type"
            name="type"
            type="text"
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="e.g. Retail, Salon, Restaurant"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium mb-1">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            required
            defaultValue="NGN"
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="NGN">Naira (NGN)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="GHS">Cedi (GHS)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white rounded-md py-2 font-medium"
        >
          Create workspace
        </button>
      </form>
    </div>
  );
}