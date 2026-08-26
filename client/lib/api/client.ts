import axios, { AxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function api<T>(
  endPoint: string,
  options?: AxiosRequestConfig,
): Promise<T> {
  const response = await axios<T>({
    baseURL: API_URL,
    url: endPoint,
    withCredentials: true,

    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },

    ...options,
  });

  return response.data;
}
