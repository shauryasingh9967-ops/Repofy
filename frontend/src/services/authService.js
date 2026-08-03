import api from "./api.js";

export const registerRequest = (name, email, password) =>
  api.post("/auth/register", { name, email, password }).then((r) => r.data);

export const loginRequest = (email, password) =>
  api.post("/auth/login", { email, password }).then((r) => r.data);

export const logoutRequest = () => api.post("/auth/logout").then((r) => r.data);

export const getMeRequest = () => api.get("/auth/me").then((r) => r.data);

export const forgotPasswordRequest = (email) =>
  api.post("/auth/forgot-password", { email }).then((r) => r.data);

export const resetPasswordRequest = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password }).then((r) => r.data);
