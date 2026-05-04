import { featuredJobs, mockGraduateApplications, mockGraduateProfile, mockNotifications } from "@/lib/mocks";

export const graduateMockService = {
  async getProfile() {
    return mockGraduateProfile;
  },
  async updateProfile(input: {
    presentacion?: string;
    telefono?: string;
    ciudad?: string;
    region?: string;
  }) {
    return {
      ...mockGraduateProfile,
      ...(input.presentacion !== undefined
        ? { presentacion: input.presentacion }
        : {}),
      ...(input.telefono !== undefined ? { telefono: input.telefono } : {}),
      ...(input.ciudad !== undefined ? { ciudad: input.ciudad } : {}),
      ...(input.region !== undefined ? { region: input.region } : {}),
    };
  },
  async getRecommendedJobs() {
    return featuredJobs;
  },
  async getJobById(jobId: string) {
    return featuredJobs.find((job) => job.id === jobId) ?? null;
  },
  async applyToJob(jobId: string) {
    return {
      id: `mock-application-${jobId}`,
      jobId,
      graduateId: mockGraduateProfile.id,
      status: "POSTULADO" as const,
      appliedAt: new Date().toISOString(),
      job: await graduateMockService.getJobById(jobId),
    };
  },
  async getApplications() {
    return mockGraduateApplications;
  },
  async getApplicationByJobId(jobId: string) {
    return mockGraduateApplications.find((application) => application.jobId === jobId) ?? null;
  },
  async getApplicationHistory() {
    return [];
  },
  async getNotifications() {
    return mockNotifications;
  },
  async markNotificationAsRead(id: string) {
    const notification = mockNotifications.find((item) => item.id === id);

    if (!notification) {
      return null;
    }

    return {
      ...notification,
      read: true,
    };
  },
};
