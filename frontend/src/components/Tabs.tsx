
/**
 * Props for Tabs
 * @property active   The currently active tab key ("users" | "roles").
 * @property onChange Callback fired with the next tab key when a tab is clicked.
 * @property labels   Display labels for the two tabs (i18n-friendly).
 */
type Props = {
  active: "users" | "roles";
  onChange: (tab: "users" | "roles") => void;
  labels: { users: string; roles: string };
};

/**
 * Tabs (controlled)
 *
 * Purpose:
 * - Minimal two-tab switcher (Users / Roles).
 * - Controlled component: parent owns the state and passes `active` + `onChange`.
 *
 * Accessibility:
 * - Visual-only tabs. For full WAI-ARIA tab semantics, add role="tablist"/"tab"
 *   and keyboard navigation. Current implementation is sufficient for the task scope.
 */
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
