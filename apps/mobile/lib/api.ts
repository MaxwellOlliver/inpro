import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { AuthTokens } from "../features/auth/api/auth.types";
import { TokenStorage } from "../features/auth/storage/token.storage";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

type AuthCallbacks = {
  updateTokens: (tokens: AuthTokens) => void;
  logout: () => void;
};

let authCallbacks: AuthCallbacks | null = null;

export function registerAuthCallbacks(callbacks: AuthCallbacks) {
  authCallbacks = callbacks;
}

// Request interceptor — attach Bearer token
api.interceptors.request.use(async (config) => {
  const token = await TokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — refresh on 401
let isRefreshing = false;
let failedQueue: {
  resolve: (config: InternalAxiosRequestConfig) => void;
  reject: (error: unknown) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ reject }) => reject(error));
  failedQueue = [];
}

async function retryQueue(newToken: string) {
  for (const { resolve, config } of failedQueue) {
    config.headers.Authorization = `Bearer ${newToken}`;
    resolve(config);
  }
  failedQueue = [];
}

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const originalRequest = error.config;
  if (!originalRequest || error.response?.status !== 401) {
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (config) => resolve(api(config)),
        reject,
        config: originalRequest,
      });
    });
  }

  isRefreshing = true;

  try {
    const storedRefreshToken = await TokenStorage.getRefreshToken();
    if (!storedRefreshToken) throw new Error("No refresh token");

    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh-token`,
      {},
      { headers: { Cookie: `refreshToken=${storedRefreshToken}` } },
    );

    const tokens: AuthTokens = response.data.tokens;
    await TokenStorage.saveTokens(tokens);
    authCallbacks?.updateTokens(tokens);

    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
    await retryQueue(tokens.accessToken);

    return api(originalRequest);
  } catch (refreshError) {
    processQueue(refreshError);
    await TokenStorage.clearTokens();
    authCallbacks?.logout();
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
});
