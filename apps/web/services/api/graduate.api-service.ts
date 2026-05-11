import { getUntypedClient } from "@trpc/client";
import { trpcClient } from "@/lib/api/trpc-client";
import {
  mapBackendApplication,
  mapBackendApplicationHistory,
  type BackendApplication,
  type BackendApplicationHistory,
} from "@/services/mappers/applications.mapper";
import {
  mapBackendGraduateProfile,
  type BackendGraduateProfile,
} from "@/services/mappers/graduate.mapper";
import {
  mapBackendNotification,
  type BackendNotification,
} from "@/services/mappers/notifications.mapper";
import {
  mapBackendOfferToJobSummary,
  type BackendPublicOffer,
} from "@/services/mappers/public-offers.mapper";
import type { GraduateSkill } from "@/types";

type PaginatedResponse<T> = {
  data?: T[];
  meta?: unknown;
};

type GraduateProfileUpdateInput = {
  nombres?: string;
  apellidos?: string;
  presentacion?: string;
  telefono?: string;
  ciudad?: string;
  region?: string;
  carreraId?: string;
  anioEgreso?: number;
  skills?: GraduateSkill[];
};

type GraduateEducationCreateInput = {
  institucion: string;
  grado?: string;
  campo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  esActual?: boolean;
  descripcion?: string;
};

type GraduateExperienceCreateInput = {
  empresa: string;
  cargo: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  esActual?: boolean;
};

const untypedTrpcClient = getUntypedClient(trpcClient);

function getItems<T>(response: unknown) {
  const payload = response as PaginatedResponse<T>;
  return Array.isArray(payload) ? payload : (payload.data ?? []);
}

export const graduateApiService = {
  async getProfile() {
    const response = await untypedTrpcClient.query("egresados.getMiPerfil");
    return mapBackendGraduateProfile(response as BackendGraduateProfile);
  },

  async updateProfile(input: GraduateProfileUpdateInput) {
    const response = await untypedTrpcClient.mutation("egresados.updateMiPerfil", {
      ...(input.nombres !== undefined ? { nombres: input.nombres.trim() } : {}),
      ...(input.apellidos !== undefined ? { apellidos: input.apellidos.trim() } : {}),
      ...(input.presentacion !== undefined
        ? { presentacion: input.presentacion.trim() || null }
        : {}),
      ...(input.telefono !== undefined
        ? { telefono: input.telefono.trim() || null }
        : {}),
      ...(input.ciudad !== undefined ? { ciudad: input.ciudad.trim() || null } : {}),
      ...(input.region !== undefined ? { region: input.region.trim() || null } : {}),
      ...(input.carreraId !== undefined ? { carreraId: input.carreraId || null } : {}),
      ...(input.anioEgreso !== undefined ? { anioEgreso: input.anioEgreso } : {}),
    });

    if (input.skills !== undefined) {
      await untypedTrpcClient.mutation("egresados.syncHabilidades", {
        habilidades: input.skills.map((skill) => ({
          habilidadId: skill.id,
          nivel: "INTERMEDIO",
        })),
      });
    }

    const updatedProfile = await untypedTrpcClient.query("egresados.getMiPerfil");
    return mapBackendGraduateProfile(updatedProfile as BackendGraduateProfile);
  },

  async addEducation(input: GraduateEducationCreateInput) {
    await untypedTrpcClient.mutation("egresados.addFormacion", {
      institucion: input.institucion.trim(),
      ...(input.grado ? { grado: input.grado.trim() } : {}),
      ...(input.campo ? { campo: input.campo.trim() } : {}),
      ...(input.fechaInicio ? { fechaInicio: input.fechaInicio } : {}),
      ...(input.fechaFin ? { fechaFin: input.fechaFin } : {}),
      ...(input.esActual !== undefined ? { esActual: input.esActual } : {}),
      ...(input.descripcion ? { descripcion: input.descripcion.trim() } : {}),
    });

    return graduateApiService.getProfile();
  },

  async addExperience(input: GraduateExperienceCreateInput) {
    await untypedTrpcClient.mutation("egresados.addExperiencia", {
      empresa: input.empresa.trim(),
      cargo: input.cargo.trim(),
      ...(input.descripcion ? { descripcion: input.descripcion.trim() } : {}),
      ...(input.fechaInicio ? { fechaInicio: input.fechaInicio } : {}),
      ...(input.fechaFin ? { fechaFin: input.fechaFin } : {}),
      ...(input.esActual !== undefined ? { esActual: input.esActual } : {}),
    });

    return graduateApiService.getProfile();
  },

  async getRecommendedJobs() {
    const response = await untypedTrpcClient.query("ofertas.feed", {
      page: 1,
      limit: 12,
    });

    return getItems<BackendPublicOffer>(response).map(mapBackendOfferToJobSummary);
  },

  async getJobById(id: string) {
    const response = await untypedTrpcClient.query("ofertas.getById", { id });

    if (!response) {
      return null;
    }

    return mapBackendOfferToJobSummary(response as BackendPublicOffer);
  },

  async applyToJob(jobId: string) {
    const response = await untypedTrpcClient.mutation("postulaciones.postular", {
      ofertaId: jobId,
    });

    return mapBackendApplication(response as BackendApplication);
  },

  async getApplications() {
    const response = await untypedTrpcClient.query("postulaciones.misPostulaciones", {
      page: 1,
      limit: 20,
    });

    return getItems<BackendApplication>(response).map(mapBackendApplication);
  },

  async getApplicationByJobId(jobId: string) {
    const applications = await graduateApiService.getApplications();
    return applications.find((application) => application.jobId === jobId) ?? null;
  },

  async getApplicationHistory(postulacionId: string) {
    const response = await untypedTrpcClient.query("postulaciones.historial", {
      postulacionId,
    });

    return (response as BackendApplicationHistory[]).map(mapBackendApplicationHistory);
  },

  async getNotifications() {
    const response = await untypedTrpcClient.query("notificaciones.misNotificaciones", {
      page: 1,
      limit: 20,
    });

    return getItems<BackendNotification>(response).map(mapBackendNotification);
  },

  async markNotificationAsRead(id: string) {
    const response = await untypedTrpcClient.mutation("notificaciones.marcarLeida", {
      id,
    });

    return mapBackendNotification(response as BackendNotification);
  },

  async markAllNotificationsAsRead() {
    await untypedTrpcClient.mutation("notificaciones.marcarTodasLeidas");
  },
};
