import api from "./api.js";

export const getRepoStatus = (repoId) => api.get(`/repos/${repoId}/minigit/status`).then((r) => r.data);
export const getStagingArea = (repoId) => api.get(`/repos/${repoId}/minigit/staging`).then((r) => r.data);
export const stageFile = (repoId, fileId) =>
  api.post(`/repos/${repoId}/minigit/staging/${fileId}`).then((r) => r.data);
export const unstageFile = (repoId, fileId) =>
  api.delete(`/repos/${repoId}/minigit/staging/${fileId}`).then((r) => r.data);
export const commitChanges = (repoId, message) =>
  api.post(`/repos/${repoId}/minigit/commit`, { message }).then((r) => r.data);
export const getCommitHistory = (repoId) => api.get(`/repos/${repoId}/minigit/commits`).then((r) => r.data);
export const searchCommits = (repoId, q) =>
  api.get(`/repos/${repoId}/minigit/commits/search?q=${encodeURIComponent(q)}`).then((r) => r.data);
export const restoreVersion = (repoId, commitId) =>
  api.post(`/repos/${repoId}/minigit/restore/${commitId}`).then((r) => r.data);
