import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Sidebar } from "../components/Sidebar";
import { TripCard } from "../components/TripCard";
import { CreateTripForm } from "../components/CreateTripForm";
import { EditTripForm } from "../components/EditTripForm";
import { TripDetails } from "../components/TripDetails";

import {
  createTrip,
  deleteTrip,
  getTripById,
  getTrips,
  updateTrip,
} from "../api/trips";

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

function normalizeTrip(trip) {
  const fuel = round(trip.fuelCost ?? trip.expenses?.fuel);
  const food = round(trip.foodCost ?? trip.expenses?.food);
  const tollRoads = round(trip.tollCost ?? trip.expenses?.tollRoads);

  const accommodation = round(
    trip.accommodationCost ?? trip.expenses?.accommodation,
  );

  const other = round(trip.otherCost ?? trip.expenses?.other);

  const totalCost = round(
    trip.totalCost ?? fuel + food + tollRoads + accommodation + other,
  );

  const distanceKm = getNumber(trip.distanceKm);

  return {
    ...trip,

    id: trip.id,

    title: trip.name,
    name: trip.name,

    date: formatDate(trip.createdAt),

    distance: `${distanceKm} км`,
    distanceKm,

    price: `₴${totalCost.toFixed(2)}`,

    fuelPrice: String(trip.fuelPrice ?? ""),

    cityPercent: getNumber(trip.cityPercentage),
    cityPercentage: getNumber(trip.cityPercentage),

    totalCost,

    expenses: {
      fuel,
      food,
      tollRoads,
      accommodation,
      other,
    },
  };
}

export function HomePage() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);

  const [error, setError] = useState("");

  const loadTrips = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getTrips();

      const normalizedTrips = Array.isArray(data)
        ? data.map(normalizeTrip)
        : [];

      setTrips(normalizedTrips);
    } catch (err) {
      setError(err.message || "Не вдалося завантажити поїздки");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    navigate("/login");
  };

  const handleSaveTrip = async (newTrip) => {
    try {
      setError("");

      const createdTrip = await createTrip(newTrip);
      const normalizedTrip = normalizeTrip(createdTrip);

      setTrips([normalizedTrip, ...trips]);
      setIsCreatingTrip(false);
    } catch (err) {
      setError(err.message || "Не вдалося створити поїздку");
      throw err;
    }
  };

  const handleOpenTrip = async (trip) => {
    try {
      setError("");

      const data = await getTripById(trip.id);
      setSelectedTrip(normalizeTrip(data));
    } catch (err) {
      setError(err.message || "Не вдалося відкрити поїздку");
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      setError("");

      await deleteTrip(tripId);

      setTrips(trips.filter((trip) => trip.id !== tripId));
      setSelectedTrip(null);
    } catch (err) {
      setError(err.message || "Не вдалося видалити поїздку");
    }
  };

  const handleUpdateTrip = async (updatedTrip) => {
    try {
      setError("");

      const updatedFromServer = await updateTrip(updatedTrip.id, {
        name: updatedTrip.name,
        distanceKm: Number(updatedTrip.distanceKm),
        fuelPrice: Number(updatedTrip.fuelPrice),
        cityPercentage: Number(updatedTrip.cityPercentage),
        foodCost: Number(updatedTrip.foodCost) || 0,
        tollCost: Number(updatedTrip.tollCost) || 0,
        accommodationCost: Number(updatedTrip.accommodationCost) || 0,
        otherCost: Number(updatedTrip.otherCost) || 0,
        carId: Number(updatedTrip.carId),
      });

      const normalizedTrip = normalizeTrip(updatedFromServer);

      setTrips(
        trips.map((trip) =>
          trip.id === normalizedTrip.id ? normalizedTrip : trip,
        ),
      );

      setSelectedTrip(normalizedTrip);
      setEditingTrip(null);
    } catch (err) {
      setError(err.message || "Не вдалося оновити поїздку");
      throw err;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onLogout={handleLogout} />

      {editingTrip ? (
        <EditTripForm
          trip={editingTrip}
          onBack={() => setEditingTrip(null)}
          onSave={handleUpdateTrip}
        />
      ) : selectedTrip ? (
        <TripDetails
          trip={selectedTrip}
          onBack={() => setSelectedTrip(null)}
          onEdit={(trip) => setEditingTrip(trip)}
          onDelete={handleDeleteTrip}
        />
      ) : isCreatingTrip ? (
        <CreateTripForm
          onBack={() => setIsCreatingTrip(false)}
          onSave={handleSaveTrip}
        />
      ) : (
        <main className="flex-1 px-8 py-5">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h2 className="text-[28px] font-bold text-slate-950">
                Усі поїздки
              </h2>

              <p className="mt-2 text-[16px] text-slate-600">
                Переглядайте та керуйте історією своїх поїздок
              </p>
            </div>

            <button
              onClick={() => setIsCreatingTrip(true)}
              className="cursor-pointer rounded-xl bg-[#079d92] px-5 py-3 text-[15px] font-bold text-white shadow transition hover:bg-[#078b82]"
            >
              + Створити поїздку
            </button>
          </div>

          {error && (
            <p className="mb-5 text-[15px] font-bold text-red-600">{error}</p>
          )}

          {!isLoading && trips.length === 0 ? (
            <p className="text-[16px] font-medium text-slate-500">
              Поки що немає створених поїздок
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onClick={() => handleOpenTrip(trip)}
                />
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}