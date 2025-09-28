/**
 * RoleUsersModal
 *
 * Purpose:
 * - Displays all users that belong to a given role in a scrollable list.
 * - Includes a local client-side search box (filters by username/email).
 *
 * Data flow:
 * - On open AND when `role` changes, fetches users via `getUsersByRole`.
 * - Keeps results in local state; filtering is memoized (`useMemo`).
 *
 * UX:
 * - Bounded height with vertical scroll for large lists (100+ users).
 * - Shows an empty-state message when no users match the filter.
 *
 * i18n:
 * - All visible strings use `react-i18next`.
 *
 * Performance notes:
 * - For very large datasets, consider server-side pagination/limits.
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import type { Role, UserDTO } from "../../api/types";
import { getUsersByRole } from "../../api/roles";

/**
 * Props
 * @property open  Whether the modal is visible.
 * @property role  The active role object; when null, nothing is loaded.
 * @property onClose Close handler for the parent to control visibility.
 */
type Props = {
  open: boolean;
  role: Role | null;
  onClose: () => void;
};

export default function RoleUsersModal({ open, role, onClose }: Props) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open || !role) return;
    (async () => {
      const data = await getUsersByRole(role.roleName);
      setUsers(data);
    })();
  }, [open, role]);

  const filtered = useMemo(() => {
    return users.filter(u =>
      !q.trim() ||
      u.username.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
    );
  }, [users, q]);

  return (
    <Modal open={open} onClose={onClose} title={`${role?.roleName} • ${users.length} ${t("users.suffix")}`}>
      <input
        placeholder={t("search.users.placeholder")}
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd", marginBottom: 12 }}
      />
      <div style={{ maxHeight: 420, overflow: "auto", display: "grid", gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ color: "#666" }}>{t("empty.noUsers")}</div>
        )}
        {filtered.map(u => (
          <div key={u.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, background: "white" }}>
            <div style={{ fontWeight: 600 }}>{u.username}</div>
            <div style={{ color: "#666", fontSize: 13 }}>{u.email}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <button onClick={onClose}
                style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", background: "white" }}>
          {t("button.close")}
        </button>
      </div>
    </Modal>
  );
}
