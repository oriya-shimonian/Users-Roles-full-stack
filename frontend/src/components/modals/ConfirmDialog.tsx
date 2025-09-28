/**
 * Generic confirmation dialog built on top of <Modal />.
 * - Shows an optional message and two actions (Cancel / Confirm).
 * - Useful for destructive actions (e.g., deleting a user).
 */
import type { CSSProperties } from "react";  // type-only (verbatimModuleSyntax)
import { useTranslation } from "react-i18next";
import Modal from "./Modal";

type Props = {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Header text shown inside the modal title. */
  title: string;
  /** Optional body text. */
  message?: string;
  /** Optional label override for the confirm button. */
  confirmText?: string;
  /** Optional label override for the cancel button. */
  cancelText?: string;
  /** Called when the user confirms. */
  onConfirm: () => void;
  /** Called when the dialog should close (backdrop, ESC, or Cancel). */
  onClose: () => void;
};


export default function ConfirmDialog({
  open, title, message,
  confirmText, cancelText,
  onConfirm, onClose
}: Props) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {message && <p style={styles.message}>{message}</p>}
      <div style={styles.actions}>
        <button onClick={onClose} style={styles.cancel}>
          {cancelText ?? t("button.close")}
        </button>
        <button onClick={onConfirm} style={styles.confirm}>
          {confirmText ?? t("button.save")}
        </button>
      </div>
    </Modal>
  );
}

const styles: Record<string, CSSProperties> = {
  message: { margin: "8px 0 16px", color: "#344", lineHeight: 1.35 },
  actions: { display: "flex", gap: 8, justifyContent: "flex-end" },
  cancel: { padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", background: "white" },
  confirm: { padding: "10px 14px", borderRadius: 10, border: "none",
             background: "linear-gradient(90deg,#ef4444,#dc2626)", color: "white" }
};
