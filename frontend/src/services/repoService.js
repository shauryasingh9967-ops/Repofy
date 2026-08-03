import api from "./api.js";

export const createRepo = (name, description) => api.post("/repos", { name, description }).then((r) => r.data);
export const getRepos = (q = "") => api.get(`/repos${q ? `?q=${encodeURIComponent(q)}` : ""}`).then((r) => r.data);
export const getRepoById = (repoId) => api.get(`/repos/${repoId}`).then((r) => r.data);
export const renameRepo = (repoId, name) => api.put(`/repos/${repoId}/rename`, { name }).then((r) => r.data);
export const deleteRepo = (repoId) => api.delete(`/repos/${repoId}`).then((r) => r.data);
export const initRepo = (repoId) => api.post(`/repos/${repoId}/init`).then((r) => r.data);
