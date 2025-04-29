// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface Admin {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (admin: Admin, token: string) => void;
  logout: () => void;
}


export const AuthContext = createContext<AuthContextType>({
  admin: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("admin");

    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const login = (adminData: Admin, tokenData: string) => {
    setAdmin(adminData);
    setToken(tokenData);
    localStorage.setItem("adminToken", tokenData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
