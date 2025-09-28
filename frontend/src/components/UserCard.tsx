/**
 * UserCard
 *
 * Purpose:
 * - Displays a user with email, current role tags, an assignment selector,
 *   and a delete action protected by a confirmation dialog.
 *
 * Behavior:
 * - Role tags render with a small "✕" to unassign (uses `allRoles` to resolve roleId).
 * - The select lists roles; items already assigned are disabled and marked with ✓.
 * - On delete click, opens `ConfirmDialog`; upon confirm, calls `onDelete`.
 *
 * i18n:
 * - Placeholders and messages are read from `react-i18next`.
 *
 * Notes:
 * - Assumes `user.roles` is a string array; if data may be missing, ensure normalization upstream.
 * - Side effects (assign/unassign/delete) are delegated to parent via props; the parent can refresh the list on completion.
 */

import { useState } from "react";
import type { Role, UserDTO } from "../api/types";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "./modals/ConfirmDialog";
/**
 * Props for UserCard
 * @property user        Flat user DTO: { id, username, email, roles: string[] }.
 * @property allRoles    Full catalog of roles (used to map roleName -> roleId).
 * @property onAssign    Handler to assign a role to this user (userId, roleId).
 * @property onUnassign  Handler to remove a role from this user (userId, roleId).
 * @property onDelete    Handler to delete this user (userId).
 */
type Props = {
  user: UserDTO;
  allRoles: Role[];
  onAssign: (userId: number, roleId: number) => Promise<void>;
  onUnassign: (userId: number, roleId: number) => Promise<void>;
  onDelete: (userId: number) => Promise<void>;
};

export default function UserCard({
  user,
  allRoles,
  onAssign,
  onUnassign,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const [openConfirm, setOpenConfirm] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 16,
        padding: 16,
        background: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div>
          <div style={{ fontWeight: 700 }}>{user.username}</div>
          <div style={{ color: "#666" }}>{user.email}</div>
        </div>
        <button
          onClick={() => setOpenConfirm(true)}
          title="Delete"
          aria-label="Delete user"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          🗑️
        </button>
      </div>

      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}
      >
        {(user.roles ?? []).map((r) => {
          // map roleName -> roleId for unassign
          const rid = allRoles.find((ar) => ar.roleName === r)?.id;
          return (
            <span
              key={r}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 8px",
                borderRadius: 12,
                fontSize: 12,
                background: "#eef",
                color: "#334",
                border: "1px solid #dde",
              }}
            >
              {r}
              {!!rid && (
                <button
                  type="button"
                  title="Remove"
                  aria-label="Remove role"
                  onClick={() => onUnassign(user.id, rid)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              )}
            </span>
          );
        })}
      </div>

      <select
        defaultValue=""
        onChange={async (e) => {
          const val = Number(e.target.value);
          if (!val) return;
          await onAssign(user.id, val);
          e.currentTarget.value = "";
        }}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 10,
          border: "1px solid #ddd",
        }}
      >
        <option value="">{t("assign.role.placeholder")}</option>
        {allRoles.map((r) => (
          <option
            key={r.id}
            value={r.id}
            disabled={user.roles.includes(r.roleName)}
          >
            {r.roleName}
            {(user.roles ?? []).includes(r.roleName) ? " ✓" : ""}
          </option>
        ))}
      </select>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete user"
        message={`Are you sure you want to delete "${user.username}"?`}
        confirmText="Delete"
        onConfirm={async () => {
          setOpenConfirm(false);
          await onDelete(user.id);
        }}
      />
    </div>
  );
}
