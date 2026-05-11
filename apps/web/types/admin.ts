import { skillTypes, userStatuses } from "@/lib/constants";
import type { CompanyValidationStatus } from "@/types/company";
import type { ApplicationStatus } from "@/types/application";
import type { OfferModality, OfferStatus, ContractType } from "@/types/job";
import type { ReportSummary, ReportStatus, ReportType } from "@/types/report";

export type AdminStats = {
  totalGraduates: number;
  activeCompanies: number;
  pendingCompanies: number;
  activeOffers: number;
  monthlyApplications: number;
  employabilityRate: number;
};

export type AdminFile = {
  id: string;
  nombreArchivo: string;
  mimeType: string;
  tamanio: number;
};

export type AdminTimelineItem = {
  id: string;
  resumen: string;
  fecha: string;
};

export type AdminApplicationSummary = {
  id: string;
  offerId?: string;
  title: string;
  company: string;
  status: ApplicationStatus;
  appliedAt: string;
};

export type AdminCompanyValidationInput = {
  companyId: string;
  decision: "APROBADA" | "RECHAZADA";
  reason?: string;
};

export type AdminOfferModerationInput = {
  id: string;
  decision: "APROBAR" | "RECHAZAR";
  reason?: string;
};

export type AdminSkillCreateInput = {
  name: string;
  type: (typeof skillTypes)[keyof typeof skillTypes];
  category?: string;
};

export type AdminSkillUpdateInput = {
  id: string;
  name?: string;
  type?: (typeof skillTypes)[keyof typeof skillTypes];
  category?: string;
};

export type AdminCatalogCreateInput = {
  name: string;
  description?: string;
};

export type AdminCatalogUpdateInput = {
  id: string;
  name?: string;
  description?: string;
};

export type AdminSectorCreateInput = AdminCatalogCreateInput;
export type AdminSectorUpdateInput = AdminCatalogUpdateInput;
export type AdminCareerCreateInput = AdminCatalogCreateInput;
export type AdminCareerUpdateInput = AdminCatalogUpdateInput;

export type AdminApplicationsFilters = {
  graduateId?: string;
  companyId?: string;
  offerId?: string;
  status?: ApplicationStatus;
  from?: string;
  to?: string;
};

export type AdminReportRequestInput = {
  type: ReportType;
  parameters?: Record<string, unknown>;
  status?: ReportStatus;
};

export type AdminGraduate = {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  carrera: string;
  anioEgreso: number;
  ciudad?: string;
  region?: string;
  estado: (typeof userStatuses)[keyof typeof userStatuses];
  postulaciones: number;
  habilidades: string[];
  presentacion?: string;
  archivos?: AdminFile[];
  historial?: AdminTimelineItem[];
};

export type AdminCompany = {
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
  estadoValidacion: CompanyValidationStatus;
  ofertasPublicadas: number;
  fechaRegistro: string;
  motivoRechazo?: string;
  validadoEn?: string;
};

export type AdminOffer = {
  id: string;
  titulo: string;
  empresa: string;
  sector: string;
  ubicacion: string;
  modalidad: OfferModality;
  tipoContrato: ContractType;
  estado: OfferStatus;
  publicadoEn: string;
  cierreEn: string;
  applicationsCount?: number;
};

export type AdminSkill = {
  id: string;
  name: string;
  type: (typeof skillTypes)[keyof typeof skillTypes];
  category?: string;
  isActive?: boolean;
  usageInGraduates: number;
  usageInOffers: number;
};

export type AdminCatalogItem = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  updatedAt: string;
  usageCount: number;
};

export type AdminSector = AdminCatalogItem;
export type AdminCareer = AdminCatalogItem;

export type AdminReport = ReportSummary;
