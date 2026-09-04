import { prisma } from "@/lib/prisma";
import { getCurrentBusinessContext } from "@/lib/current-business";
import { inviteStaff } from "@/server/actions/staff.actions";

export default async function StaffPage() {
  const { businessId, role } = await getCurrentBusinessContext();

  const staff = await prisma.businessUser.findMany({
    where: { businessId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  const canInvite = role === "OWNER" || role === "MANAGER";

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-semibold mb-6">Staff</h1>

      {canInvite && (
        <form action={inviteStaff} className="space-y-4 mb-8 border rounded-lg p-4">
          <h2 className="font-medium">Invite staff</h2>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border rounded-md px-3 py-2"
              placeholder="staffmember@example.com"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              defaultValue="STAFF"
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Send Invite
          </button>
          <p className="text-xs text-gray-500">
            They must sign up on Sabi using this exact email to gain access.
          </p>
        </form>
      )}

      <h2 className="font-medium mb-3">Current team</h2>
      <div className="space-y-2">
        {staff.map((member) => (
          <div
            key={member.id}
            className="flex justify-between items-center border rounded-md p-3"
          >
            <div>
              <p className="font-medium">
                {member.user?.fullName ?? member.inviteEmail}
              </p>
              <p className="text-sm text-gray-500">
                {member.user?.email ?? member.inviteEmail}
                {!member.user && " · Pending"}
              </p>
            </div>
            <span className="text-xs font-medium border rounded-full px-3 py-1">
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}