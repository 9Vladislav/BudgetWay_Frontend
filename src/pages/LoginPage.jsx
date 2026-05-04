import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { loginUser } from "../api/auth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Заповніть усі поля");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Введіть коректну електронну пошту");
      return;
    }

    try {
      setIsLoading(true);

      const data = await loginUser({ email, password });

      if (data?.token) {
        localStorage.setItem("jwt-token", data.token);
      }

      navigate("/home");
    } catch (err) {
      setError(err.message || "Не вдалося увійти в акаунт");
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
              Ласкаво просимо назад
            </h2>
            <p className="mt-1 text-[16px] text-slate-500">
              Увійдіть у свій обліковий запис
            </p>
          </div>

          <div className="mx-auto mb-8 grid w-full max-w-102.5 grid-cols-2 rounded-2xl bg-slate-100 p-1">
            <button className="rounded-xl bg-white py-3 text-[16px] font-bold text-slate-900 shadow">
              Вхід
            </button>

            <Link
              to="/register"
              className="rounded-xl py-3 text-center text-[16px] font-bold text-slate-500"
            >
              Реєстрація
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="mb-2 text-[16px] font-bold text-slate-700">
              Email
            </label>
            <input
              type="text"
              placeholder="you@example.com"
              className="mb-5 rounded-2xl border border-slate-300 px-4 py-3 text-[16px] outline-none focus:border-[#079d92]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="mb-2 text-[16px] font-bold text-slate-700">
              Пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="mb-5 rounded-2xl border border-slate-300 px-4 py-3 text-[16px] outline-none focus:border-[#079d92]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? "Вхід..." : "Увійти"}
            </button>
          </form>

          <p className="mt-8 text-center text-[17px] font-bold text-[#079d92]">
            Немає акаунта?{" "}
            <Link to="/register" className="hover:underline">
              Зареєструватися
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
