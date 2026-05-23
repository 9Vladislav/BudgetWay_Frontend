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

export async function getTrips() {
  const response = await fetch(`${API_URL}/api/Trips`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.title || "Не вдалося завантажити поїздки");
  }

  return data;
}

export async function getTripById(id) {
  const response = await fetch(`${API_URL}/api/Trips/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.title || "Не вдалося завантажити поїздку");
  }

  return data;
}

export async function createTrip(trip) {
  const response = await fetch(`${API_URL}/api/Trips`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(trip),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.title || "Не вдалося створити поїздку");
  }

  return data;
}

export async function updateTrip(id, trip) {
  const response = await fetch(`${API_URL}/api/Trips/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(trip),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.title || "Не вдалося оновити поїздку");
  }

  return data;
}

export async function deleteTrip(id) {
  const response = await fetch(`${API_URL}/api/Trips/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || data?.title || "Не вдалося видалити поїздку");
  }

  return true;
}