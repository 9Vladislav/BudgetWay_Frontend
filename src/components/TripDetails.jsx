import React, { useMemo, useState } from "react";

function CalendarIcon() {
  return (
    <svg
      className="h-5 w-5"
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

function LocationIcon() {
  return (
    <svg
      className="h-5 w-5"
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

export function TripDetails({ trip, onBack, onEdit, onDelete }) {
  const [activeExpense, setActiveExpense] = useState(null);

  const expenses = trip.expenses || {
    fuel: 0,
    food: 0,
    tollRoads: 0,
    accommodation: 0,
    other: 0,
  };

  const total =
    expenses.fuel +
    expenses.food +
    expenses.tollRoads +
    expenses.accommodation +
    expenses.other;

  const visibleExpenses = [
    { label: "Пальне", value: expenses.fuel, color: "#059669" },
    { label: "Їжа", value: expenses.food, color: "#0d9488" },
    { label: "Платні дороги", value: expenses.tollRoads, color: "#14b8a6" },
    { label: "Проживання", value: expenses.accommodation, color: "#2dd4bf" },
    { label: "Інше", value: expenses.other, color: "#5eead4" },
  ].filter((item) => item.value > 0);

  const percent = (value) => {
    if (total <= 0) return 0;
    return Math.round((value / total) * 100);
  };

  const pieSlices = useMemo(() => {
    let startAngle = -90;

    return visibleExpenses.map((expense) => {
      const angle = (expense.value / total) * 360;
      const endAngle = startAngle + angle;
      const middleAngle = startAngle + angle / 2;

      const path = createPieSlicePath(150, 150, 120, startAngle, endAngle);
      const tooltipPosition = polarToCartesian(150, 150, 155, middleAngle);

      const slice = {
        ...expense,
        path,
        percent: percent(expense.value),
        tooltipX: tooltipPosition.x,
        tooltipY: tooltipPosition.y,
      };

      startAngle = endAngle;

      return slice;
    });
  }, [visibleExpenses, total]);

  return (
    <main className="flex-1 px-7 py-4">
      <button
        onClick={onBack}
        className="mb-6 flex cursor-pointer items-center gap-2 text-[14px] font-bold text-slate-500 transition hover:text-[#079d92]"
      >
        ← Назад до поїздок
      </button>

      <div className="mb-7 flex items-start justify-between">
        <div>
          <h2 className="text-[30px] font-bold text-slate-950">
            {trip.title}
          </h2>

          <div className="mt-4 flex items-center gap-6 text-[16px] text-slate-500">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              {trip.date}
            </div>

            <div className="flex items-center gap-2">
              <LocationIcon />
              {trip.distance}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onEdit(trip)}
            className="cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[15px] font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Редагувати
          </button>

          <button
            onClick={() => onDelete(trip.id)}
            className="cursor-pointer rounded-xl border border-red-300 bg-white px-5 py-2.5 text-[15px] font-bold text-red-600 transition hover:bg-red-50"
          >
            Видалити
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-5">
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5">
          <p className="text-[16px] text-slate-600">
            Загальна вартість поїздки
          </p>

          <p className="mt-5 text-[38px] font-bold text-green-700">
            ₴{total.toFixed(2)}
          </p>

          <p className="mt-2 text-[15px] text-slate-500">
            Усі витрати враховано
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <h3 className="mb-7 text-[21px] font-bold text-slate-950">
            Структура витрат
          </h3>

          <div className="space-y-5">
            {visibleExpenses.map((expense) => (
              <div
                key={expense.label}
                className="flex justify-between text-[16px] text-slate-600"
              >
                <span>{expense.label}</span>

                <b className="text-slate-950">
                  ₴{expense.value.toFixed(2)}
                </b>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <h3 className="mb-8 text-[21px] font-bold text-slate-950">
          Розподіл витрат
        </h3>

        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="360" height="360" viewBox="0 0 300 300">
              {pieSlices.map((slice) => (
                <path
                  key={slice.label}
                  d={slice.path}
                  fill={slice.color}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition hover:opacity-80"
                  onMouseEnter={() => setActiveExpense(slice)}
                  onMouseLeave={() => setActiveExpense(null)}
                />
              ))}
            </svg>

            {activeExpense && (
              <div
                className="absolute z-10 rounded-xl bg-white px-3 py-2 text-center shadow-lg"
                style={{
                  left: `${(activeExpense.tooltipX / 300) * 360}px`,
                  top: `${(activeExpense.tooltipY / 300) * 360}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <p className="text-[14px] font-bold text-slate-900">
                  {activeExpense.label}
                </p>

                <p className="mt-1 whitespace-nowrap text-[13px] text-slate-500">
                  {activeExpense.percent}% · ₴
                  {activeExpense.value.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-4 text-[15px] text-slate-600">
            {pieSlices.map((expense) => (
              <div key={expense.label} className="flex items-center gap-2">
                <span
                  className="h-3.5 w-3.5"
                  style={{ backgroundColor: expense.color }}
                />

                <span>
                  {expense.label} {expense.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function createPieSlicePath(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}