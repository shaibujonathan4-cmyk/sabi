import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  const features = [
    {
      icon: "💵",
      title: "Track Every Naira",
      description:
        "Record income, expenses, customer debts, and supplier debts in seconds — from your phone.",
    },
    {
      icon: "📊",
      title: "See Your Numbers Clearly",
      description:
        "A live dashboard shows today's income, expenses, balance, and outstanding debts at a glance.",
    },
    {
      icon: "📅",
      title: "Daily, Weekly, Monthly Reports",
      description:
        "Know exactly how your business performed this week, this month, or today — no spreadsheets needed.",
    },
    {
      icon: "👥",
      title: "Manage Your Team",
      description:
        "Invite staff and managers with the right access — keep your books accurate as your team grows.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 sm:px-10 h-20 border-b border-gray-800 sticky top-0 bg-black/90 backdrop-blur z-20">
        <span className="text-2xl font-extrabold tracking-tight">Sabi</span>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-semibold bg-white text-black rounded-full px-5 py-2.5 transition-transform duration-150 active:scale-95 hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 sm:px-10 pt-20 pb-24 text-center">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(34,197,94,0.25), transparent 60%)",
          }}
        />
        <span className="inline-block text-xs font-semibold tracking-wide uppercase text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-4 py-1.5 mb-6">
          Built for Nigerian small businesses
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight max-w-3xl mx-auto mb-6">
          Track every{" "}
          <span className="text-green-400">naira</span> coming in
          and going out.
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          Sabi is the simplest way for small business owners to manage
          income, expenses, and debts — no accounting degree required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto text-base font-semibold bg-green-400 text-black rounded-full px-8 py-4 transition-transform duration-150 active:scale-95 hover:opacity-90"
          >
            Start Free for 14 Days
          </Link>
          <Link
            href="/sign-in"
            className="w-full sm:w-auto text-base font-medium text-gray-300 border border-gray-700 rounded-full px-8 py-4 transition-colors hover:border-gray-500"
          >
            I already have an account
          </Link>
        </div>
        <p className="text-gray-600 text-sm mt-6">
          No credit card required to start
        </p>
      </section>

      {/* Features */}
      <section className="px-6 sm:px-10 py-20 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything your business needs to stay on top of money
          </h2>
          <p className="text-gray-400 text-center max-w-lg mx-auto mb-14">
            Sabi gives you the tools to run your business finances with
            confidence — nothing more, nothing less.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 sm:px-10 py-20 border-t border-gray-800">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Simple, honest pricing</h2>
          <p className="text-gray-400 mb-10">
            Try Sabi free for 14 days. No hidden fees, cancel anytime.
          </p>
          <div className="border border-gray-800 rounded-2xl p-8 bg-gray-900/40">
            <p className="text-5xl font-extrabold mb-1">
              ₦2,000
              <span className="text-base font-medium text-gray-400">
                {" "}
                / month
              </span>
            </p>
            <p className="text-gray-500 text-sm mb-8">
              After your 14-day free trial
            </p>
            <ul className="text-left text-sm text-gray-300 space-y-3 mb-8">
              <li className="flex gap-2">
                <span className="text-green-400">✓</span> Unlimited ledger
                entries
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">✓</span> Daily, weekly &
                monthly reports
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">✓</span> Invite unlimited
                staff
              </li>
              <li className="flex gap-2">
                <span className="text-green-400">✓</span> Customer & supplier
                debt tracking
              </li>
            </ul>
            <Link
              href="/sign-up"
              className="block w-full text-base font-semibold bg-green-400 text-black rounded-full px-8 py-3.5 transition-transform duration-150 active:scale-95 hover:opacity-90"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-10 py-10 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Sabi. All rights reserved.
        </span>
        <span className="text-gray-600 text-sm">
          Made for small businesses in Nigeria 🇳🇬
        </span>
      </footer>
    </div>
  );
}