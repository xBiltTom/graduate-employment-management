export const appConfig = {
  name: "Sistema de Gestión de Egresados y Oferta Laboral",
  shortName: "Portal Laboral Egresados",
  description:
    "Portal laboral para conectar egresados con empresas y oportunidades profesionales.",
};

export const userRoles = {
  admin: "ADMINISTRADOR",
  graduate: "EGRESADO",
  company: "EMPRESA",
} as const;

export const userStatuses = {
  active: "ACTIVO",
  pending: "PENDIENTE",
  suspended: "SUSPENDIDO",
} as const;

export const authProviders = {
  credentials: "CREDENCIALES",
  google: "GOOGLE",
} as const;

export const skillTypes = {
  technical: "TECNICA",
  soft: "BLANDA",
} as const;

export const skillLevels = {
  basic: "BASICO",
  intermediate: "INTERMEDIO",
  advanced: "AVANZADO",
  expert: "EXPERTO",
} as const;

export const companyValidationStatuses = {
  pending: "PENDIENTE",
  approved: "APROBADA",
  rejected: "RECHAZADA",
} as const;

export const offerModalities = {
  remote: "REMOTO",
  hybrid: "HIBRIDO",
  onsite: "PRESENCIAL",
} as const;

export const contractTypes = {
  fullTime: "TIEMPO_COMPLETO",
  partTime: "MEDIO_TIEMPO",
  project: "POR_PROYECTO",
  internship: "PRACTICAS",
} as const;

export const offerStatuses = {
  draft: "BORRADOR",
  pendingReview: "PENDIENTE_REVISION",
  approved: "APROBADA",
  rejected: "RECHAZADA",
  active: "ACTIVA",
  closed: "CERRADA",
  expired: "EXPIRADA",
} as const;

export const applicationStatuses = {
  applied: "POSTULADO",
  reviewing: "EN_REVISION",
  interview: "ENTREVISTA",
  hired: "CONTRATADO",
  rejected: "RECHAZADO",
} as const;

export const reportTypes = {
  graduatesByCareer: "EGRESADOS_POR_CARRERA",
  activeOffers: "OFERTAS_ACTIVAS",
  applicationsByOffer: "POSTULACIONES_POR_OFERTA",
  employability: "EMPLEABILIDAD",
  laborDemand: "DEMANDA_LABORAL",
  cohortComparison: "COMPARATIVO_COHORTES",
} as const;

export const reportStatuses = {
  pending: "PENDIENTE",
  processing: "PROCESANDO",
  completed: "COMPLETADO",
  failed: "FALLIDO",
} as const;

export const notificationChannels = {
  internal: "INTERNA",
  email: "EMAIL",
} as const;

export const notificationTypes = {
  newOffer: "NUEVA_OFERTA",
  applicationCreated: "POSTULACION_CREADA",
  applicationStatusChanged: "ESTADO_POSTULACION_CAMBIADO",
  companyValidated: "EMPRESA_VALIDADA",
  reportGenerated: "REPORTE_GENERADO",
  system: "SISTEMA",
} as const;
