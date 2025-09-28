/**
 * Base URL of the backend API.
 * Tip: in prod you can switch to an env var (e.g. VITE_API_BASE_URL).
 */
export const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:5000";
/**
 * Minimal JSON fetch helper.
 *
 * What it does:
 * - Adds JSON headers by default.
 * - For non-2xx responses, reads the response text and throws an Error.
 * - Returns the parsed JSON typed as <T>.
 *
 * Usage:
 *   const roles = await http<Role[]>(`${BASE_URL}/api/roles`);
 */
export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}
