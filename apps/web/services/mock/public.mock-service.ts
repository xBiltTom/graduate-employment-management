import { featuredJobs, publicStats } from "@/lib/mocks";

export const publicMockService = {
  getFeaturedJobs() {
    return featuredJobs;
  },
  getPublicStats() {
    return publicStats;
  },
  getJobById(id: string) {
    return featuredJobs.find((job) => job.id === id) ?? null;
  },
};
