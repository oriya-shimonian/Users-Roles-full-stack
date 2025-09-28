/**
 * Users page: list users, search, filter by role, add user, assign role, delete user.
 */
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Role, UserDTO } from "../api/types";
import { getRoles, assignRole, unassignRole } from "../api/roles";
import { getUsers, createUser, deleteUser } from "../api/users";
import UserCard from "../components/UserCard";
import AddUserModal from "../components/modals/AddUserModal";

export default function UsersPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [q, setQ] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [uName, setUName] = useState("");
  const [uEmail, setUEmail] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  async function refresh() {
    const [u, r] = await Promise.all([getUsers(), getRoles()]);
    setUsers(u);
    setRoles(r);
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const byText =
        q.trim().length === 0 ||
        u.username.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase());
      const byRole = selectedRole === "all" || u.roles.includes(selectedRole);
      return byText && byRole;
    });
  }, [users, q, selectedRole]);

  async function onAddUser(e: React.FormEvent) {
    e.preventDefault();
    if (!uName.trim() || !uEmail.trim()) return;
    await createUser(uName.trim(), uEmail.trim());
    setUName("");
    setUEmail("");
    await refresh();
  }

  return (
    <div>
      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <input
          placeholder={t("search.users.placeholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
        >
          <option value="all">{t("filter.roles.all")}</option>
          {roles.map((r) => (
            <option key={r.id} value={r.roleName}>
              {r.roleName}
            </option>
          ))}
        </select>
        <button
          onClick={() => setOpenAdd(true)}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(90deg,#22c55e,#16a34a)",
            color: "white",
          }}
        >
          {t("button.addUser")}
        </button>
        <AddUserModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          onCreated={refresh}
        />
      </div>

      {/* List */}
      <div style={{ display: "grid", gap: 14 }}>
        {filtered.map((u) => (
          <UserCard
            key={u.id}
            user={u}
            allRoles={roles}
            onAssign={async (uid, rid) => {
              await assignRole(uid, rid);
              await refresh();
            }}
            onUnassign={async (uid, rid) => {
              await unassignRole(uid, rid);
              await refresh();
            }}
            onDelete={async (uid) => {
              await deleteUser(uid);
              await refresh();
            }}
          />
        ))}
      </div>
    </div>
  );
}
