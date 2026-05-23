import React, { useEffect, useMemo, useState } from "react";
import carIcon from "../assets/car.png";
import { getCars } from "../api/cars";

export function CreateTripForm({ onBack, onSave }) {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    distance: "",
    fuelPrice: "",
    cityPercent: 50,
    food: "",
    tollRoads: "",
    accommodation: "",
    other: "",
  });

  const [error, setError] = useState("");
  const [isCarsLoading, setIsCarsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setIsCarsLoading(true);
        setError("");

        const data = await getCars();
        const loadedCars = Array.isArray(data) ? data : [];

        setCars(loadedCars);
        setSelectedCar(loadedCars[0] || null);
      } catch (err) {
        setError(err.message || "Не вдалося завантажити авто");
      } finally {
        setIsCarsLoading(false);
      }
    };

    loadCars();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculations = useMemo(() => {
    const distance = Number(formData.distance) || 0;
    const fuelPrice = Number(formData.fuelPrice) || 0;
    const cityPercent = Number(formData.cityPercent);
    const highwayPercent = 100 - cityPercent;

    const cityConsumption = Number(selectedCar?.cityConsumption) || 0;
    const highwayConsumption = Number(selectedCar?.highwayConsumption) || 0;

    const cityDistance = distance * (cityPercent / 100);
    const highwayDistance = distance * (highwayPercent / 100);

    const fuelLiters =
      (cityDistance * cityConsumption) / 100 +
      (highwayDistance * highwayConsumption) / 100;

    const fuelCost = fuelLiters * fuelPrice;

    const food = Number(formData.food) || 0;
    const tollRoads = Number(formData.tollRoads) || 0;
    const accommodation = Number(formData.accommodation) || 0;
    const other = Number(formData.other) || 0;

    return {
      fuelCost,
      food,
      tollRoads,
      accommodation,
      other,
      totalCost: fuelCost + food + tollRoads + accommodation + other,
      highwayPercent,
    };
  }, [formData, selectedCar]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Введіть назву поїздки");
      return;
    }

    if (!formData.distance || Number(formData.distance) <= 0) {
      setError("Введіть коректну відстань");
      return;
    }

    if (!formData.fuelPrice || Number(formData.fuelPrice) <= 0) {
      setError("Введіть коректну ціну пального");
      return;
    }

    if (!selectedCar) {
      setError("Спочатку додайте або оберіть авто");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const round = (value) => Number(value.toFixed(2));

      const newTrip = {
        name: formData.title,
        distanceKm: Number(formData.distance),
        fuelPrice: round(Number(formData.fuelPrice)),
        cityPercentage: Number(formData.cityPercent),

        foodCost: round(Number(formData.food) || 0),
        tollCost: round(Number(formData.tollRoads) || 0),
        accommodationCost: round(Number(formData.accommodation) || 0),
        otherCost: round(Number(formData.other) || 0),

        carId: selectedCar.id,
      };

      await onSave(newTrip);
    } catch (err) {
      setError(err.message || "Не вдалося зберегти поїздку");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 px-8 py-5">
      <div className="mx-auto max-w-330">
        <button
          onClick={onBack}
          className="mb-7 flex cursor-pointer items-center gap-2 text-[15px] font-bold text-slate-500 transition hover:text-[#079d92]"
        >
          ← Назад до поїздок
        </button>

        <div className="mb-8">
          <h2 className="text-[28px] font-bold text-slate-950">
            Створити нову поїздку
          </h2>

          <p className="mt-2 text-[16px] text-slate-600">
            Розрахуйте витрати на поїздку в реальному часі
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex items-start gap-6">
          <div className="flex w-full max-w-205 flex-col gap-6">
            <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h3 className="mb-5 text-[21px] font-bold text-slate-950">
                Деталі поїздки
              </h3>

              <label className="mb-2 block text-[14px] font-bold text-slate-700">
                Назва поїздки
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Поїздка до Києва"
                className="mb-5 w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] outline-none focus:border-[#079d92]"
              />

              <div className="mb-5 grid grid-cols-2 gap-4">
                <InputField
                  label="Відстань (км)"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder="450"
                />

                <InputField
                  label="Ціна пального (₴/л)"
                  name="fuelPrice"
                  value={formData.fuelPrice}
                  onChange={handleChange}
                  placeholder="55.00"
                  step="0.01"
                />
              </div>

              <p className="mb-4 text-[14px] font-bold text-slate-700">
                Співвідношення міста / траси: {formData.cityPercent}% місто /{" "}
                {calculations.highwayPercent}% траса
              </p>

              <input
                type="range"
                name="cityPercent"
                min="0"
                max="100"
                value={formData.cityPercent}
                onChange={handleChange}
                className="trip-range mb-3 w-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #079d92 0%, #079d92 ${formData.cityPercent}%, #e5e7eb ${formData.cityPercent}%, #e5e7eb 100%)`,
                }}
              />

              <div className="mb-5 flex justify-between text-[13px] text-slate-500">
                <span>100% місто</span>
                <span>100% траса</span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  disabled={isCarsLoading || cars.length === 0}
                  onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-[#079d92] hover:bg-[#f8fffd] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <img
                      src={carIcon}
                      alt="Car"
                      className="h-5 w-5 object-contain"
                    />

                    <p className="text-[14px] text-slate-600">
                      {selectedCar
                        ? `Обране авто: ${selectedCar.name}`
                        : "Авто не знайдено"}
                    </p>
                  </div>

                  {selectedCar && (
                    <div className="flex justify-between text-[14px] text-slate-600">
                      <span>
                        Витрата в місті:{" "}
                        <b className="text-slate-900">
                          {selectedCar.cityConsumption} л/100 км
                        </b>
                      </span>

                      <span>
                        Витрата на трасі:{" "}
                        <b className="text-slate-900">
                          {selectedCar.highwayConsumption} л/100 км
                        </b>
                      </span>
                    </div>
                  )}
                </button>

                {isCarDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                    {cars.map((car) => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => {
                          setSelectedCar(car);
                          setIsCarDropdownOpen(false);
                        }}
                        className={`w-full cursor-pointer px-4 py-3 text-left transition hover:bg-emerald-50 ${
                          selectedCar?.id === car.id
                            ? "bg-emerald-50"
                            : "bg-white"
                        }`}
                      >
                        <p className="text-[14px] font-bold text-slate-800">
                          {car.name}
                        </p>

                        <p className="mt-1 text-[13px] text-slate-500">
                          Місто: {car.cityConsumption} л/100 км · Траса:{" "}
                          {car.highwayConsumption} л/100 км
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
              <h3 className="mb-5 text-[21px] font-bold text-slate-950">
                Додаткові витрати
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <ExpenseInput
                  label="Їжа (₴)"
                  name="food"
                  value={formData.food}
                  onChange={handleChange}
                />

                <ExpenseInput
                  label="Платні дороги (₴)"
                  name="tollRoads"
                  value={formData.tollRoads}
                  onChange={handleChange}
                />

                <ExpenseInput
                  label="Проживання (₴)"
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleChange}
                />

                <ExpenseInput
                  label="Інше (₴)"
                  name="other"
                  value={formData.other}
                  onChange={handleChange}
                />
              </div>
            </section>
          </div>

          <aside className="w-88 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-6">
            <h3 className="mb-7 text-[20px] font-bold text-slate-950">
              Підсумок витрат
            </h3>

            <div className="mb-6 space-y-4 text-[14px] text-slate-600">
              <SummaryRow label="Пальне" value={calculations.fuelCost} />

              {calculations.food > 0 && (
                <SummaryRow label="Їжа" value={calculations.food} />
              )}

              {calculations.tollRoads > 0 && (
                <SummaryRow
                  label="Платні дороги"
                  value={calculations.tollRoads}
                />
              )}

              {calculations.accommodation > 0 && (
                <SummaryRow
                  label="Проживання"
                  value={calculations.accommodation}
                />
              )}

              {calculations.other > 0 && (
                <SummaryRow label="Інше" value={calculations.other} />
              )}
            </div>

            <div className="mb-6 h-px bg-emerald-200" />

            <div className="mb-6 flex items-center justify-between">
              <span className="text-[18px] font-bold text-slate-950">
                Загальна сума
              </span>

              <span className="text-[28px] font-bold text-green-700">
                ₴{calculations.totalCost.toFixed(2)}
              </span>
            </div>

            {error && (
              <p className="mb-4 text-center text-[14px] font-bold text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving || isCarsLoading}
              className="mb-3 w-full cursor-pointer rounded-xl bg-[#079d92] py-3 text-[15px] font-bold text-white transition hover:bg-[#078b82] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Зберегти поїздку
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full cursor-pointer rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-[15px] font-bold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              Скасувати
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}

function InputField({ label, name, value, onChange, placeholder, step = "1" }) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-bold text-slate-700">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="number"
        step={step}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] outline-none focus:border-[#079d92]"
      />
    </div>
  );
}

function ExpenseInput({ label, name, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-bold text-slate-700">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder="0.00"
        type="number"
        step="0.01"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] outline-none focus:border-[#079d92]"
      />
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <b className="text-slate-950">₴{value.toFixed(2)}</b>
    </div>
  );
}