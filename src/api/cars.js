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
    "The Name field is required.": "Введіть назву авто",
    "The FuelType field is required.": "Оберіть тип пального",
    "The field CityConsumption must be between 0.1 and 100.": "Витрата в місті має бути від 0.1 до 100",
    "The field HighwayConsumption must be between 0.1 and 100.": "Витрата на трасі має бути від 0.1 до 100",
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

export async function getCars() {
  const response = await fetch(`${API_URL}/api/Cars`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося завантажити авто"));
  }

  return data;
}

export async function createCar(car) {
  const response = await fetch(`${API_URL}/api/Cars`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: car.name,
      fuelType: car.fuelType,
      cityConsumption: Number(car.cityConsumption),
      highwayConsumption: Number(car.highwayConsumption),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося створити авто"));
  }

  return data;
}

export async function updateCar(id, car) {
  const response = await fetch(`${API_URL}/api/Cars/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: car.name,
      fuelType: car.fuelType,
      cityConsumption: Number(car.cityConsumption),
      highwayConsumption: Number(car.highwayConsumption),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Не вдалося оновити авто"));
  }

  return data;
}

export async function deleteCar(id) {
  const response = await fetch(`${API_URL}/api/Cars/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(getErrorMessage(data, "Не вдалося видалити авто"));
  }

  return true;
}