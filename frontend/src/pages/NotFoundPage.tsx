/**
 * Not Found page with a looping MP4 animation and navigation actions.
 * The video is muted to allow autoplay across browsers.
 */
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import notFoundVideo from "../assets/404 Error.mp4";
import type { CSSProperties } from "react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.media}>
          <video
            src={notFoundVideo}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", borderRadius: 16, objectFit: "cover" }}
            aria-label="404 animation"
          />
        </div>
        <h2 style={styles.title}>404 • {t("notfound.title")}</h2>
        <p style={styles.desc}>{t("notfound.message")}</p>
        <div style={styles.actions}>
          <button
            onClick={() => navigate(-1)}
            style={styles.secondaryBtn}
          >
            {t("button.back")}
          </button>
          <button
            onClick={() => navigate("/users")}
            style={styles.primaryBtn}
          >
            {t("button.goHome")}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { display: "grid", placeItems: "center", minHeight: "60vh", padding: 24 },
  card: {
    width: "min(720px, 92vw)",
    background: "white",
    border: "1px solid #eee",
    borderRadius: 20,
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    textAlign: "center"
  },
  media: { height: 280, borderRadius: 16, overflow: "hidden", marginBottom: 12 },
  title: { margin: "8px 0 6px", color: "#111827" },
  desc: { margin: 0, color: "#6b7280" },
  actions: { display: "flex", gap: 10, justifyContent: "center", marginTop: 14 },
  secondaryBtn: {
    padding: "10px 16px", borderRadius: 12, border: "1px solid #ddd", background: "white", cursor: "pointer"
  },
  primaryBtn: {
    padding: "10px 16px", borderRadius: 12, border: "none",
    background: "linear-gradient(90deg,#8b5cf6,#7c3aed)", color: "white", cursor: "pointer"
  }
};
