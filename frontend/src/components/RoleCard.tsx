/**
 * Styled role card with icon, name and count.
 */
type Props = { name: string; usersCount?: number; onView?: () => void };

export default function RoleCard({ name, usersCount, onView }: Props) {
  return (
    <div style={{
      border: "1px solid #eee",
      borderRadius: 20,
      padding: 16,
      background: "linear-gradient(180deg, #faf8ff, #ffffff)",
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "#f3e8ff", display: "grid", placeItems: "center", color: "#7c3aed"
          }}>🛡️</div>
          <div>
            <div style={{ fontWeight: 700 }}>{name}</div>
            {typeof usersCount === "number" && (
              <div style={{ color: "#6b7280", fontSize: 13 }}>{usersCount} users</div>
            )}
          </div>
        </div>
        {onView && (
          <button
            onClick={onView}
            style={{
              padding: "10px 12px", borderRadius: 10, border: "none",
              background: "linear-gradient(90deg,#8b5cf6,#7c3aed)", color: "white"
            }}
          >
            View Users
          </button>
        )}
      </div>
    </div>
  );
}
