import { getCurrentBusinessContext } from "@/lib/current-business";
import { initializePayment } from "@/server/actions/subscription.actions";

export default async function UpgradePage() {
  const { business, subscription } = await getCurrentBusinessContext();

  return (
    <div className="max-w-md mx-auto mt-16 p-6 text-center">
      <h1 className="text-2xl font-semibold mb-2">Upgrade to Sabi Pro</h1>
      <p className="text-gray-500 mb-6">
        {subscription?.status === "TRIALING"
          ? "Your free trial has ended."
          : "Your subscription is inactive."}{" "}
        Subscribe to continue using {business.name} on Sabi.
      </p>

      <div className="border rounded-lg p-6 mb-6">
        <p className="text-3xl font-bold">NGN 5,000</p>
        <p className="text-gray-500 text-sm">per month</p>
      </div>

      <form action={initializePayment}>
        <button type="submit" className="w-full btn-primary">
          Subscribe with Paystack
        </button>
      </form>
    </div>
  );
}