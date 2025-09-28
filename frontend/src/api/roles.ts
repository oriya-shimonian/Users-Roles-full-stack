import { BASE_URL, http } from "./client";
import type { Role, UserDTO } from "./types";
import { normalizeUser } from "./users";

export async function getRoles(): Promise<Role[]> {
  return http<Role[]>(`${BASE_URL}/api/roles`);
}

export async function createRole(roleName: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roleName }),
  });
  if (res.status === 409) throw new Error("Role already exists");
  if (!res.ok) throw new Error(await res.text());
}

export async function assignRole(userId: number, roleId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/roles/${roleId}`, { method: "POST" });
  if (res.status === 409) throw new Error("Role already assigned to this user");
  if (!res.ok) throw new Error(await res.text());
}

export async function getUsersByRole(roleName: string): Promise<UserDTO[]> {
  const data = await http<any[]>(`${BASE_URL}/api/roles/${encodeURIComponent(roleName)}/users`);
  return data.map(normalizeUser);
}

export async function unassignRole(userId: number, roleId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/roles/${roleId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
