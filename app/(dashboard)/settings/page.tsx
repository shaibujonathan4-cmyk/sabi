import { getCurrentBusinessContext } from "@/lib/current-business";
import { updateBusinessProfile } from "@/server/actions/business.actions";
import Link from "next/link";

export default async function SettingsPage() {
  const { business, role } = await getCurrentBusinessContext();

  return (
    <div className="p-6 pb-24 space-y-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section>
        <h2 className="font-medium mb-3">Business Profile</h2>
        {role === "OWNER" ? (
          <form action={updateBusinessProfile} className="space-y-4 border rounded-lg p-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Business name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={business.name}
                className="w-full border rounded-md px-3 py-2"
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
                defaultValue={business.type}
                className="w-full border rounded-md px-3 py-2"
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
                defaultValue={business.currency}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="NGN">Naira (NGN)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="GHS">Cedi (GHS)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="border rounded-lg p-4 text-gray-500">
            <p><strong>{business.name}</strong></p>
            <p>{business.type} · {business.currency}</p>
            <p className="text-sm mt-2">Only the owner can edit business settings.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-medium mb-3">Account</h2>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-3">
            Password and account security are managed through your Sabi account.
          </p>
          <Link href="/user-profile" className="btn-secondary inline-block">
            Manage Account
          </Link>
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-3">Subscription</h2>
        <div className="border rounded-lg p-4">
          <p className="font-medium">Free Plan</p>
          <p className="text-sm text-gray-500">
            You&apos;re currently on the free tier. Paid plans coming soon.
          </p>
        </div>
      </section>
    </div>
  );
}