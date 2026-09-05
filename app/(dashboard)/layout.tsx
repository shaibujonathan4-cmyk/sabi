import { auth, currentUser } from "@clerk/nextjs/server";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  let user = await prisma.user.findUnique({
    where: { clerkId },
    include: { businesses: true },
  });

  if (!user) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
    const fullName =
      `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() ||
      "User";

    // Check if a user with this email already exists (e.g. from a
    // previous Clerk instance) and re-link it to the new clerkId
    // instead of creating a duplicate.
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      user = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: { clerkId },
        include: { businesses: true },
      });
    } else {
      user = await prisma.user.create({
        data: { clerkId, email, fullName },
        include: { businesses: true },
      });
    }

    await prisma.businessUser.updateMany({
      where: { inviteEmail: email, userId: null },
      data: { userId: user.id, inviteEmail: null },
    });

    user = await prisma.user.findUnique({
      where: { clerkId },
      include: { businesses: true },
    });
  }

  if (!user || user.businesses.length === 0) {
    redirect("/setup-business");
  }

  const businessUser = user.businesses[0];
  const subscription = await prisma.subscription.findUnique({
    where: { businessId: businessUser.businessId },
  });

  if (subscription) {
    const trialExpired =
      subscription.status === "TRIALING" && new Date() >= subscription.trialEndsAt;
    const blocked =
      trialExpired || subscription.status === "EXPIRED" || subscription.status === "CANCELLED";

    if (blocked) {
      redirect("/upgrade");
    }
  }

  const navItems = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: "/ledger", label: "Ledger", icon: "📒" },
    { href: "/reports", label: "Reports", icon: "📊" },
    { href: "/staff", label: "Staff", icon: "👥" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-between items-center px-4 h-14 border-b sticky top-0 bg-black z-10">
        <Link href="/dashboard" className="text-lg font-bold">
          Sabi
        </Link>
        <UserButton />
      </header>

      <main className="flex-1 pb-20">{children}</main>
      <FeedbackButton />
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center text-xs text-gray-300 hover:text-white gap-1 transition-transform duration-150 active:scale-90"
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}