import type { Role } from "@prisma/client";

export function canEditBusinessSettings(role: Role) {
  return role === "OWNER";
}

export function canInviteStaff(role: Role) {
  return role === "OWNER" || role === "MANAGER";
}

export function canEditOrDeleteEntry(
  role: Role,
  entryCreatedById: string,
  currentUserId: string
) {
  // Owners and Managers can edit/delete any entry
  if (role === "OWNER" || role === "MANAGER") return true;
  // Staff can only edit/delete entries they personally created
  return entryCreatedById === currentUserId;
}