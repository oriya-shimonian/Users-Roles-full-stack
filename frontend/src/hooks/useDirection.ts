/**
 * Keep document direction and lang attribute in sync with the current i18n language.
 * Any RTL language (here: 'he') sets dir="rtl"; otherwise dir="ltr".
 */
import { useEffect } from "react";
import i18n from "../i18n";

export function useDirection() {
  useEffect(() => {
    const update = () => {
      const lang = i18n.language || "en";
      const rtl = lang.startsWith("he");
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
    };
    update();
    i18n.on("languageChanged", update);
    return () => i18n.off("languageChanged", update);
  }, []);
}
