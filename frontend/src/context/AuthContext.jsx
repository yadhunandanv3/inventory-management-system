import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check credentials.";
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await API.post("/auth/register", { name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
