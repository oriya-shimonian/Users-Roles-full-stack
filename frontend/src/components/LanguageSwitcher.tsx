/**
 * LanguageSwitcher
 *
 * Purpose:
 * - Toggles between "en" and "he" using i18next.
 * - Works in tandem with a global direction hook (e.g., `useDirection`)
 *   that sets <html dir="rtl|ltr"> based on the active language.
 *
 * Assumptions:
 * - i18n is initialized once in app bootstrap.
 * - The current language is available at `i18n.language`.
 *
 * UX:
 * - Button label shows the current language code in uppercase (EN/HE).
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
