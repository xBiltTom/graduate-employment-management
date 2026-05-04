import { featuredJobs, publicStats } from "@/lib/mocks";

export const publicMockService = {
  async getFeaturedJobs() {
    return featuredJobs;
  },
  async getPublicStats() {
    return publicStats;
  },
  async getJobById(id: string) {
    return featuredJobs.find((job) => job.id === id) ?? null;
  },
};
