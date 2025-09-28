/**
 * Modal (accessible baseline)
 *
 * Features:
 * - Renders a centered panel with a backdrop.
 * - Closes on ESC key and on backdrop click.
 * - Prevents click-through by stopping propagation on the panel.
 *
 * Accessibility:
 * - Uses role="dialog" and aria-modal="true".
 * - Accepts an optional `title` used as aria-label.
 * - NOTE: Focus trap is minimal (ESC + backdrop). For full trap, integrate with
 *   a library or add focus management (initial focus + tab cycle).
 *
 * Usage:
 *   <Modal open={open} onClose={() => setOpen(false)} title="My dialog">
 *     ...content...
 *   </Modal>
 *
 * Styling:
 * - Inline styles keep the component self-contained.
 * - Override or replace with a design system as needed.
 */
import { useEffect } from "react";
import type { PropsWithChildren } from "react"

/**
 * Props for Modal
 * @property open     Controls visibility.
 * @property onClose  Invoked when user dismisses (ESC or backdrop click).
 * @property title    Optional heading for accessibility (aria-label).
 * @property children Dialog content.
 */
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

/**
 * Inline style tokens for the modal:
 * - `backdrop`: fixed full-screen overlay with semi-transparent background.
 * - `panel`: centered container with rounded corners and shadow.
 * Extract into CSS modules or a design system when scaling.
 */
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
