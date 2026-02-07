// export const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000";
// export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000/ws";

const API_CONFIG = {
  // CHOOSE ONE:
  BASE_URL: "http://localhost:8000", // ← Use this for development
  // OR
  // BASE_URL: "http://localhost/EatEase/backend/public",
  
  POLLING_INTERVAL: 30000,
  MAX_RETRIES: 3
};

export default API_CONFIG;