/**
 * Top-level layout with gradient background, header, tabs, and pages.
 * Uses i18n and keeps RTL/LTR in sync via useDirection hook.
 */
import "./index.css";
import "./i18n";             
import { useTranslation } from "react-i18next";
import { useDirection } from "./hooks/useDirection";
import Tabs from "./components/Tabs";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  useDirection(); 
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const active = location.pathname.startsWith("/roles") ? "roles" : "users";


  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">🔐 {t("app.title")}</h1>
          <div className="app-subtitle">{t("app.subtitle")}</div>
        </div>
        <LanguageSwitcher />
      </header>

      <Tabs
        active={active as "users" | "roles"}
        onChange={(tab) => navigate(tab === "users" ? "/users" : "/roles")}
        labels={{ users: t("tabs.users"), roles: t("tabs.roles") }}
      />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
