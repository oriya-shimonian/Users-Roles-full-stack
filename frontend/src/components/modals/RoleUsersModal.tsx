/**
 * Modal to display users for a specific role with local search and scroll container.
 * Works well even with 100+ users.
 */
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import type { Role, UserDTO } from "../../api/types";
import { getUsersByRole } from "../../api/roles";

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
