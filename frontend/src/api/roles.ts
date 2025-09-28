import { BASE_URL, http } from "./client";
import type { Role, UserDTO } from "./types";
import { normalizeUser } from "./users";

/** GET /api/roles – fetch all roles. */
export async function getRoles(): Promise<Role[]> {
  return http<Role[]>(`${BASE_URL}/api/roles`);
}

/**
 * POST /api/roles – create a role by name.
 * Throws "Role already exists" if the server returns HTTP 409.
 */
export async function createRole(roleName: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roleName }),
  });
  if (res.status === 409) throw new Error("Role already exists");
  if (!res.ok) throw new Error(await res.text());
}

/**
 * POST /api/users/:userId/roles/:roleId – assign a role to a user.
 * Throws "Role already assigned to this user" on HTTP 409.
 */
export async function assignRole(userId: number, roleId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/roles/${roleId}`, { method: "POST" });
  if (res.status === 409) throw new Error("Role already assigned to this user");
  if (!res.ok) throw new Error(await res.text());
}

/** GET /api/roles/:roleName/users – list users in a role (normalized to flat DTOs). */
export async function getUsersByRole(roleName: string): Promise<UserDTO[]> {
  const data = await http<any[]>(`${BASE_URL}/api/roles/${encodeURIComponent(roleName)}/users`);
  return data.map(normalizeUser);
}

/** DELETE /api/users/:userId/roles/:roleId – unassign a role from a user. */
export async function unassignRole(userId: number, roleId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/roles/${roleId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
