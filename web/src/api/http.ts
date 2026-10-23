import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLogin = error.config?.url?.endsWith("/auth/login");
    if (error.response?.status === 401 && !isLogin) {
      useAuthStore.getState().signOut();
      if (typeof window !== "undefined") window.location.assign("/login?expired=1");
    }
    return Promise.reject(error);
  },
);

/** Orval mutator: every generated request goes through the shared axios instance. */
export const http = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> =>
  apiClient<T>({ ...config, ...options }).then(({ data }) => data);

export type ErrorType<E> = AxiosError<E>;
export type BodyType<B> = B;

/** Turns a NestJS error response into a list of readable messages. */
export function errorMessages(error: unknown): string[] {
  const data = (error as AxiosError<{ message?: string | string[] }>)?.response?.data;
  if (Array.isArray(data?.message)) return data.message;
  if (typeof data?.message === "string") return [data.message];
  if ((error as AxiosError)?.code === "ERR_NETWORK") return ["The PPSR service is unavailable. Please try again."];
  return ["Something went wrong. Please try again."];
}
