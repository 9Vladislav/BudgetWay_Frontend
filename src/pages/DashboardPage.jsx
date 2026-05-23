import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Sidebar } from "../components/Sidebar";
import { getDashboard } from "../api/dashboard";

function LocationIcon() {
  return (
    <svg
      className="h-5 w-5 text-[#079d92]"
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

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5 text-[#2563ff]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <span className="text-[22px] font-semibold leading-none text-green-600">
      ₴
    </span>
  );
}

function SmallCalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function SmallLocationIcon() {
  return (
    <svg
      className="h-4 w-4"
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

function getNumber(value) {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}

function round(value) {
  return Number(getNumber(value).toFixed(2));
}

function formatDate(value) {
  if (!value) return new Date().toLocaleDateString("uk-UA");

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("uk-UA");
}

function formatMoney(value) {
  return `₴${round(value).toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDistance(value) {
  return `${round(value).toLocaleString("uk-UA")} км`;
}

function normalizeRecentTrip(trip) {
  return {
    id: trip.id,
    title: trip.name,
    date: formatDate(trip.createdAt),
    distance: trip.distanceKm ? `${round(trip.distanceKm)} км` : "—",
    price: formatMoney(trip.totalCost),
  };
}

export function DashboardPage() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalTrips: 0,
    totalDistance: 0,
    totalSpent: 0,
    recentTrips: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getDashboard();

      setDashboard({
        totalTrips: getNumber(data?.totalTrips),
        totalDistance: getNumber(data?.totalDistance),
        totalSpent: getNumber(data?.totalSpent),
        recentTrips: Array.isArray(data?.recentTrips)
          ? data.recentTrips.map(normalizeRecentTrip)
          : [],
      });
    } catch (err) {
      setError(err.message || "Не вдалося завантажити панель");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onLogout={handleLogout} activePage="dashboard" />

      <main className="flex-1 px-8 py-5">
        <div className="mb-7">
          <h2 className="text-[28px] font-bold text-slate-950">Панель</h2>

          <p className="mt-2 text-[16px] text-slate-600">
            Огляд ваших поїздок та витрат
          </p>
        </div>

        {error && (
          <p className="mb-5 text-[15px] font-bold text-red-600">{error}</p>
        )}

        <div className="mb-7 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <StatCard
            title="Усього поїздок"
            value={isLoading ? "..." : String(dashboard.totalTrips)}
            subtitle="За цей рік"
            icon={<LocationIcon />}
          />

          <StatCard
            title="Загальна відстань"
            value={isLoading ? "..." : formatDistance(dashboard.totalDistance)}
            subtitle="За цей рік"
            icon={<CalendarIcon />}
          />

          <StatCard
            title="Загальні витрати"
            value={isLoading ? "..." : formatMoney(dashboard.totalSpent)}
            subtitle="За цей рік"
            icon={<MoneyIcon />}
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-[21px] font-bold text-slate-950">
              Останні поїздки
            </h3>
          </div>

          <div>
            {!isLoading && dashboard.recentTrips.length === 0 ? (
              <p className="px-6 py-5 text-[15px] font-medium text-slate-500">
                Поки що немає створених поїздок
              </p>
            ) : (
              dashboard.recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between border-b border-slate-200 px-6 py-5 last:border-b-0"
                >
                  <div>
                    <h4 className="text-[17px] font-bold text-slate-950">
                      {trip.title}
                    </h4>

                    <div className="mt-2 flex items-center gap-4 text-[14px] text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <SmallCalendarIcon />
                        {trip.date}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <SmallLocationIcon />
                        {trip.distance}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[16px] font-bold text-slate-950">
                      {trip.price}
                    </p>

                    <p className="mt-1 text-[14px] text-slate-500">
                      Загальна вартість
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-[15px] font-medium text-slate-600">{title}</p>

        {icon}
      </div>

      <p className="text-[28px] font-bold text-slate-950">{value}</p>

      <p className="mt-1 text-[14px] text-slate-500">{subtitle}</p>
    </section>
  );
}