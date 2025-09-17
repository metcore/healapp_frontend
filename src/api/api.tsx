// lib/api.js
import { RootState, store } from "@/redux/store";
import axios from "axios";
import { useSelector } from "react-redux";

// simple event bus pakai CustomEvent
export const emitVendorRequired = (vendors = []) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("vendor:required", { detail: { vendors } }));
  }
};
export const emitVendorSelected = (vendorId) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("vendor:selected", { detail: { vendorId } }));
  }
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const state = store.getState(); // ambil global redux state
  const vendor_id = state.vendor.vendor; // ambil vendor dari redux
  config.headers["X-app-token"] = "staging";
  config.headers["X-Vendor-Id"] = vendor_id; // fallback kosong kalau belum ada


  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response) {
      const { status, data } = error.response;
      const code = data?.code;

      if (code === "ONBOARDING_REQUIRED" && typeof window !== "undefined") {
        window.location.href = "/onboarding";
        return;
      }

      if (status === 403 && code === "SELECT_VENDOR_REQUIRED") {
        // siapkan vendors ke modal
        const vendors = Array.isArray(data?.vendors) ? data.vendors : [];
        emitVendorRequired(vendors);

        // Opsional: pause request sampai user memilih vendor, lalu retry
        // Kita tunggu event 'vendor:selected' sekali
        const vendorId = await new Promise((resolve) => {
          const once = (e) => {
            window.removeEventListener("vendor:selected", once);
            resolve(e.detail.vendorId);
          };
          window.addEventListener("vendor:selected", once, { once: true });
        });

        // simpan ke localStorage (agar request selanjutnya otomatis bawa header)
        localStorage.setItem("vendor_id", vendorId);

        // retry request awal dengan header baru
        const cfg = { ...error.config };
        cfg.headers = cfg.headers || {};
        cfg.headers["X-Vendor-Id"] = vendorId;

        return api(cfg);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
