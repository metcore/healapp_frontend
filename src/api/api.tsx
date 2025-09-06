import axios from "axios";
// import { getAuth } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
//   const token = getAuth();
//   if (token) {
  config.headers["X-app-token"] = "staging";

    // config.headers.Authorization = `Bearer ${token}`;
//   }
  return config;
});

export default api;
