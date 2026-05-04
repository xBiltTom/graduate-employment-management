import { skillTypes, userStatuses } from "@/lib/constants";
import type { CompanyValidationStatus } from "@/types/company";
import type { OfferModality, OfferStatus, ContractType } from "@/types/job";

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
};

export type AdminSkill = {
  id: string;
  name: string;
  type: (typeof skillTypes)[keyof typeof skillTypes];
  category?: string;
  usageInGraduates: number;
  usageInOffers: number;
};
