import { featuredJobs, mockGraduateApplications, mockGraduateProfile, mockNotifications } from "@/lib/mocks";
import type { GraduateSkill } from "@/types";

export const graduateMockService = {
  async getProfile() {
    return mockGraduateProfile;
  },
  async updateProfile(input: {
    nombres?: string;
    apellidos?: string;
    presentacion?: string;
    telefono?: string;
    ciudad?: string;
    region?: string;
    carreraId?: string;
    anioEgreso?: number;
    skills?: GraduateSkill[];
  }) {
    return {
      ...mockGraduateProfile,
      ...(input.nombres !== undefined ? { nombres: input.nombres } : {}),
      ...(input.apellidos !== undefined ? { apellidos: input.apellidos } : {}),
      ...(input.presentacion !== undefined
        ? { presentacion: input.presentacion }
        : {}),
      ...(input.telefono !== undefined ? { telefono: input.telefono } : {}),
      ...(input.ciudad !== undefined ? { ciudad: input.ciudad } : {}),
      ...(input.region !== undefined ? { region: input.region } : {}),
      ...(input.carreraId !== undefined ? { carreraId: input.carreraId } : {}),
      ...(input.anioEgreso !== undefined ? { anioEgreso: input.anioEgreso } : {}),
      ...(input.skills !== undefined ? { skills: input.skills } : {}),
    };
  },
  async addEducation(input: {
    institucion: string;
    grado?: string;
    campo?: string;
    fechaInicio?: string;
    fechaFin?: string;
    esActual?: boolean;
    descripcion?: string;
  }) {
    const startYear = input.fechaInicio ? new Date(input.fechaInicio).getFullYear() : undefined;
    const endYear = input.esActual
      ? "Actual"
      : input.fechaFin
        ? new Date(input.fechaFin).getFullYear()
        : undefined;

    mockGraduateProfile.education = [
      {
        institution: input.institucion,
        degree: input.grado || input.campo || "Formación no especificada",
        period:
          startYear && endYear
            ? `${startYear} - ${endYear}`
            : startYear
              ? `${startYear}`
              : endYear
                ? `${endYear}`
                : "Periodo no especificado",
      },
      ...(mockGraduateProfile.education ?? []),
    ];

    return mockGraduateProfile;
  },
  async addExperience(input: {
    empresa: string;
    cargo: string;
    descripcion?: string;
    fechaInicio?: string;
    fechaFin?: string;
    esActual?: boolean;
  }) {
    const startYear = input.fechaInicio ? new Date(input.fechaInicio).getFullYear() : undefined;
    const endYear = input.esActual
      ? "Actual"
      : input.fechaFin
        ? new Date(input.fechaFin).getFullYear()
        : undefined;

    mockGraduateProfile.experience = [
      {
        company: input.empresa,
        role: input.cargo,
        period:
          startYear && endYear
            ? `${startYear} - ${endYear}`
            : startYear
              ? `${startYear}`
              : endYear
                ? `${endYear}`
                : "Periodo no especificado",
        description: input.descripcion || "Sin descripción disponible.",
      },
      ...(mockGraduateProfile.experience ?? []),
    ];

    return mockGraduateProfile;
  },
  async getRecommendedJobs() {
    return featuredJobs;
  },
  async getJobById(jobId: string) {
    return featuredJobs.find((job) => job.id === jobId) ?? null;
  },
  async applyToJob(jobId: string) {
    const existing = mockGraduateApplications.find((application) => application.jobId === jobId);

    if (existing) {
      return existing;
    }

    const created = {
      id: `mock-application-${jobId}`,
      jobId,
      graduateId: mockGraduateProfile.id,
      status: "POSTULADO" as const,
      appliedAt: new Date().toISOString(),
      job: (await graduateMockService.getJobById(jobId)) ?? undefined,
    };

    mockGraduateApplications.unshift(created);
    return created;
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

    notification.read = true;
    return notification;
  },

  async markAllNotificationsAsRead() {
    for (const notification of mockNotifications) {
      notification.read = true;
    }
  },
};
