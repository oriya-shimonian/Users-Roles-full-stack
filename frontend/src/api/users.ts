import { BASE_URL, http } from "./client";
import type { UserDTO } from "./types";

/**
 * Normalize raw API shape (nested EF entities) into a flat UserDTO.
 * - Accepts both { roles: [...] } (DTO) and { userRoles: [{ role: { roleName } }...] } (entities)
 * - Deduplicates role names and removes nulls.
 */
export function normalizeUser(raw: any): UserDTO {
  const roleNames = new Set<string>();

  // If server already returns DTO with roles[]
  if (Array.isArray(raw?.roles)) {
    for (const r of raw.roles) if (r) roleNames.add(String(r));
  }

  // If server returns nested entities with userRoles[].role.roleName
  if (Array.isArray(raw?.userRoles)) {
    for (const ur of raw.userRoles) {
      const name = ur?.role?.roleName;
      if (name) roleNames.add(String(name));
    }
  }

  return {
    id: Number(raw?.id ?? 0),
    username: String(raw?.username ?? ""),
    email: String(raw?.email ?? ""),
    roles: [...roleNames],
  };
}

export async function getUsers(): Promise<UserDTO[]> {
  const data = await http<any[]>(`${BASE_URL}/api/users`);
  return data.map(normalizeUser);
}

export async function createUser(username: string, email: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
