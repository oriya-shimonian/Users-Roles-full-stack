/**
 * Generic confirmation dialog built on top of Modal.
 * Pass a title/message and confirm/cancel handlers.
 */
import type { CSSProperties } from "react";
import Modal from "./Modal";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
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
