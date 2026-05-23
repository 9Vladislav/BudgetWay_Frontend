import React from "react";
import { useNavigate } from "react-router-dom";

function LocationIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.6-4 5-6 8-6s6.4 2 8 6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function Sidebar({ onLogout, activePage = "trips" }) {
  const navigate = useNavigate();

  return (
    <aside className="sticky top-0 flex h-screen w-68 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-7">
        <h1 className="text-[26px] font-bold text-slate-950">BudgetWay</h1>

        <p className="mt-1 text-[16px] text-slate-500">
          Планувальник подорожей
        </p>
      </div>

      <nav className="flex-1 px-5 py-6">
        <button
          onClick={() => navigate("/home")}
          className={`flex w-full cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-left text-[17px] transition ${
            activePage === "trips"
              ? "bg-[#eef4ff] font-bold text-[#2563ff]"
              : "font-medium text-slate-500 hover:bg-slate-100"
          }`}
        >
          <LocationIcon className="h-5 w-5" />
          Поїздки
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className={`mt-3 flex w-full cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-left text-[17px] transition ${
            activePage === "dashboard"
              ? "bg-[#eef4ff] font-bold text-[#2563ff]"
              : "font-medium text-slate-500 hover:bg-slate-100"
          }`}
        >
          <GridIcon />
          Панель
        </button>

        <button
          onClick={() => navigate("/profile")}
          className={`mt-3 flex w-full cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-left text-[17px] transition ${
            activePage === "profile"
              ? "bg-[#eef4ff] font-bold text-[#2563ff]"
              : "font-medium text-slate-500 hover:bg-slate-100"
          }`}
        >
          <UserIcon />
          Профіль
        </button>
      </nav>

      <div className="border-t border-slate-200 px-6 py-6">
        <button
          onClick={onLogout}
          className="flex cursor-pointer items-center gap-4 text-[17px] font-bold text-slate-500 transition hover:text-[#079d92]"
        >
          <LogoutIcon />
          Вийти
        </button>
      </div>
    </aside>
  );
}