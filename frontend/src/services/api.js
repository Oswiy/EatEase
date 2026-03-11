const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost/EatEase-Backend/backend/public";

export const api = {
  post: async (endpoint, data) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
  },
  
  get: async (endpoint) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Accept: "application/json",
      },
    });
  }
};