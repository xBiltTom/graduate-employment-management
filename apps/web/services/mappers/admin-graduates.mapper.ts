import { userStatuses } from "@/lib/constants";
import type {
  AdminApplicationSummary,
  AdminFile,
  AdminGraduate,
  ApplicationStatus,
} from "@/types";

type BackendAdminGraduateSkill = {
  habilidad?: {
    id?: string | null;
    nombre?: string | null;
    tipo?: string | null;
    categoria?: string | null;
  } | null;
};

type BackendAdminGraduateEducation = {
  id?: string | null;
  institucion?: string | null;
  grado?: string | null;
  campo?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  descripcion?: string | null;
};

type BackendAdminGraduateExperience = {
  id?: string | null;
  empresa?: string | null;
  cargo?: string | null;
  descripcion?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
};

type BackendAdminGraduateUser = {
  id?: string | null;
  email?: string | null;
  estado?: string | null;
};

type BackendAdminGraduateCareer = {
  id?: string | null;
  nombre?: string | null;
};

export type BackendAdminGraduate = {
  id: string;
  nombres?: string | null;
  apellidos?: string | null;
  telefono?: string | null;
  ciudad?: string | null;
  region?: string | null;
  pais?: string | null;
  anioEgreso?: number | null;
  presentacion?: string | null;
  creadoEn?: string | null;
  actualizadoEn?: string | null;
  usuario?: BackendAdminGraduateUser | null;
  carrera?: BackendAdminGraduateCareer | null;
  habilidades?: BackendAdminGraduateSkill[];
  formaciones?: BackendAdminGraduateEducation[];
  experiencias?: BackendAdminGraduateExperience[];
};

export type BackendAdminApplication = {
  id: string;
  estado?: string | null;
  postuladoEn?: string | null;
  oferta?: {
    id?: string | null;
    titulo?: string | null;
    empresa?: {
      nombreComercial?: string | null;
    } | null;
  } | null;
};

function mapStatus(value?: string | null) {
  switch (value) {
    case userStatuses.pending:
      return userStatuses.pending;
    case userStatuses.suspended:
      return userStatuses.suspended;
    case userStatuses.active:
    default:
      return userStatuses.active;
  }
}

function getSkillNames(skills?: BackendAdminGraduateSkill[]) {
  return skills
    ?.map((item) => item.habilidad?.nombre)
    .filter((item): item is string => Boolean(item)) ?? [];
}

function buildFiles(): AdminFile[] {
  return [];
}

export function mapBackendAdminGraduate(
  graduate: BackendAdminGraduate,
  applicationsCount = 0,
): AdminGraduate {
  return {
    id: graduate.id,
    nombres: graduate.nombres ?? "Sin nombres",
    apellidos: graduate.apellidos ?? "",
    email: graduate.usuario?.email ?? "",
    telefono: graduate.telefono ?? undefined,
    carrera: graduate.carrera?.nombre ?? "Carrera no especificada",
    anioEgreso: graduate.anioEgreso ?? 0,
    ciudad: graduate.ciudad ?? undefined,
    region: graduate.region ?? undefined,
    estado: mapStatus(graduate.usuario?.estado),
    postulaciones: applicationsCount,
    habilidades: getSkillNames(graduate.habilidades),
    presentacion: graduate.presentacion ?? "Sin presentación registrada.",
    archivos: buildFiles(),
    historial: [],
  };
}

export function mapBackendAdminApplicationSummary(
  application: BackendAdminApplication,
): AdminApplicationSummary {
  return {
    id: application.id,
    offerId: application.oferta?.id ?? undefined,
    title: application.oferta?.titulo ?? "Oferta",
    company: application.oferta?.empresa?.nombreComercial ?? "Empresa",
    status: (application.estado as ApplicationStatus | undefined) ?? "POSTULADO",
    appliedAt: application.postuladoEn ?? "",
  };
}
