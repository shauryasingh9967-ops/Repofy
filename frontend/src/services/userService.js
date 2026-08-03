import api from "./api.js";

export const updateProfile = (name) => api.put("/users/profile", { name }).then((r) => r.data);

export const changePassword = (currentPassword, newPassword) =>
  api.put("/users/change-password", { currentPassword, newPassword }).then((r) => r.data);
