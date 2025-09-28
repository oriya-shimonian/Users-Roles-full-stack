// src/api/users.ts

import { BASE_URL, http } from "./client";
import type { UserDTO } from "./types";

/**
 * Normalize raw user payloads coming from the backend into a flat `UserDTO`.
 *
 * Supports both server shapes:
 *  1) Already-flat DTO:
 *     {
 *       id: number,
 *       username: string,
 *       email: string,
 *       roles: string[]
 *     }
 *
 *  2) EF Core entity graph (nested):
 *     {
 *       id, username, email,
 *       userRoles: [
 *         { role: { roleName: string } },
 *         ...
 *       ]
 *     }
 *
 * Behavior:
 *  - Deduplicates role names using a Set.
 *  - Ignores null/undefined values safely.
 *  - Coerces primitives to the expected types (id → number, etc.).
 *  - Never throws on missing fields; falls back to safe defaults.
 *
 * Rationale:
 *  Keeping the UI decoupled from the backend’s internal shape avoids
 *  serialization cycles and allows the server to evolve without breaking the UI.
 *
 * @param raw Arbitrary user-like object returned by the server.
 * @returns `UserDTO` with `{ id, username, email, roles }`.
 */
export function normalizeUser(raw: any): UserDTO {
  const roleNames = new Set<string>();

  // Case 1: server already returns a DTO with roles[]
  if (Array.isArray(raw?.roles)) {
    for (const r of raw.roles) if (r) roleNames.add(String(r));
  }

  // Case 2: server returns nested EF entities via userRoles[].role.roleName
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

/**
 * GET /api/users – Fetch all users.
 *
 * Uses the shared `http` helper (JSON + error handling) and normalizes
 * each item to the UI-friendly `UserDTO`.
 *
 * @example
 *   const users = await getUsers();
 *   console.log(users[0].roles); // e.g., ['Admin', 'Viewer']
 */
export async function getUsers(): Promise<UserDTO[]> {
  const data = await http<any[]>(`${BASE_URL}/api/users`);
  return data.map(normalizeUser);
}

/**
 * POST /api/users – Create a new user.
 *
 * @param username Non-empty username (validated in the UI and server).
 * @param email    Email address (validated in the UI and server).
 * @throws Error   If the server responds with a non-2xx status.
 */
export async function createUser(username: string, email: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email }),
  });
  if (!res.ok) throw new Error(await res.text());
}

/**
 * DELETE /api/users/:id – Delete a user by id.
 *
 * @param id User identifier.
 * @throws Error If the server responds with a non-2xx status.
 */
export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}
