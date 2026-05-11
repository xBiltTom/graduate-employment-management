import type { GraduateEducation, GraduateExperience, GraduateProfile } from "@/types";

type BackendGraduateSkill = {
  habilidadId?: string | null;
  habilidad?: {
    id?: string | null;
    nombre?: string | null;
  } | null;
};

type BackendGraduateEducation = {
  institucion?: string | null;
  grado?: string | null;
  campo?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  esActual?: boolean | null;
};

type BackendGraduateExperience = {
  empresa?: string | null;
  cargo?: string | null;
  descripcion?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  esActual?: boolean | null;
};

type BackendGraduateUser = {
  email?: string | null;
};

type BackendGraduateCareer = {
  id?: string | null;
  nombre?: string | null;
};

export type BackendGraduateProfile = {
  id: string;
  nombres?: string | null;
  apellidos?: string | null;
  telefono?: string | null;
  ciudad?: string | null;
  region?: string | null;
  presentacion?: string | null;
  anioEgreso?: number | null;
  usuario?: BackendGraduateUser | null;
  carrera?: BackendGraduateCareer | null;
  habilidades?: BackendGraduateSkill[];
  formaciones?: BackendGraduateEducation[];
  experiencias?: BackendGraduateExperience[];
};

function formatPeriod(
  start?: string | null,
  end?: string | null,
  isCurrent?: boolean | null,
) {
  const startYear = start ? new Date(start).getFullYear() : undefined;
  const endYear = isCurrent ? "Actual" : end ? new Date(end).getFullYear() : undefined;

  if (startYear && endYear) {
    return `${startYear} - ${endYear}`;
  }

  if (startYear) {
    return `${startYear}`;
  }

  if (endYear) {
    return `${endYear}`;
  }

  return "Periodo no especificado";
}

function mapEducation(
  education: BackendGraduateEducation,
): GraduateEducation {
  return {
    institution: education.institucion ?? "Institución no especificada",
    degree:
      education.grado ?? education.campo ?? "Formación no especificada",
    period: formatPeriod(
      education.fechaInicio,
      education.fechaFin,
      education.esActual,
    ),
  };
}

function mapExperience(
  experience: BackendGraduateExperience,
): GraduateExperience {
  return {
    company: experience.empresa ?? "Empresa no especificada",
    role: experience.cargo ?? "Cargo no especificado",
    period: formatPeriod(
      experience.fechaInicio,
      experience.fechaFin,
      experience.esActual,
    ),
    description:
      experience.descripcion ?? "Sin descripción disponible.",
  };
}

function calculateProfileCompletion(profile: {
  presentacion?: string | null;
  telefono?: string | null;
  ciudad?: string | null;
  region?: string | null;
  carrera?: BackendGraduateCareer | null;
  usuario?: BackendGraduateUser | null;
  habilidades?: BackendGraduateSkill[];
  formaciones?: BackendGraduateEducation[];
  experiencias?: BackendGraduateExperience[];
}) {
  const checks = [
    Boolean(profile.usuario?.email),
    Boolean(profile.carrera?.nombre),
    Boolean(profile.presentacion),
    Boolean(profile.telefono),
    Boolean(profile.ciudad),
    Boolean(profile.region),
    Boolean(profile.habilidades && profile.habilidades.length > 0),
    Boolean(profile.formaciones && profile.formaciones.length > 0),
    Boolean(profile.experiencias && profile.experiencias.length > 0),
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

export function mapBackendGraduateProfile(
  profile: BackendGraduateProfile,
): GraduateProfile {
  return {
    id: profile.id,
    nombres: profile.nombres ?? "",
    apellidos: profile.apellidos ?? "",
    email: profile.usuario?.email ?? "",
    carreraId: profile.carrera?.id ?? undefined,
    carrera: profile.carrera?.nombre ?? "Carrera no especificada",
    anioEgreso: profile.anioEgreso ?? new Date().getFullYear(),
    ciudad: profile.ciudad ?? undefined,
    region: profile.region ?? undefined,
    telefono: profile.telefono ?? undefined,
    presentacion: profile.presentacion ?? undefined,
    profileCompletion: calculateProfileCompletion(profile),
    skills:
      profile.habilidades
        ?.map((item) => {
          const id = item.habilidad?.id ?? item.habilidadId;
          const name = item.habilidad?.nombre;

          if (!id || !name) {
            return null;
          }

          return { id, name };
        })
        .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill)) ?? [],
    education: profile.formaciones?.map(mapEducation) ?? [],
    experience: profile.experiencias?.map(mapExperience) ?? [],
  };
}
