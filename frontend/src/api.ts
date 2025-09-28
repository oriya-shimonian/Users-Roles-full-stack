export const BASE_URL = "http://localhost:5000";

export type Role = { id: number; roleName: string };
export type User = {
  id: number;
  username: string;
  email: string;
  userRoles?: { userId: number; roleId: number; role?: Role }[];
};

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/api/users`);
  return res.json();
}

export async function createUser(username: string, email: string) {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email })
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}

export async function getRoles(): Promise<Role[]> {
  const res = await fetch(`${BASE_URL}/api/roles`);
  return res.json();
}

export async function createRole(roleName: string) {
  const res = await fetch(`${BASE_URL}/api/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roleName })
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function assignRole(userId: number, roleId: number) {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/roles/${roleId}`, { method: "POST" });
  if (res.status === 409) throw new Error("Role already assigned to this user.");
  if (!res.ok) throw new Error(await res.text());
}

export async function getUsersByRole(roleName: string): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/api/roles/${roleName}/users`);
  return res.json();
}
