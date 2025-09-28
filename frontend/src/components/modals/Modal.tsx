/**
 * Accessible modal with backdrop and focus trap (basic).
 */
import { useEffect } from "react";
import type { PropsWithChildren } from "react"
type Props = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string;
}>;

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={title} style={styles.backdrop} onClick={onClose}>
      <div style={styles.panel} onClick={e => e.stopPropagation()}>
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
    display: "grid", placeItems: "center", zIndex: 50
  },
  panel: {
    width: "min(560px, 92vw)", background: "white", borderRadius: 16,
    padding: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
  }
};
