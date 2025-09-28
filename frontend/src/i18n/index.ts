import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/common.json";
import he from "./locales/he/common.json";

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, he: { translation: he } },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
