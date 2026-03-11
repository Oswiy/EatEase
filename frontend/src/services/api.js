const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost/EatEase-Backend/backend/public";

// Remove trailing /api from base URL if present
const cleanBaseUrl = API_BASE_URL.endsWith('/api') 
  ? API_BASE_URL.slice(0, -4) 
  : API_BASE_URL;

export const api = {
  post: async (endpoint, data, headers = {}) => {
    const token = localStorage.getItem('auth_token');
    
    // Remove leading /api if endpoint already has it
    const cleanEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
    
    console.log('API Base URL (cleaned):', cleanBaseUrl);
    console.log('Full request URL:', fullUrl);
    
    return fetch(fullUrl, {
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
    const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
    
    console.log('GET request to:', fullUrl);
    
    return fetch(fullUrl, {
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
    const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
    
    return fetch(fullUrl, {
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
    const fullUrl = `${cleanBaseUrl}${cleanEndpoint}`;
    
    return fetch(fullUrl, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
    });
  }
};