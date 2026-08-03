import api from "./api.js";

export const createFile = (repoId, name, content) =>
  api.post(`/repos/${repoId}/files`, { name, content }).then((r) => r.data);

export const uploadFile = (repoId, name, content) =>
  api.post(`/repos/${repoId}/files/upload`, { name, content }).then((r) => r.data);

export const getFiles = (repoId) => api.get(`/repos/${repoId}/files`).then((r) => r.data);

export const getFileById = (repoId, fileId) => api.get(`/repos/${repoId}/files/${fileId}`).then((r) => r.data);

export const updateFile = (repoId, fileId, content) =>
  api.put(`/repos/${repoId}/files/${fileId}`, { content }).then((r) => r.data);

export const deleteFile = (repoId, fileId) => api.delete(`/repos/${repoId}/files/${fileId}`).then((r) => r.data);

// Streams the file straight from the backend (Content-Disposition: attachment)
// rather than re-building a Blob from already-fetched content client-side.
export const downloadFile = async (repoId, file) => {
  const res = await api.get(`/repos/${repoId}/files/${file.id}/download`, { responseType: "blob" });
  const url = URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
