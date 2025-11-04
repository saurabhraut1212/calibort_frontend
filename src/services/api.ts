// src/services/api.ts
import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import store from "../app/store";
import { setTokens, clearAuth } from "../features/auth/authSlice";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});


interface FailedRequest {
  resolve: (token?: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        store.dispatch(clearAuth());
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({
            resolve: (token?: string | null) => resolve(token ?? null),
            reject
          });
        })
          .then((newToken) => {
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return axios(originalRequest);
          })
          .catch((queueErr) => Promise.reject(queueErr));
      }

      isRefreshing = true;

      try {
        const resp = await axios.post(`${baseURL}/api/auth/refresh`, { refreshToken });
        const data = resp.data?.data as {
          accessToken: string;
          refreshToken: string;
        };

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        store.dispatch(
          setTokens({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
          })
        );

        processQueue(null, data.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(clearAuth());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
