import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { setAccessToken, setOnAuthFailure } from "../services/api.js";
import {
  registerRequest,
  loginRequest,
  logoutRequest,
  getMeRequest,
} from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const forceLogout = useCallback(() => {
    setAccessToken(null);
    setCurrentUser(null);
  }, []);

  useEffect(() => {
    setOnAuthFailure(forceLogout);

    // On first load there's no access token in memory yet (page refresh
    // clears it), so try to silently mint a new one from the httpOnly
    // refresh-token cookie before deciding whether the user is logged in.
    (async () => {
      try {
        const res = await api.post("/auth/refresh", {}, { withCredentials: true });
        setAccessToken(res.data.data.accessToken);
        const me = await getMeRequest();
        setCurrentUser(me.data);
      } catch {
        setAccessToken(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [forceLogout]);

  const applyAuthResult = (res) => {
    setAccessToken(res.data.accessToken);
    setCurrentUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, password) => {
    const res = await registerRequest(name, email, password);
    return applyAuthResult(res);
  };

  const login = async (email, password) => {
    const res = await loginRequest(email, password);
    return applyAuthResult(res);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      forceLogout();
    }
  };

  const updateUserInPlace = (patch) => setCurrentUser((prev) => ({ ...prev, ...patch }));

  const value = { currentUser, loading, register, login, logout, updateUserInPlace };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
