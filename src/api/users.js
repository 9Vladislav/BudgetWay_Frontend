import { API_URL } from "./init";

function getToken() {
  return localStorage.getItem("jwt-token");
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

function translateError(message) {
  const errors = {
    "One or more validation errors occurred.": "Перевірте правильність заповнення полів",
    "The FirstName field is required.": "Введіть ім’я",
    "The LastName field is required.": "Введіть прізвище",
    "The Email field is required.": "Введіть електронну пошту",
    "The CurrentPassword field is required.": "Введіть поточний пароль",
    "The NewPassword field is required.": "Введіть новий пароль",
    "The Email field is not a valid e-mail address.": "Введіть коректну електронну пошту",
    "The field NewPassword must be a string or array type with a minimum length of '6'.": "Новий пароль має містити мінімум 6 символів",
  };

  return errors[message] || message;
}

function getErrorMessage(data, fallback) {
  if (data?.errors) {
    const messages = Object.values(data.errors).flat();

    if (messages.length > 0) {
      return messages.map(translateError).join(". ");
    }
  }

  return translateError(data?.message || data?.title || fallback);
}

export async function getUserProfile() {
  const response = await fetch(`${API_URL}/api/users/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити профіль"));
  }

  return data;
}

export async function updateUserProfile(profile) {
  const response = await fetch(`${API_URL}/api/users/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profile),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити профіль"));
  }

  return data;
}