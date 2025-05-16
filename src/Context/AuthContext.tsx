import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import axios from "axios";

interface Admin {
  _id: string;
  name: string;
  email: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

interface AuthContextType {
  admin: Admin | null;
  user: User | null;
  token: string | null;
  role: "admin" | "user" | null;
  isAuthenticated: boolean;
  loginAsAdmin: (admin: Admin, token: string) => void;
  loginAsUser: (user: User, token: string) => void;
  register: (userData: User, tokenData: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  admin: null,
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  loginAsAdmin: () => {},
  loginAsUser: () => {},
  register: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedAdmin = localStorage.getItem("admin");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    const verifyToken = async () => {
      if (storedToken && storedRole) {
        try {
          // Verify token with backend
          const response = await axios.get("http://localhost:5000/api/user/verify-token", {
            headers: { Authorization: `Bearer ${storedToken}` }
          });

          setToken(storedToken);
          setRole(storedRole as "admin" | "user");
          setIsAuthenticated(true);

          if (storedRole === "admin" && storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
          }

          if (storedRole === "user" && storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          // If token verification fails, clear everything
          logout();
        }
      }
    };

    verifyToken();
  }, []);

  const loginAsAdmin = (adminData: Admin, tokenData: string) => {
    setAdmin(adminData);
    setToken(tokenData);
    setRole("admin");
    setIsAuthenticated(true);
    localStorage.setItem("authToken", tokenData);
    localStorage.setItem("admin", JSON.stringify(adminData));
    localStorage.setItem("role", "admin");
  };

  const loginAsUser = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    setRole("user");
    setIsAuthenticated(true);
    localStorage.setItem("authToken", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", "user");
  };

  const register = (userData: User, tokenData: string) => {
    loginAsUser(userData, tokenData); // Reuse login functionality
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    localStorage.removeItem("role");

    if (token) {
      axios
        .post(
          "http://localhost:5000/api/user/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )
        .catch((err) => console.error("Logout failed:", err));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        user,
        token,
        role,
        isAuthenticated,
        loginAsAdmin,
        loginAsUser,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};