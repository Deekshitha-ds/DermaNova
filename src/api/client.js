import axios from "axios";

// Single axios instance for the whole app. Base URL is empty because
// vite.config.js proxies /api to the Flask backend in dev, and in
// production the SPA is served from the same origin as the API.
const client = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" }
});

// Attach the JWT access token to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("dermanova_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the access token has expired, transparently try the refresh token
// once, then retry the original request. Prevents the user from being
// bounced to /login mid-analysis just because a token aged out.
let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem("dermanova_refresh_token");

      try {
        const { data } = await axios.post("/api/auth/refresh", null, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        });
        localStorage.setItem("dermanova_access_token", data.access_token);
        flushQueue(null, data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return client(originalRequest);
      } catch (refreshError) {
        flushQueue(refreshError, null);
        localStorage.removeItem("dermanova_access_token");
        localStorage.removeItem("dermanova_refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default client;
