import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
import { env } from "@/lib/env";

export const trpcClient = createTRPCClient<AnyRouter>({
  links: [
    httpBatchLink({
      url: env.trpcUrl,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
