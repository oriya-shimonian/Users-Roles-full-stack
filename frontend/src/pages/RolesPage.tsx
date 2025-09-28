import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Role, UserDTO } from "../api/types";
import { getRoles, createRole, getUsersByRole } from "../api/roles";
import RoleCard from "../components/RoleCard";
import RoleUsersModal from "../components/RoleUsersModal";

export default function RolesPage() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  async function refresh() {
    const r = await getRoles();
    setRoles(r);
    const entries = await Promise.all(r.map(async role => {
      const users: UserDTO[] = await getUsersByRole(role.roleName);
      return [role.roleName, users.length] as const;
    }));
    setCounts(Object.fromEntries(entries));
  }

  useEffect(() => { refresh(); }, []);

  async function onAddRole(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await createRole(name.trim());
    setName("");
    await refresh();
  }

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>{t("role.management")}</h3>

      <form onSubmit={onAddRole} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder={t("form.roleName")}
          value={name}
          onChange={e => setName(e.target.value)}
          minLength={2}
          required
          style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
        />
        <button
          type="submit"
          style={{ padding: "12px 16px", borderRadius: 12, border: "none", background: "linear-gradient(90deg,#8b5cf6,#7c3aed)", color: "white" }}
        >
          {t("button.addRole")}
        </button>
      </form>

      <div style={{ display: "grid", gap: 12 }}>
        {roles.map(r => (
          <RoleCard
            key={r.id}
            name={r.roleName}
            usersCount={counts[r.roleName]}
            onView={() => { setActiveRole(r); setOpen(true); }}
          />
        ))}
      </div>

      <RoleUsersModal open={open} role={activeRole} onClose={() => setOpen(false)} />
    </div>
  );
}
