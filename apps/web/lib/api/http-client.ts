import { env } from "@/lib/env";
import type { ServiceError } from "@/types";

type HttpClientOptions = RequestInit & {
  authToken?: string;
};

async function request<T>(
  path: string,
  options: HttpClientOptions = {},
): Promise<T> {
  const url = `${env.apiBaseUrl}${path}`;
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (options.authToken) {
    headers.set("Authorization", `Bearer ${options.authToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let details: unknown = null;

    try {
      details = await response.json();
    } catch {
      details = null;
    }

    const error: ServiceError = {
      message: "Request failed",
      status: response.status,
      details,
    };

    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const httpClient = {
  get<T>(path: string, options?: HttpClientOptions) {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options?: HttpClientOptions) {
    return request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },
  patch<T>(path: string, body?: unknown, options?: HttpClientOptions) {
    return request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },
  delete<T>(path: string, options?: HttpClientOptions) {
    return request<T>(path, { ...options, method: "DELETE" });
  },
};
