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
    description:
      "Buscamos un Desarrollador Frontend Junior apasionado por crear interfaces de usuario modernas y responsivas. Trabajarás con React, TypeScript y Tailwind CSS en proyectos innovadores para clientes del sector tecnológico.",
    requirements: [
      "Conocimiento sólido en HTML5, CSS3 y JavaScript",
      "Experiencia con React y TypeScript",
      "Familiaridad con sistemas de control de versiones (Git)",
      "Habilidades de comunicación y trabajo en equipo",
    ],
    closingDate: "2026-06-15",
    publishedDate: "2026-05-01",
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
    description:
      "Únete a nuestro equipo de calidad para asegurar la excelencia en nuestros productos digitales. Ideal para recién egresados con fuertes bases en testing manual y automatizado.",
    requirements: [
      "Conocimiento en metodologías de testing",
      "Experiencia con herramientas como Postman o Selenium",
      "Manejo básico de SQL para validación de datos",
      "Atención al detalle y capacidad analítica",
    ],
    closingDate: "2026-06-30",
    publishedDate: "2026-05-03",
  },
  {
    id: "job-3",
    title: "Product Designer Ssr / Sr",
    company: "TechVision Global",
    location: "Lima, Perú",
    modality: offerModalities.hybrid,
    contractType: contractTypes.fullTime,
    salaryRange: "S/ 4000 - S/ 6000",
    skills: ["Figma", "UX Research", "Design Systems", "Prototyping"],
    match: 72,
    status: offerStatuses.active,
    description:
      "Buscamos un Product Designer apasionado por crear experiencias de usuario excepcionales. Trabajarás estrechamente con equipos de producto e ingeniería para transformar ideas complejas en interfaces intuitivas.",
    requirements: [
      "3+ años de experiencia en diseño de producto",
      "Dominio de Figma y herramientas de prototipado",
      "Experiencia en investigación de usuarios",
      "Portfolio con casos de estudio demostrable",
    ],
    closingDate: "2026-07-01",
    publishedDate: "2026-04-28",
  },
  {
    id: "job-4",
    title: "Data Analyst Junior",
    company: "Alpha Analytics",
    location: "Remoto",
    modality: offerModalities.remote,
    contractType: contractTypes.fullTime,
    salaryRange: "S/ 2000 - S/ 3000",
    skills: ["SQL", "Python", "Power BI", "Excel"],
    match: 81,
    status: offerStatuses.active,
    description:
      "Únete a nuestro equipo de datos para ayudar a extraer insights valiosos. Ideal para recién egresados con fuertes bases en SQL y visualización de datos que busquen crecer en un entorno dinámico.",
    requirements: [
      "Conocimiento sólido de SQL y modelado de datos",
      "Experiencia con Python o R para análisis",
      "Familiaridad con herramientas de BI (Power BI, Tableau)",
      "Capacidad para comunicar insights de forma clara",
    ],
    closingDate: "2026-06-20",
    publishedDate: "2026-05-02",
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

export const mockGraduateProfile = {
  id: "user-graduate-1",
  nombres: "Ana",
  apellidos: "Torres",
  email: "ana.torres@example.com",
  carrera: "Ingeniería de Sistemas",
  anioEgreso: 2024,
  ciudad: "Trujillo",
  region: "La Libertad",
  telefono: "999 999 999",
  presentacion:
    "Egresada interesada en desarrollo frontend, testing y soluciones digitales. Buscando oportunidades para aplicar mis conocimientos en proyectos desafiantes y seguir aprendiendo de profesionales experimentados.",
  profileCompletion: 75,
  skills: ["React", "TypeScript", "SQL", "Testing", "Tailwind CSS", "Git"],
  education: [
    {
      institution: "Universidad Nacional de Trujillo",
      degree: "Bachiller en Ingeniería de Sistemas",
      period: "2019 - 2023"
    }
  ],
  experience: [
    {
      company: "Tech Solutions Perú",
      role: "Practicante Pre-Profesional",
      period: "Ene 2023 - Jul 2023",
      description: "Desarrollo de interfaces de usuario en React y mantenimiento de aplicaciones legacy."
    }
  ]
};

export const mockGraduateApplications = [
  {
    id: "application-1",
    jobId: "job-1",
    status: applicationStatuses.applied,
    appliedAt: "2026-05-01",
    job: featuredJobs.find(j => j.id === "job-1")
  },
  {
    id: "application-2",
    jobId: "job-2",
    status: applicationStatuses.reviewing,
    appliedAt: "2026-05-02",
    job: featuredJobs.find(j => j.id === "job-2")
  },
  {
    id: "application-3",
    jobId: "job-3",
    status: applicationStatuses.interview,
    appliedAt: "2026-04-15",
    job: featuredJobs.find(j => j.id === "job-3")
  },
];

export const mockNotifications = [
  {
    id: "notification-1",
    title: "Nueva oferta recomendada",
    content: "Hay una nueva oferta de Desarrollador Frontend que coincide con tus habilidades en React y TypeScript.",
    read: false,
    createdAt: "2026-05-03T10:30:00Z",
    type: "NEW_OFFER"
  },
  {
    id: "notification-2",
    title: "Postulación actualizada",
    content: "Tu postulación para 'Analista QA Junior' cambió a En revisión.",
    read: true,
    createdAt: "2026-05-02T15:45:00Z",
    type: "APPLICATION_UPDATE"
  },
  {
    id: "notification-3",
    title: "Bienvenido al portal",
    content: "Te sugerimos completar tu perfil al 100% para acceder a mejores oportunidades.",
    read: true,
    createdAt: "2026-05-01T08:00:00Z",
    type: "SYSTEM"
  },
];
