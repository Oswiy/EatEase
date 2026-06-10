const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost/EatEase-Backend/backend/public";

const cleanBaseUrl = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

export const api = {
  post: async (endpoint, data, headers = {}) => {
    const token = localStorage.getItem('auth_token');
    const cleanEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    return fetch(`${cleanBaseUrl}${cleanEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: JSON.stringify(data),
    });
  },

  get: async (endpoint, headers = {}) => {
    const token = localStorage.getItem('auth_token');
    const cleanEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    return fetch(`${cleanBaseUrl}${cleanEndpoint}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    });
  },

  put: async (endpoint, data, headers = {}) => {
    const token = localStorage.getItem('auth_token');
    const cleanEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    return fetch(`${cleanBaseUrl}${cleanEndpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: JSON.stringify(data),
    });
  },

  delete: async (endpoint, headers = {}) => {
    const token = localStorage.getItem('auth_token');
    const cleanEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    return fetch(`${cleanBaseUrl}${cleanEndpoint}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    });
  }
};