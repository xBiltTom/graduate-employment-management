function notImplemented(moduleName: string): never {
  throw new Error(`${moduleName} API service is not implemented yet. Use NEXT_PUBLIC_API_MODE=mock.`);
}

export const graduateApiService = {
  getProfile() {
    return notImplemented("graduate");
  },
  getApplications() {
    return notImplemented("graduate");
  },
  getApplicationByJobId() {
    return notImplemented("graduate");
  },
  getNotifications() {
    return notImplemented("graduate");
  },
};
