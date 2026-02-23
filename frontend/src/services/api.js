import axios from "axios";

// Use relative /api in production (same origin when deployed as single service)
const baseURL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

export const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cooksy_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});




