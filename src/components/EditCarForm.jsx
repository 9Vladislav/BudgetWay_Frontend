import React from "react";

const fuelTypeOptions = [
  { value: "Gasoline", label: "Бензин" },
  { value: "Diesel", label: "Дизель" },
  { value: "Electric", label: "Електро" },
  { value: "Hybrid", label: "Гібрид" },
];

export function EditCarForm({ carForm, error, onChange, onSubmit, onCancel }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white px-8 py-7 shadow-sm"
    >
      <h3 className="mb-6 text-[24px] font-bold text-slate-950">
        Редагувати авто
      </h3>

      <div className="grid grid-cols-2 gap-5">
        <CarFormField
          label="Назва авто"
          name="name"
          value={carForm.name}
          onChange={onChange}
          placeholder="Наприклад, Toyota Corolla"
        />

        <div>
          <label className="mb-2 block text-[14px] font-bold text-slate-700">
            Тип пального
          </label>

          <select
            name="fuelType"
            value={carForm.fuelType}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#079d92]"
          >
            {fuelTypeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <CarFormField
          label="Витрата в місті"
          name="cityConsumption"
          value={carForm.cityConsumption}
          onChange={onChange}
          placeholder="7.5"
          type="number"
        />

        <CarFormField
          label="Витрата на трасі"
          name="highwayConsumption"
          value={carForm.highwayConsumption}
          onChange={onChange}
          placeholder="5.5"
          type="number"
        />
      </div>

      {error && (
        <p className="mt-5 text-[14px] font-bold text-red-600">{error}</p>
      )}

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          className="cursor-pointer rounded-xl bg-[#079d92] px-7 py-3 text-[15px] font-bold text-white transition hover:bg-[#078b82]"
        >
          Зберегти зміни
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-xl border border-slate-300 bg-white px-7 py-3 text-[15px] font-bold text-slate-600 transition hover:bg-slate-50"
        >
          Скасувати
        </button>
      </div>
    </form>
  );
}

function CarFormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
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
        type={type}
        step="0.1"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] outline-none focus:border-[#079d92]"
      />
    </div>
  );
}