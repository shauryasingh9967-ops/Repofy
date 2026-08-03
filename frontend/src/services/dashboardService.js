import api from "./api.js";

export const getDashboardStats = () => api.get("/dashboard/stats").then((r) => r.data);
export const getRecentActivity = (limit = 10) => api.get(`/dashboard/activity?limit=${limit}`).then((r) => r.data);
