import React from "react";

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

function CalendarIcon() {
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

export function TripCard({ trip, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9fbef] text-[#079d92]">
          <LocationIcon className="h-7 w-7" />
        </div>

        <p className="text-[21px] font-bold text-green-700">
          {trip.price}
        </p>
      </div>

      <h3 className="mb-4 text-[17px] font-bold text-slate-950">
        {trip.title}
      </h3>

      <div className="space-y-2 text-[14px] font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <CalendarIcon />
          {trip.date}
        </div>

        <div className="flex items-center gap-2">
          <LocationIcon className="h-4 w-4" />
          {trip.distance}
        </div>
      </div>
    </div>
  );
}