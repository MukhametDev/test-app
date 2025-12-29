import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_BASE_URL = "/api";

let accessToken: string | null = null;

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
    timeout: DEFAULT_TIMEOUT_MS,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export function setAccessToken(token: string | null) {
    accessToken = token;
}

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
        };
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => Promise.reject(error)
);

export type ApiError = {
    status: number;
    message: string;
    details?: unknown;
};

export function normalizeApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 0;
        const data = error.response?.data as { message?: string } | undefined;
        const message = data?.message ?? error.message ?? "Request failed";
        return { status, message, details: data };
    }

    return {
        status: 0,
        message: "Unknown error",
        details: error,
    };
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig) {
    const { data } = await api.get<T>(url, config);
    return data;
}

export async function apiPost<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
) {
    const { data } = await api.post<T>(url, body, config);
    return data;
}

export async function apiPut<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
) {
    const { data } = await api.put<T>(url, body, config);
    return data;
}

export async function apiDelete<T>(url: string, config?: AxiosRequestConfig) {
    const { data } = await api.delete<T>(url, config);
    return data;
}
