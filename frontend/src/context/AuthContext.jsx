import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("cooksy_token");
    const storedUser = localStorage.getItem("cooksy_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (jwt, userData) => {
    setToken(jwt);
    setUser(userData);
    localStorage.setItem("cooksy_token", jwt);
    localStorage.setItem("cooksy_user", JSON.stringify(userData));
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("cooksy_token");
    localStorage.removeItem("cooksy_user");
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const login = async (payload) => {
    const res = await api.post("/auth/login", payload);
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  };

  const logout = () => {
    clearSession();
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);




