import { env } from "@/lib/env";

export const dataSource = {
  mode: env.apiMode,
  isMock: env.isMockMode,
  isApi: env.isApiMode,
};

export function shouldUseMockData() {
  return env.isMockMode;
}
