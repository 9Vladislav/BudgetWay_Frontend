import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Sidebar } from "../components/Sidebar";
import { AddCarForm } from "../components/AddCarForm";
import { EditCarForm } from "../components/EditCarForm";

import { getUserProfile, updateUserProfile } from "../api/users";
import { createCar, deleteCar, getCars, updateCar } from "../api/cars";

import carIcon from "../assets/car.png";
import mailIcon from "../assets/mail.png";
import userIcon from "../assets/user.png";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";
import lockIcon from "../assets/lock.png";

const fuelTypeLabels = {
  Gasoline: "Бензин",
  Diesel: "Дизель",
  Electric: "Електро",
  Hybrid: "Гібрид",
};

const emptyCarForm = {
  name: "",
  fuelType: "Gasoline",
  cityConsumption: "",
  highwayConsumption: "",
};

const emptyProfileData = {
  firstName: "",
  lastName: "",
  email: "",
  currentPassword: "",
  newPassword: "",
};

function getCarUnit(fuelType) {
  return fuelType === "Electric" ? "кВт/100км" : "л/100км";
}

function normalizeCar(car) {
  return {
    ...car,
    cityConsumption: String(car.cityConsumption ?? ""),
    highwayConsumption: String(car.highwayConsumption ?? ""),
    unit: getCarUnit(car.fuelType),
  };
}

export function ProfilePage() {
  const navigate = useNavigate();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isCreatingCar, setIsCreatingCar] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [profileError, setProfileError] = useState("");
  const [carError, setCarError] = useState("");
  const [cars, setCars] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [profileData, setProfileData] = useState(emptyProfileData);
  const [carForm, setCarForm] = useState(emptyCarForm);

  const loadProfilePage = async () => {
    try {
      setIsLoading(true);
      setProfileError("");
      setCarError("");

      const [profile, carsData] = await Promise.all([
        getUserProfile(),
        getCars(),
      ]);

      setProfileData({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        email: profile?.email || "",
        currentPassword: "",
        newPassword: "",
      });

      setCars(Array.isArray(carsData) ? carsData.map(normalizeCar) : []);
    } catch (err) {
      setProfileError(err.message || "Не вдалося завантажити профіль");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfilePage();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    navigate("/login");
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const validateProfile = () => {
    if (!profileData.firstName.trim()) return "Введіть ім’я";
    if (!profileData.lastName.trim()) return "Введіть прізвище";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(profileData.email)) {
      return "Введіть коректну електронну пошту";
    }

    if (profileData.newPassword && profileData.newPassword.length < 6) {
      return "Новий пароль має містити мінімум 6 символів";
    }

    if (profileData.newPassword && !profileData.currentPassword) {
      return "Введіть поточний пароль";
    }

    return "";
  };

  const handleProfileButtonClick = async () => {
    if (!isEditingProfile) {
      setProfileError("");
      setIsEditingProfile(true);
      return;
    }

    const error = validateProfile();

    if (error) {
      setProfileError(error);
      return;
    }

    try {
      setProfileError("");

      const updatedProfile = await updateUserProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword,
      });

      setProfileData({
        firstName: updatedProfile?.firstName || profileData.firstName,
        lastName: updatedProfile?.lastName || profileData.lastName,
        email: updatedProfile?.email || profileData.email,
        currentPassword: "",
        newPassword: "",
      });

      setIsEditingProfile(false);
    } catch (err) {
      setProfileError(err.message || "Не вдалося оновити профіль");
    }
  };

  const handleCarChange = (e) => {
    const { name, value } = e.target;
    setCarForm({ ...carForm, [name]: value });
  };

  const validateCar = () => {
    if (!carForm.name.trim()) return "Введіть назву авто";
    if (!carForm.fuelType.trim()) return "Оберіть тип пального";

    const cityValue = Number(carForm.cityConsumption);
    const highwayValue = Number(carForm.highwayConsumption);

    if (!carForm.cityConsumption || isNaN(cityValue)) {
      return "Введіть коректну витрату в місті";
    }

    if (!carForm.highwayConsumption || isNaN(highwayValue)) {
      return "Введіть коректну витрату на трасі";
    }

    if (cityValue < 0.1 || cityValue > 100) {
      return "Витрата в місті має бути від 0.1 до 100";
    }

    if (highwayValue < 0.1 || highwayValue > 100) {
      return "Витрата на трасі має бути від 0.1 до 100";
    }

    return "";
  };

  const handleStartCreateCar = () => {
    setEditingCar(null);
    setCarForm(emptyCarForm);
    setCarError("");
    setIsCreatingCar(true);
  };

  const handleAddCar = async (e) => {
    e.preventDefault();

    const error = validateCar();

    if (error) {
      setCarError(error);
      return;
    }

    try {
      setCarError("");

      const createdCar = await createCar(carForm);
      const normalizedCar = normalizeCar(createdCar);

      setCars([normalizedCar, ...cars]);
      setCarForm(emptyCarForm);
      setIsCreatingCar(false);
    } catch (err) {
      setCarError(err.message || "Не вдалося створити авто");
    }
  };

  const handleStartEditCar = (car) => {
    setIsCreatingCar(false);
    setEditingCar(car);
    setCarError("");

    setCarForm({
      name: car.name,
      fuelType: car.fuelType,
      cityConsumption: car.cityConsumption,
      highwayConsumption: car.highwayConsumption,
    });
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();

    const error = validateCar();

    if (error) {
      setCarError(error);
      return;
    }

    try {
      setCarError("");

      const updatedFromServer = await updateCar(editingCar.id, carForm);
      const normalizedCar = normalizeCar(updatedFromServer);

      setCars(
        cars.map((car) =>
          car.id === normalizedCar.id ? normalizedCar : car,
        ),
      );

      setEditingCar(null);
      setCarForm(emptyCarForm);
    } catch (err) {
      setCarError(err.message || "Не вдалося оновити авто");
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      setCarError("");

      await deleteCar(carId);

      setCars(cars.filter((car) => car.id !== carId));
    } catch (err) {
      setCarError(err.message || "Не вдалося видалити авто");
    }
  };

  const handleCancelCarForm = () => {
    setIsCreatingCar(false);
    setEditingCar(null);
    setCarForm(emptyCarForm);
    setCarError("");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onLogout={handleLogout} activePage="profile" />

      <main className="flex-1 px-8 py-5">
        <div className="mb-7">
          <h2 className="text-[28px] font-bold text-slate-950">Профіль</h2>
          <p className="mt-2 text-[16px] text-slate-600">
            Керуйте особистою інформацією
          </p>
        </div>

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-linear-to-r from-emerald-50 to-blue-50 px-8 py-10">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#079d92] text-[26px] font-bold text-white shadow-md">
                {profileData.firstName[0] || "?"}
                {profileData.lastName[0] || "?"}
              </div>

              <div>
                <h3 className="text-[25px] font-bold text-slate-950">
                  {profileData.firstName} {profileData.lastName}
                </h3>

                <p className="mt-1 text-[16px] text-slate-600">
                  {profileData.email}
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-7">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[21px] font-bold text-slate-950">
                Особиста інформація
              </h3>

              <button
                onClick={handleProfileButtonClick}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#079d92] px-5 py-2.5 text-[15px] font-bold text-white transition hover:bg-[#078b82]"
              >
                <img
                  src={editIcon}
                  alt="Edit"
                  className="h-4 w-4 brightness-0 invert"
                />

                {isEditingProfile
                  ? "Зберегти профіль"
                  : "Редагувати профіль"}
              </button>
            </div>

            <div className="space-y-5">
              <ProfileInput
                icon={userIcon}
                label="Ім’я"
                name="firstName"
                value={profileData.firstName}
                disabled={!isEditingProfile}
                onChange={handleProfileChange}
              />

              <ProfileInput
                icon={userIcon}
                label="Прізвище"
                name="lastName"
                value={profileData.lastName}
                disabled={!isEditingProfile}
                onChange={handleProfileChange}
              />

              <ProfileInput
                icon={mailIcon}
                label="Email"
                name="email"
                value={profileData.email}
                disabled={!isEditingProfile}
                onChange={handleProfileChange}
              />

              {isEditingProfile && (
                <>
                  <ProfileInput
                    icon={lockIcon}
                    label="Поточний пароль"
                    name="currentPassword"
                    value={profileData.currentPassword}
                    disabled={false}
                    onChange={handleProfileChange}
                    type="password"
                  />

                  <ProfileInput
                    icon={lockIcon}
                    label="Новий пароль"
                    name="newPassword"
                    value={profileData.newPassword}
                    disabled={false}
                    onChange={handleProfileChange}
                    type="password"
                  />
                </>
              )}

              {!isEditingProfile && (
                <ProfileInput
                  icon={lockIcon}
                  label="Пароль"
                  name="password"
                  value="••••••"
                  disabled={true}
                  onChange={() => {}}
                />
              )}
            </div>

            {profileError && (
              <p className="mt-5 text-[14px] font-bold text-red-600">
                {profileError}
              </p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h3 className="text-[25px] font-bold text-slate-950">
                Мій гараж
              </h3>

              <p className="mt-1 text-[15px] text-slate-600">
                Керуйте своїми автомобілями
              </p>
            </div>

            {!isCreatingCar && !editingCar && (
              <button
                onClick={handleStartCreateCar}
                className="cursor-pointer rounded-xl bg-[#079d92] px-5 py-3 text-[15px] font-bold text-white shadow transition hover:bg-[#078b82]"
              >
                + Додати авто
              </button>
            )}
          </div>

          {carError && !isCreatingCar && !editingCar && (
            <p className="mb-5 text-[14px] font-bold text-red-600">
              {carError}
            </p>
          )}

          {isCreatingCar ? (
            <AddCarForm
              carForm={carForm}
              error={carError}
              onChange={handleCarChange}
              onSubmit={handleAddCar}
              onCancel={handleCancelCarForm}
            />
          ) : editingCar ? (
            <EditCarForm
              carForm={carForm}
              error={carError}
              onChange={handleCarChange}
              onSubmit={handleUpdateCar}
              onCancel={handleCancelCarForm}
            />
          ) : isLoading ? (
            <p className="text-[16px] font-medium text-slate-500">
              Завантаження...
            </p>
          ) : cars.length === 0 ? (
            <p className="text-[16px] font-medium text-slate-500">
              Поки що немає доданих авто
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {cars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onEdit={() => handleStartEditCar(car)}
                  onDelete={() => handleDeleteCar(car.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ProfileInput({
  icon,
  label,
  name,
  value,
  disabled,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-[14px] font-bold text-slate-700">
        <img src={icon} alt="" className="h-4 w-4 object-contain opacity-60" />
        {label}
      </label>

      <input
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        type={type}
        className={`w-full rounded-xl border px-4 py-3 text-[15px] outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
            : "border-slate-300 bg-white text-slate-700 focus:border-[#079d92]"
        }`}
      />
    </div>
  );
}

function CarCard({ car, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9fbef]">
            <img src={carIcon} alt="Car" className="h-5 w-5 object-contain" />
          </div>

          <div>
            <h4 className="text-[16px] font-bold text-slate-950">
              {car.name}
            </h4>

            <p className="mt-1 text-[13px] text-slate-500">
              {fuelTypeLabels[car.fuelType]}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onEdit}
            className="cursor-pointer opacity-50 transition hover:opacity-100"
          >
            <img src={editIcon} alt="Edit" className="h-4 w-4 object-contain" />
          </button>

          <button
            onClick={onDelete}
            className="cursor-pointer opacity-50 transition hover:opacity-100"
          >
            <img
              src={deleteIcon}
              alt="Delete"
              className="h-4 w-4 object-contain"
            />
          </button>
        </div>
      </div>

      <div className="space-y-3 text-[14px]">
        <div className="flex justify-between">
          <span className="text-slate-500">Місто</span>
          <b className="text-slate-950">
            {car.cityConsumption} {car.unit}
          </b>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Траса</span>
          <b className="text-slate-950">
            {car.highwayConsumption} {car.unit}
          </b>
        </div>
      </div>
    </div>
  );
}