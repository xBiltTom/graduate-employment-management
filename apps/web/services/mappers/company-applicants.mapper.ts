import type {
  ApplicationHistoryEntry,
  ApplicationStatus,
  CompanyApplicant,
  CompanyApplicantEducation,
  CompanyApplicantExperience,
  CompanyApplicantFile,
} from "@/types";

type BackendApplicantSkill = {
  habilidad?: {
    nombre?: string | null;
  } | null;
};

type BackendApplicantEducation = {
  institucion?: string | null;
  grado?: string | null;
  campo?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  descripcion?: string | null;
};

type BackendApplicantExperience = {
  empresa?: string | null;
  cargo?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  descripcion?: string | null;
};

export type BackendCompanyApplicantHistory = {
  id: string;
  estadoAnterior?: string | null;
  estadoNuevo?: string | null;
  creadoEn?: string | null;
};

export type BackendCompanyApplicant = {
  id: string;
  estado?: string | null;
  comentario?: string | null;
  postuladoEn?: string | null;
  actualizadoEn?: string | null;
  egresado?: {
    id?: string | null;
    nombres?: string | null;
    apellidos?: string | null;
    presentacion?: string | null;
    ciudad?: string | null;
    region?: string | null;
    pais?: string | null;
    anioEgreso?: number | null;
    carrera?: {
      nombre?: string | null;
    } | null;
    habilidades?: BackendApplicantSkill[];
    formaciones?: BackendApplicantEducation[];
    experiencias?: BackendApplicantExperience[];
    usuario?: {
      email?: string | null;
    } | null;
    telefono?: string | null;
    direccion?: string | null;
  } | null;
  oferta?: {
    id?: string | null;
  } | null;
  historial?: BackendCompanyApplicantHistory[];
};

export function mapBackendCompanyApplicationHistory(
  entry: BackendCompanyApplicantHistory,
): ApplicationHistoryEntry {
  return {
    id: entry.id,
    estadoAnterior: (entry.estadoAnterior as ApplicationStatus | null | undefined) ?? null,
    estadoNuevo: (entry.estadoNuevo as ApplicationStatus | undefined) ?? "POSTULADO",
    creadoEn: entry.creadoEn ?? "",
  };
}

function mapEducation(item: BackendApplicantEducation): CompanyApplicantEducation {
  return {
    institucion: item.institucion ?? "Institución no especificada",
    grado: item.grado ?? "Grado no especificado",
    campo: item.campo ?? "",
    fechaInicio: item.fechaInicio ?? "",
    fechaFin: item.fechaFin ?? "Actualidad",
    descripcion: item.descripcion ?? "",
  };
}

function mapExperience(item: BackendApplicantExperience): CompanyApplicantExperience {
  return {
    empresa: item.empresa ?? "Empresa no especificada",
    cargo: item.cargo ?? "Cargo no especificado",
    fechaInicio: item.fechaInicio ?? "",
    fechaFin: item.fechaFin ?? "Actualidad",
    descripcion: item.descripcion ?? "",
  };
}

function buildPlaceholderFiles(hasCv: boolean): CompanyApplicantFile[] {
  if (!hasCv) {
    return [];
  }

  return [
    {
      id: "cv-placeholder",
      nombreArchivo: "CV disponible",
      mimeType: "application/pdf",
      tamanio: 0,
      categoria: "CV",
    },
  ];
}

export function mapBackendCompanyApplicant(
  applicant: BackendCompanyApplicant,
): CompanyApplicant {
  const skills =
    applicant.egresado?.habilidades
      ?.map((item) => item.habilidad?.nombre)
      .filter((item): item is string => Boolean(item)) ?? [];
  const historial = applicant.historial?.map(mapBackendCompanyApplicationHistory) ?? [];
  const hasCv = false;

  return {
    id: applicant.id,
    graduateId: applicant.egresado?.id ?? "",
    applicationId: applicant.id,
    offerId: applicant.oferta?.id ?? "",
    nombres: applicant.egresado?.nombres ?? "Sin nombres",
    apellidos: applicant.egresado?.apellidos ?? "",
    carrera: applicant.egresado?.carrera?.nombre ?? "Carrera no especificada",
    anioEgreso: applicant.egresado?.anioEgreso ?? 0,
    ciudad: applicant.egresado?.ciudad ?? "Ciudad no especificada",
    region: applicant.egresado?.region ?? undefined,
    pais: applicant.egresado?.pais ?? undefined,
    email: applicant.egresado?.usuario?.email ?? undefined,
    telefono: applicant.egresado?.telefono ?? undefined,
    direccion: applicant.egresado?.direccion ?? undefined,
    skills,
    match: 0,
    status: (applicant.estado as ApplicationStatus | undefined) ?? "POSTULADO",
    appliedAt: applicant.postuladoEn ?? applicant.actualizadoEn ?? "",
    presentacion: applicant.egresado?.presentacion ?? applicant.comentario ?? undefined,
    hasCv,
    formaciones: applicant.egresado?.formaciones?.map(mapEducation) ?? [],
    experiencias: applicant.egresado?.experiencias?.map(mapExperience) ?? [],
    historial,
    archivos: buildPlaceholderFiles(hasCv),
  };
}
