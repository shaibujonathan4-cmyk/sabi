import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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

  // First time we're seeing this Clerk user in our DB — create them
  // and check if they were pre-invited to any business by email
  if (!user) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
    const fullName =
      `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() ||
      "User";

    user = await prisma.user.create({
      data: { clerkId, email, fullName },
      include: { businesses: true },
    });

    // Claim any pending invites matching this email
    await prisma.businessUser.updateMany({
      where: { inviteEmail: email, userId: null },
      data: { userId: user.id, inviteEmail: null },
    });

    // Reload to pick up any newly claimed businesses
    user = await prisma.user.findUnique({
      where: { clerkId },
      include: { businesses: true },
    });
  }

  if (!user || user.businesses.length === 0) {
    redirect("/setup-business");
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
      <main className="flex-1 pb-20">{children}</main>

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