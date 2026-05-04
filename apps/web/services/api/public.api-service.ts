function notImplemented(moduleName: string): never {
  throw new Error(`${moduleName} API service is not implemented yet. Use NEXT_PUBLIC_API_MODE=mock.`);
}

export const publicApiService = {
  getFeaturedJobs() {
    return notImplemented("public");
  },
  getPublicStats() {
    return notImplemented("public");
  },
  getJobById() {
    return notImplemented("public");
  },
};
