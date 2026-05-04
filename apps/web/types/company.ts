import { companyValidationStatuses } from "@/lib/constants";
import type { ApplicationHistoryEntry, ApplicationStatus } from "@/types/application";
import type { JobSummary, OfferStatus } from "@/types/job";

export type CompanyValidationStatus =
  (typeof companyValidationStatuses)[keyof typeof companyValidationStatuses];

export type CompanyProfile = {
  id: string;
  nombreComercial: string;
  razonSocial: string;
  ruc: string;
  sector: string;
  email: string;
  telefono?: string;
  sitioWeb?: string;
  ciudad?: string;
  region?: string;
  descripcion?: string;
  validationStatus: CompanyValidationStatus;
};

export type CompanyOfferSummary = {
  id: string;
  job?: JobSummary;
  status: OfferStatus;
  applicationsCount: number;
  reviewingCount: number;
  interviewCount: number;
  hiredCount: number;
};

export type CompanyApplicantEducation = {
  institucion: string;
  grado: string;
  campo: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
};

export type CompanyApplicantExperience = {
  empresa: string;
  cargo: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
};

export type CompanyApplicantFile = {
  id: string;
  nombreArchivo: string;
  mimeType: string;
  tamanio: number;
  categoria?: string;
};

export type CompanyApplicant = {
  id: string;
  graduateId: string;
  applicationId: string;
  offerId: string;
  nombres: string;
  apellidos: string;
  carrera: string;
  anioEgreso: number;
  ciudad: string;
  region?: string;
  pais?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  skills: string[];
  match: number;
  status: ApplicationStatus;
  appliedAt: string;
  presentacion?: string;
  hasCv: boolean;
  formaciones?: CompanyApplicantEducation[];
  experiencias?: CompanyApplicantExperience[];
  historial?: ApplicationHistoryEntry[];
  archivos?: CompanyApplicantFile[];
};
