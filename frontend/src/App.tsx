// import { useEffect, useMemo, useState } from "react";
// import {
//   getUsers, createUser, deleteUser,
//   getRoles, createRole, assignRole, getUsersByRole
// } from "./api";

// import type {  User, Role } from './api'
// function emailValid(e: string) {
//   // אימות בסיסי. בנוסף: input type="email" עושה ולידציה דפדפן
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
// }

// export default function App() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [uName, setUName] = useState("");
//   const [uEmail, setUEmail] = useState("");
//   const [roleName, setRoleName] = useState("");
//   const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
//   const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
//   const [filterRole, setFilterRole] = useState<string>("");

//   async function refresh() {
//     const [u, r] = await Promise.all([getUsers(), getRoles()]);
//     setUsers(u);
//     setRoles(r);
//   }

//   useEffect(() => { refresh(); }, []);

//   const userRolesMap = useMemo(() => {
//     const map = new Map<number, number[]>(); // userId -> roleIds
//     users.forEach(u => {
//       const ids = (u.userRoles || []).map(ur => ur.roleId);
//       map.set(u.id, ids);
//     });
//     return map;
//   }, [users]);

//   async function onCreateUser(e: React.FormEvent) {
//     e.preventDefault();
//     if (!uName.trim() || !emailValid(uEmail)) {
//       alert("אנא הזיני שם אימות ואימייל תקין");
//       return;
//     }
//     await createUser(uName.trim(), uEmail.trim());
//     setUName(""); setUEmail("");
//     await refresh();
//   }

//   async function onCreateRole(e: React.FormEvent) {
//     e.preventDefault();
//     if (!roleName.trim()) return;
//     try {
//       await createRole(roleName.trim());
//       setRoleName("");
//       await refresh();
//     } catch (err: any) {
//       alert(err.message || "Failed creating role");
//     }
//   }

//   async function onAssign() {
//     if (!selectedUserId || !selectedRoleId) return;
//     try {
//       await assignRole(selectedUserId, selectedRoleId);
//       await refresh();
//     } catch (err: any) {
//       alert(err.message);
//     }
//   }

//   async function onDeleteUser(id: number) {
//     if (!confirm("למחוק משתמש?")) return;
//     await deleteUser(id);
//     await refresh();
//   }

//   async function onFilterByRole() {
//     if (!filterRole.trim()) { await refresh(); return; }
//     const byRole = await getUsersByRole(filterRole.trim());
//     setUsers(byRole);
//   }

//   return (
//     <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
//       <h1>Role Manager</h1>

//       <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
//         <form onSubmit={onCreateUser} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
//           <h3>יצירת משתמש</h3>
//           <div>
//             <label>Username</label><br />
//             <input value={uName} onChange={e => setUName(e.target.value)} required minLength={2} />
//           </div>
//           <div>
//             <label>Email</label><br />
//             <input type="email" value={uEmail} onChange={e => setUEmail(e.target.value)} required />
//           </div>
//           <button type="submit" style={{ marginTop: 8 }}>הוספה</button>
//         </form>

//         <form onSubmit={onCreateRole} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
//           <h3>יצירת תפקיד</h3>
//           <div>
//             <label>Role name</label><br />
//             <input value={roleName} onChange={e => setRoleName(e.target.value)} required minLength={2} />
//           </div>
//           <button type="submit" style={{ marginTop: 8 }}>הוספה</button>
//         </form>
//       </section>

//       <section style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12, marginBottom: 24 }}>
//         <h3>שיוך תפקיד למשתמש</h3>
//         <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
//           <select value={selectedUserId ?? ""} onChange={e => setSelectedUserId(Number(e.target.value) || null)}>
//             <option value="">בחרי משתמש</option>
//             {users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.email})</option>)}
//           </select>

//           <select
//             value={selectedRoleId ?? ""}
//             onChange={e => setSelectedRoleId(Number(e.target.value) || null)}
//           >
//             <option value="">בחרי תפקיד</option>
//             {roles.map(r => {
//               const already = selectedUserId ? (userRolesMap.get(selectedUserId)?.includes(r.id)) : false;
//               return (
//                 <option key={r.id} value={r.id} disabled={already}>
//                   {r.roleName}{already ? " (כבר משויך)" : ""}
//                 </option>
//               );
//             })}
//           </select>

//           <button onClick={onAssign}>שייכי</button>
//         </div>
//       </section>

//       <section style={{ border: "1px solid #ddd", padding: 16, borderRadius: 12 }}>
//         <h3>משתמשים</h3>

//         <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
//           <input placeholder="סינון לפי שם תפקיד (למשל Admin)"
//                  value={filterRole}
//                  onChange={e => setFilterRole(e.target.value)} />
//           <button onClick={onFilterByRole}>סנני לפי תפקיד</button>
//           <button onClick={refresh}>ניקוי סינון</button>
//         </div>

//         <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ background: "#f9f9f9" }}>
//               <th align="left">Id</th>
//               <th align="left">Username</th>
//               <th align="left">Email</th>
//               <th align="left">Roles</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map(u => (
//               <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
//                 <td>{u.id}</td>
//                 <td>{u.username}</td>
//                 <td>{u.email}</td>
//                 <td>{(u.userRoles ?? []).map(ur => ur.role?.roleName).filter(Boolean).join(", ")}</td>
//                 <td><button onClick={() => onDeleteUser(u.id)}>מחקי</button></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </div>
//   );
// }
/**
 * Top-level layout with gradient background, header, tabs, and pages.
 * Uses i18n and keeps RTL/LTR in sync via useDirection hook.
 */
import "./index.css";
import "./i18n";              // init i18n once
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "./hooks/useDirection";
import Tabs from "./components/Tabs";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function App() {
  useDirection(); // sync dir/lang attributes
  const { t } = useTranslation();
  const [tab, setTab] = useState<"users" | "roles">("users");

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">🔐 {t("app.title")}</h1>
          <div className="app-subtitle">{t("app.subtitle")}</div>
        </div>
        <LanguageSwitcher />
      </header>

      <Tabs
        active={tab}
        onChange={setTab}
        labels={{ users: t("tabs.users"), roles: t("tabs.roles") }}
      />

      <main className="app-main">
        {tab === "users" ? <UsersPage /> : <RolesPage />}
      </main>
    </div>
  );
}
