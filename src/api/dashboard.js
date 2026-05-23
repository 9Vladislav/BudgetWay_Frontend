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

export async function getDashboard() {
  const response = await fetch(`${API_URL}/api/dashboard`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || data?.title || "Не вдалося завантажити панель",
    );
  }

  return data;
}