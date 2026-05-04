import { mockGraduateApplications, mockGraduateProfile, mockNotifications } from "@/lib/mocks";

export const graduateService = {
  getProfile() {
    return mockGraduateProfile;
  },
  getApplications() {
    return mockGraduateApplications;
  },
  getApplicationByJobId(jobId: string) {
    return mockGraduateApplications.find((application) => application.jobId === jobId) ?? null;
  },
  getNotifications() {
    return mockNotifications;
  },
};
