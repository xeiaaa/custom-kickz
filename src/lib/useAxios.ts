import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export function useAxios() {
  const { getToken } = useAuth();

  useEffect(() => {
    // Add a request interceptor
    const interceptor = axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await getToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => Promise.reject(error)
    );
    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return axiosInstance;
}