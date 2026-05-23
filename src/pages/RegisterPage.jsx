import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { loginUser, registerUser } from "../api/auth";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Заповніть усі поля");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setError("Введіть коректну електронну пошту");
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль має містити мінімум 6 символів");
      return;
    }

    try {
      setIsLoading(true);

      await registerUser(formData);

      const loginData = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (!loginData?.token) {
        throw new Error("Не вдалося автоматично увійти в акаунт");
      }

      localStorage.setItem("jwt-token", loginData.token);

      navigate("/home");
    } catch (err) {
      setError(err.message || "Не вдалося зареєструвати акаунт");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eefafa] flex justify-center px-4 py-6">
      <div className="w-full max-w-130">
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="BudgetWay logo"
            className="h-18.5 w-18.5 object-contain"
          />

          <h1 className="mt-4 text-[30px] font-bold leading-none text-slate-950">
            BudgetWay
          </h1>

          <p className="mt-3 text-[18px] text-slate-500">
            Плануйте автомобільні подорожі впевнено
          </p>
        </div>

        <div className="mt-6 min-h-125 rounded-3xl bg-white px-8 py-8 shadow-lg">
          <div className="mb-7 text-center">
            <h2 className="text-[24px] font-bold text-slate-900">
              Створити обліковий запис
            </h2>
            <p className="mt-1 text-[16px] text-slate-500">
              Зареєструйтесь, щоб почати планувати
            </p>
          </div>

          <div className="mx-auto mb-8 grid w-full max-w-102.5 grid-cols-2 rounded-2xl bg-slate-100 p-1">
            <Link
              to="/login"
              className="rounded-xl py-3 text-center text-[16px] font-bold text-slate-500"
            >
              Вхід
            </Link>

            <button className="rounded-xl bg-white py-3 text-[16px] font-bold text-slate-900 shadow">
              Реєстрація
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-2 text-[16px] font-bold text-slate-700">
                  Ім’я
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Іван"
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-[16px] outline-none focus:border-[#079d92]"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-2 text-[16px] font-bold text-slate-700">
                  Прізвище
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Петренко"
                  className="rounded-2xl border border-slate-300 px-4 py-3 text-[16px] outline-none focus:border-[#079d92]"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label className="mb-2 text-[16px] font-bold text-slate-700">
              Email
            </label>
            <input
              type="text"
              name="email"
              placeholder="you@example.com"
              className="mb-5 rounded-2xl border border-slate-300 px-4 py-3 text-[16px] outline-none focus:border-[#079d92]"
              value={formData.email}
              onChange={handleChange}
            />

            <label className="mb-2 text-[16px] font-bold text-slate-700">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="mb-5 rounded-2xl border border-slate-300 px-4 py-3 text-[16px] outline-none focus:border-[#079d92]"
              value={formData.password}
              onChange={handleChange}
            />

            {error && (
              <p className="mb-4 text-center text-[15px] font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 rounded-2xl bg-[#079d92] py-3 text-[17px] font-bold text-white transition hover:bg-[#078b82] disabled:opacity-60"
            >
              {isLoading ? "Реєстрація..." : "Зареєструватися"}
            </button>
          </form>

          <p className="mt-8 text-center text-[17px] font-bold text-[#079d92]">
            Вже є акаунт?{" "}
            <Link to="/login" className="hover:underline">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}