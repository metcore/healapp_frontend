"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

type User = { id: number; name: string; email: string };

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.access_token;
    localStorage.setItem("token", token); // atau pakai cookie
    api.defaults.headers.Authorization = `Bearer ${token}`;

    const profile = await api.get("/auth/me");
    setUser(profile.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
