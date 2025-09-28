/**
 * Minimal tabs for Users/Roles. Controlled by parent (App).
 */
type Props = {
  active: "users" | "roles";
  onChange: (tab: "users" | "roles") => void;
  labels: { users: string; roles: string };
};

export default function Tabs({ active, onChange, labels }: Props) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
      <button
        onClick={() => onChange("users")}
        style={{
          padding: "10px 16px", borderRadius: 12,
          border: active === "users" ? "1px solid #7c3aed" : "1px solid #ddd",
          background: active === "users" ? "#7c3aed" : "white",
          color: active === "users" ? "white" : "inherit"
        }}
      >{labels.users}</button>
      <button
        onClick={() => onChange("roles")}
        style={{
          padding: "10px 16px", borderRadius: 12,
          border: active === "roles" ? "1px solid #7c3aed" : "1px solid #ddd",
          background: active === "roles" ? "#7c3aed" : "white",
          color: active === "roles" ? "white" : "inherit"
        }}
      >{labels.roles}</button>
    </div>
  );
}
