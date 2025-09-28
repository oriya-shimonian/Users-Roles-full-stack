/**
 * Simple EN/HE language switcher. Toggles i18n and thus document direction.
 */
import i18n from "../i18n";

export default function LanguageSwitcher() {
  const lang = i18n.language || "en";
  const switchTo = lang.startsWith("he") ? "en" : "he";
  return (
    <button
      onClick={() => i18n.changeLanguage(switchTo)}
      style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "white" }}
      aria-label="Switch language"
      title={`Switch to ${switchTo.toUpperCase()}`}
    >
      {lang.toUpperCase()}
    </button>
  );
}
