// lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers["X-app-token"] = "staging";
  return config;
});
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("wkaokaowkaowk", error.response)
      const { code } = error.response.data;

      if (code === "ONBOARDING_REQUIRED") {
        console.log("dd")
        if (typeof window !== "undefined") {
          window.location.href = "/onboarding";
        }
        return;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
