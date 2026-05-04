const apiMode = process.env.NEXT_PUBLIC_API_MODE ?? "mock";

export const env = {
  apiMode,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001",
  trpcUrl: process.env.NEXT_PUBLIC_TRPC_URL ?? "http://localhost:3001/trpc",
  isMockMode: apiMode === "mock",
  isApiMode: apiMode === "api",
} as const;
