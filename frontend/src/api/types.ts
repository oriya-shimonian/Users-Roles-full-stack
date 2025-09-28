/**
 * Shared API models (TypeScript-only).
 * Note: 'UserDTO' matches the projection returned by the backend GetUsers (Id, Username, Email, Roles[]).
 */
export type Role = { id: number; roleName: string };

export type UserDTO = {
  id: number;
  username: string;
  email: string;
  roles: string[];   // e.g., ["Admin","Developer"]
};
