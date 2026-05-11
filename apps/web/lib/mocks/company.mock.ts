import { applicationStatuses, companyValidationStatuses, offerStatuses } from "@/lib/constants";
import { featuredJobs } from "@/lib/mocks/public.mock";
import type { CompanyApplicant, CompanyOfferSummary, CompanyProfile } from "@/types";

export const mockCompanyProfile: CompanyProfile = {
  id: "user-company-1",
  nombreComercial: "Tech Solutions Perú",
  razonSocial: "Tech Solutions Perú S.A.C.",
  ruc: "20600000001",
  sectorId: "sector-tech",
  sector: "Tecnología",
  email: "rrhh@techsolutions.pe",
  telefono: "999 888 777",
  sitioWeb: "https://techsolutions.pe",
  direccion: "Av. América Oeste 450",
  ciudad: "Trujillo",
  region: "La Libertad",
  pais: "Peru",
  descripcion:
    "Empresa enfocada en soluciones digitales, desarrollo de software y transformación tecnológica.",
  validationStatus: companyValidationStatuses.approved,
};

export const mockCompanyOffers: CompanyOfferSummary[] = [
  {
    id: "job-1",
    job: featuredJobs.find((job) => job.id === "job-1"),
    status: offerStatuses.active,
    applicationsCount: 18,
    reviewingCount: 6,
    interviewCount: 3,
    hiredCount: 1,
  },
  {
    id: "job-3",
    job: featuredJobs.find((job) => job.id === "job-3"),
    status: offerStatuses.pendingReview,
    applicationsCount: 0,
    reviewingCount: 0,
    interviewCount: 0,
    hiredCount: 0,
  },
];

export const mockCompanyApplicants: CompanyApplicant[] = [
  {
    id: "applicant-1",
    graduateId: "graduate-1",
    applicationId: "application-1",
    offerId: "job-1",
    nombres: "Ana",
    apellidos: "Torres",
    carrera: "Ingeniería de Sistemas",
    anioEgreso: 2024,
    ciudad: "Trujillo",
    region: "La Libertad",
    pais: "Peru",
    email: "ana.torres@example.com",
    telefono: "999 111 222",
    direccion: "Av. España 123",
    skills: ["React", "TypeScript", "Testing"],
    match: 86,
    status: applicationStatuses.applied,
    appliedAt: "2026-05-01",
    presentacion:
      "Egresada enfocada en desarrollo frontend y automatización de pruebas. Interesada en proyectos con impacto social y equipos colaborativos.",
    hasCv: true,
    formaciones: [
      {
        institucion: "Universidad Nacional de Trujillo",
        grado: "Bachiller en Ingeniería de Sistemas",
        campo: "Ingeniería de Sistemas",
        fechaInicio: "2019-03-01",
        fechaFin: "2023-12-15",
        descripcion: "Especialización en desarrollo de software y testing.",
      },
    ],
    experiencias: [
      {
        empresa: "Tech Solutions Perú",
        cargo: "Practicante Frontend",
        fechaInicio: "2023-01-01",
        fechaFin: "2023-07-01",
        descripcion: "Construcción de interfaces React y soporte en QA manual.",
      },
    ],
    historial: [
      {
        id: "history-1",
        estadoAnterior: null,
        estadoNuevo: applicationStatuses.applied,
        creadoEn: "2026-05-01",
      },
    ],
    archivos: [
      {
        id: "file-1",
        nombreArchivo: "CV_Ana_Torres_2024.pdf",
        mimeType: "application/pdf",
        tamanio: 2400000,
        categoria: "CV",
      },
    ],
  },
  {
    id: "applicant-2",
    graduateId: "graduate-2",
    applicationId: "application-2",
    offerId: "job-1",
    nombres: "Luis",
    apellidos: "Ramírez",
    carrera: "Ingeniería de Software",
    anioEgreso: 2023,
    ciudad: "Lima",
    region: "Lima",
    pais: "Peru",
    email: "luis.ramirez@example.com",
    telefono: "987 654 321",
    direccion: "Jr. Los Olivos 456",
    skills: ["Node.js", "PostgreSQL", "NestJS"],
    match: 78,
    status: applicationStatuses.reviewing,
    appliedAt: "2026-05-02",
    presentacion:
      "Desarrollador backend con interés en APIs escalables y bases de datos relacionales. Busco un equipo con buenas prácticas y mentoría.",
    hasCv: true,
    formaciones: [
      {
        institucion: "Universidad Privada del Norte",
        grado: "Bachiller en Ingeniería de Software",
        campo: "Ingeniería de Software",
        fechaInicio: "2018-03-01",
        fechaFin: "2022-12-15",
        descripcion: "Participación en proyectos de arquitectura de software.",
      },
    ],
    experiencias: [
      {
        empresa: "Innova Digital",
        cargo: "Practicante Backend",
        fechaInicio: "2022-02-01",
        fechaFin: "2022-11-30",
        descripcion: "Desarrollo de APIs y mantenimiento de servicios internos.",
      },
    ],
    historial: [
      {
        id: "history-2",
        estadoAnterior: null,
        estadoNuevo: applicationStatuses.applied,
        creadoEn: "2026-05-02",
      },
      {
        id: "history-3",
        estadoAnterior: applicationStatuses.applied,
        estadoNuevo: applicationStatuses.reviewing,
        creadoEn: "2026-05-03",
      },
    ],
    archivos: [
      {
        id: "file-2",
        nombreArchivo: "CV_Luis_Ramirez_2024.pdf",
        mimeType: "application/pdf",
        tamanio: 2100000,
        categoria: "CV",
      },
    ],
  },
  {
    id: "applicant-3",
    graduateId: "graduate-3",
    applicationId: "application-3",
    offerId: "job-1",
    nombres: "Carla",
    apellidos: "Vega",
    carrera: "Ingeniería de Sistemas",
    anioEgreso: 2022,
    ciudad: "Arequipa",
    region: "Arequipa",
    pais: "Peru",
    email: "carla.vega@example.com",
    telefono: "955 222 444",
    direccion: "Av. Ejército 980",
    skills: ["React", "UX", "Figma"],
    match: 91,
    status: applicationStatuses.interview,
    appliedAt: "2026-04-28",
    presentacion:
      "Frontend con enfoque en UX y diseño de interfaces accesibles. Me interesa participar en equipos multidisciplinarios.",
    hasCv: false,
    formaciones: [
      {
        institucion: "Universidad Católica de Santa María",
        grado: "Bachiller en Ingeniería de Sistemas",
        campo: "Ingeniería de Sistemas",
        fechaInicio: "2017-03-01",
        fechaFin: "2021-12-10",
        descripcion: "Enfoque en diseño de interacción y desarrollo web.",
      },
    ],
    experiencias: [
      {
        empresa: "Agencia Pixel",
        cargo: "Diseñadora UI",
        fechaInicio: "2021-03-01",
        fechaFin: "2023-01-15",
        descripcion: "Diseño de interfaces para plataformas educativas.",
      },
    ],
    historial: [
      {
        id: "history-4",
        estadoAnterior: null,
        estadoNuevo: applicationStatuses.applied,
        creadoEn: "2026-04-28",
      },
      {
        id: "history-5",
        estadoAnterior: applicationStatuses.applied,
        estadoNuevo: applicationStatuses.interview,
        creadoEn: "2026-05-02",
      },
    ],
    archivos: [],
  },
];
