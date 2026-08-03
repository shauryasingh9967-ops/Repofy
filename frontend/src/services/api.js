import axios from "axios";

// The access token is kept in memory only (never localStorage) to reduce
// XSS exposure. The refresh token lives in an httpOnly cookie the browser
// manages automatically — this module never touches it directly.
let accessToken = null;
let onAuthFailure = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Registered by AuthContext so this module can trigger a logout/redirect
// when the refresh token itself is no longer valid, without importing
// AuthContext directly (which would create a circular dependency).
export const setOnAuthFailure = (fn) => {
  onAuthFailure = fn;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // send/receive the httpOnly refresh-token cookie
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        const token = res.data.data.accessToken;
        setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh on the auth endpoints themselves, and only retry once per request.
    const isAuthRoute = originalRequest.url?.includes("/auth/");
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const token = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        setAccessToken(null);
        if (onAuthFailure) onAuthFailure();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
