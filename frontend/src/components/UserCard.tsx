/**
 * Displays a single user with tag-like roles, role assign select, and delete action.
 */
import { useState } from "react";
import type { Role, UserDTO } from "../api/types";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "./modals/ConfirmDialog";

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
