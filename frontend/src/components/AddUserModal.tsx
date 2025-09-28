/**
 * Add User modal with simple validation.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import { createUser } from "../api/users";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export default function AddUserModal({ open, onClose, onCreated }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !mail.trim()) return;
    await createUser(name.trim(), mail.trim());
    setName(""); setMail("");
    await onCreated();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={t("button.addUser")}>
      <form onSubmit={onSave} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder={t("form.username")}
          value={name}
          onChange={e => setName(e.target.value)}
          minLength={2} required
          style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
        />
        <input
          placeholder={t("form.email")}
          type="email"
          value={mail}
          onChange={e => setMail(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 12, border: "1px solid #ddd" }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose}
                  style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", background: "white" }}>
            {t("button.close")}
          </button>
          <button type="submit"
                  style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: "linear-gradient(90deg,#22c55e,#16a34a)", color: "white" }}>
            {t("button.save")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
