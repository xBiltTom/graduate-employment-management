import {
  applicationStatuses,
  companyValidationStatuses,
  contractTypes,
  offerModalities,
  offerStatuses,
  userRoles,
} from "@/lib/constants";

export const featuredJobs = [
  {
    id: "job-1",
    title: "Desarrollador Frontend Junior",
    company: "Tech Solutions Perú",
    location: "Trujillo, Perú",
    modality: offerModalities.hybrid,
    contractType: contractTypes.fullTime,
    salaryRange: "S/ 1800 - S/ 2500",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    match: 86,
    status: offerStatuses.active,
  },
  {
    id: "job-2",
    title: "Analista QA Junior",
    company: "Innova Digital",
    location: "Remoto",
    modality: offerModalities.remote,
    contractType: contractTypes.fullTime,
    salaryRange: "S/ 1500 - S/ 2200",
    skills: ["Testing", "Postman", "SQL"],
    match: 78,
    status: offerStatuses.active,
  },
];

export const publicStats = [
  {
    label: "Egresados registrados",
    value: "1,240",
  },
  {
    label: "Empresas activas",
    value: "86",
  },
  {
    label: "Ofertas publicadas",
    value: "320",
  },
  {
    label: "Postulaciones realizadas",
    value: "2,850",
  },
];

export const mockUsers = {
  graduate: {
    id: "user-graduate-1",
    name: "Ana Torres",
    email: "ana.torres@example.com",
    role: userRoles.graduate,
  },
  company: {
    id: "user-company-1",
    name: "Tech Solutions Perú",
    email: "rrhh@techsolutions.pe",
    role: userRoles.company,
    validationStatus: companyValidationStatuses.approved,
  },
  admin: {
    id: "user-admin-1",
    name: "Administrador",
    email: "admin@sistema.com",
    role: userRoles.admin,
  },
};

export const sampleApplication = {
  id: "application-1",
  jobId: "job-1",
  graduateId: "user-graduate-1",
  status: applicationStatuses.applied,
};
