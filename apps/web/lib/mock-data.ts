import {
  applicationStatuses,
  companyValidationStatuses,
  contractTypes,
  offerModalities,
  offerStatuses,
  reportStatuses,
  reportTypes,
  skillTypes,
  userStatuses,
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

export const mockCompanyProfile = {
  id: "user-company-1",
  nombreComercial: "Tech Solutions Perú",
  razonSocial: "Tech Solutions Perú S.A.C.",
  ruc: "20600000001",
  sector: "Tecnología",
  email: "rrhh@techsolutions.pe",
  telefono: "999 888 777",
  sitioWeb: "https://techsolutions.pe",
  ciudad: "Trujillo",
  region: "La Libertad",
  descripcion:
    "Empresa enfocada en soluciones digitales, desarrollo de software y transformación tecnológica.",
  validationStatus: companyValidationStatuses.approved,
};

export const mockCompanyOffers = [
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

export const mockCompanyApplicants = [
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

export const mockAdminStats = {
  totalGraduates: 1240,
  activeCompanies: 86,
  pendingCompanies: 12,
  activeOffers: 58,
  monthlyApplications: 342,
  employabilityRate: 68,
};

export const mockAdminGraduates = [
  {
    id: "graduate-1",
    nombres: "Ana",
    apellidos: "Torres",
    email: "ana.torres@example.com",
    telefono: "999 999 999",
    carrera: "Ingeniería de Sistemas",
    anioEgreso: 2024,
    ciudad: "Trujillo",
    region: "La Libertad",
    estado: userStatuses.active,
    postulaciones: 4,
    habilidades: ["React", "TypeScript", "Testing"],
    presentacion:
      "Egresada interesada en desarrollo frontend, testing y soluciones digitales. Buscando oportunidades para aplicar mis conocimientos en proyectos desafiantes.",
    archivos: [
      {
        id: "admin-file-1",
        nombreArchivo: "CV_Ana_Torres_2026.pdf",
        mimeType: "application/pdf",
        tamanio: 2400000,
      },
    ],
    historial: [
      {
        id: "graduate-history-1",
        resumen: "Perfil validado por administración",
        fecha: "2026-05-01",
      },
      {
        id: "graduate-history-2",
        resumen: "Postulación destacada en Desarrollador Frontend Junior",
        fecha: "2026-05-03",
      },
    ],
  },
  {
    id: "graduate-2",
    nombres: "Luis",
    apellidos: "Ramírez",
    email: "luis.ramirez@example.com",
    telefono: "987 654 321",
    carrera: "Ingeniería de Software",
    anioEgreso: 2023,
    ciudad: "Lima",
    region: "Lima",
    estado: userStatuses.active,
    postulaciones: 6,
    habilidades: ["NestJS", "PostgreSQL", "Node.js"],
    presentacion:
      "Desarrollador backend con interés en APIs escalables y bases de datos relacionales. Busco un equipo con buenas prácticas y mentoría.",
    archivos: [
      {
        id: "admin-file-2",
        nombreArchivo: "CV_Luis_Ramirez_2026.pdf",
        mimeType: "application/pdf",
        tamanio: 2100000,
      },
    ],
    historial: [
      {
        id: "graduate-history-3",
        resumen: "Perfil actualizado con nueva experiencia laboral",
        fecha: "2026-04-28",
      },
    ],
  },
  {
    id: "graduate-3",
    nombres: "Carla",
    apellidos: "Vega",
    email: "carla.vega@example.com",
    telefono: "955 222 444",
    carrera: "Ingeniería de Sistemas",
    anioEgreso: 2022,
    ciudad: "Arequipa",
    region: "Arequipa",
    estado: userStatuses.pending,
    postulaciones: 2,
    habilidades: ["Figma", "UX", "React"],
    presentacion:
      "Frontend con enfoque en UX y diseño de interfaces accesibles. Interesada en participar en equipos multidisciplinarios.",
    archivos: [],
    historial: [
      {
        id: "graduate-history-4",
        resumen: "Pendiente de completar validación documental",
        fecha: "2026-05-04",
      },
    ],
  },
];

export const mockAdminCompanies = [
  {
    id: "company-1",
    nombreComercial: "Tech Solutions Perú",
    razonSocial: "Tech Solutions Perú S.A.C.",
    ruc: "20600000001",
    sector: "Tecnología",
    email: "rrhh@techsolutions.pe",
    telefono: "999 888 777",
    sitioWeb: "https://techsolutions.pe",
    ciudad: "Trujillo",
    region: "La Libertad",
    descripcion:
      "Empresa enfocada en soluciones digitales, desarrollo de software y transformación tecnológica.",
    estadoValidacion: companyValidationStatuses.approved,
    ofertasPublicadas: 4,
    fechaRegistro: "2026-04-15",
  },
  {
    id: "company-2",
    nombreComercial: "Innova Digital",
    razonSocial: "Innova Digital S.A.C.",
    ruc: "20600000002",
    sector: "Servicios digitales",
    email: "contacto@innovadigital.pe",
    telefono: "987 456 321",
    sitioWeb: "https://innovadigital.pe",
    ciudad: "Lima",
    region: "Lima",
    descripcion:
      "Consultora especializada en automatización, analítica y productos digitales para empresas de crecimiento acelerado.",
    estadoValidacion: companyValidationStatuses.pending,
    ofertasPublicadas: 1,
    fechaRegistro: "2026-05-01",
  },
  {
    id: "company-3",
    nombreComercial: "Grupo Andino Logística",
    razonSocial: "Grupo Andino Logística S.A.C.",
    ruc: "20600000003",
    sector: "Logística",
    email: "talento@grupoandino.pe",
    telefono: "965 555 112",
    sitioWeb: "https://grupoandino.pe",
    ciudad: "Arequipa",
    region: "Arequipa",
    descripcion:
      "Operador regional con foco en logística, distribución y modernización de procesos operativos.",
    estadoValidacion: companyValidationStatuses.rejected,
    ofertasPublicadas: 0,
    fechaRegistro: "2026-04-27",
  },
];

export const mockAdminOffers = [
  {
    id: "job-1",
    titulo: "Desarrollador Frontend Junior",
    empresa: "Tech Solutions Perú",
    sector: "Tecnología",
    ubicacion: "Trujillo, Perú",
    modalidad: offerModalities.hybrid,
    tipoContrato: contractTypes.fullTime,
    estado: offerStatuses.pendingReview,
    publicadoEn: "2026-05-01",
    cierreEn: "2026-06-15",
  },
  {
    id: "job-2",
    titulo: "Analista QA Junior",
    empresa: "Innova Digital",
    sector: "Servicios digitales",
    ubicacion: "Remoto",
    modalidad: offerModalities.remote,
    tipoContrato: contractTypes.fullTime,
    estado: offerStatuses.approved,
    publicadoEn: "2026-05-03",
    cierreEn: "2026-06-30",
  },
  {
    id: "job-3",
    titulo: "Product Designer Ssr / Sr",
    empresa: "TechVision Global",
    sector: "Tecnología",
    ubicacion: "Lima, Perú",
    modalidad: offerModalities.hybrid,
    tipoContrato: contractTypes.fullTime,
    estado: offerStatuses.rejected,
    publicadoEn: "2026-04-28",
    cierreEn: "2026-07-01",
  },
  {
    id: "job-4",
    titulo: "Data Analyst Junior",
    empresa: "Alpha Analytics",
    sector: "Analítica",
    ubicacion: "Remoto",
    modalidad: offerModalities.remote,
    tipoContrato: contractTypes.fullTime,
    estado: offerStatuses.active,
    publicadoEn: "2026-05-02",
    cierreEn: "2026-06-20",
  },
];

export const mockAdminReports = [
  {
    id: "report-1",
    type: reportTypes.graduatesByCareer,
    status: reportStatuses.completed,
    createdAt: "2026-05-01",
    fileName: "egresados-por-carrera.pdf",
  },
  {
    id: "report-2",
    type: reportTypes.laborDemand,
    status: reportStatuses.processing,
    createdAt: "2026-05-03",
    fileName: null,
  },
  {
    id: "report-3",
    type: reportTypes.activeOffers,
    status: reportStatuses.pending,
    createdAt: "2026-05-04",
    fileName: null,
  },
  {
    id: "report-4",
    type: reportTypes.employability,
    status: reportStatuses.failed,
    createdAt: "2026-04-29",
    fileName: null,
  },
];

export const mockAdminSkills = [
  {
    id: "skill-1",
    name: "React",
    type: skillTypes.technical,
    usageInGraduates: 320,
    usageInOffers: 42,
    category: "Frontend",
  },
  {
    id: "skill-2",
    name: "Comunicación efectiva",
    type: skillTypes.soft,
    usageInGraduates: 280,
    usageInOffers: 36,
    category: "Interpersonal",
  },
  {
    id: "skill-3",
    name: "Node.js",
    type: skillTypes.technical,
    usageInGraduates: 190,
    usageInOffers: 28,
    category: "Backend",
  },
  {
    id: "skill-4",
    name: "Trabajo en equipo",
    type: skillTypes.soft,
    usageInGraduates: 340,
    usageInOffers: 44,
    category: "Colaboración",
  },
];
