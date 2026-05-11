import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
import { env } from "@/lib/env";

async function buildTrpcRequestInit(options?: RequestInit) {
  const headers = new Headers(options?.headers);

  if (typeof window === "undefined" && !headers.has("cookie")) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }
  }

  return {
    ...options,
    headers,
    credentials: "include" as const,
  };
}

export const trpcClient = createTRPCClient<AnyRouter>({
  links: [
    httpBatchLink({
      url: env.trpcUrl,
      async fetch(url, options) {
        return fetch(url, await buildTrpcRequestInit(options));
      },
    }),
  ],
});
