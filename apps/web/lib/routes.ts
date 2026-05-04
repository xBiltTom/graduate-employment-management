export const publicRoutes = {
  home: "/",
  offers: "/ofertas",
  offerDetail: (id: string) => `/ofertas/${id}`,
};

export const authRoutes = {
  login: "/login",
  register: "/registro",
  registerGraduate: "/registro/egresado",
  registerCompany: "/registro/empresa",
};

export const graduateRoutes = {
  home: "/egresado/inicio",
  offers: "/egresado/ofertas",
  offerDetail: (id: string) => `/egresado/ofertas/${id}`,
  applications: "/egresado/postulaciones",
  profile: "/egresado/perfil",
  notifications: "/egresado/notificaciones",
};

export const companyRoutes = {
  home: "/empresa/inicio",
  offers: "/empresa/ofertas",
  newOffer: "/empresa/ofertas/nueva",
  offerDetail: (id: string) => `/empresa/ofertas/${id}`,
  offerApplicants: (id: string) => `/empresa/ofertas/${id}/postulantes`,
  applicantDetail: (id: string) => `/empresa/postulantes/${id}`,
  profile: "/empresa/perfil",
};

export const adminRoutes = {
  dashboard: "/admin/dashboard",
  graduates: "/admin/egresados",
  graduateDetail: (id: string) => `/admin/egresados/${id}`,
  companies: "/admin/empresas",
  companyDetail: (id: string) => `/admin/empresas/${id}`,
  offers: "/admin/ofertas",
  reports: "/admin/reportes",
  skills: "/admin/habilidades",
  settings: "/admin/configuracion",
};

export const ROUTES = {
  PUBLIC: {
    HOME: publicRoutes.home,
    OFERTAS: publicRoutes.offers,
    OFERTA_DETAIL: publicRoutes.offerDetail,
  },
  AUTH: {
    LOGIN: authRoutes.login,
    REGISTER: authRoutes.register,
    REGISTER_GRADUATE: authRoutes.registerGraduate,
    REGISTER_COMPANY: authRoutes.registerCompany,
  },
  EGRESADO: {
    INICIO: graduateRoutes.home,
    OFERTAS: graduateRoutes.offers,
    OFERTA_DETAIL: graduateRoutes.offerDetail,
    POSTULACIONES: graduateRoutes.applications,
    PERFIL: graduateRoutes.profile,
    NOTIFICACIONES: graduateRoutes.notifications,
  },
  EMPRESA: {
    INICIO: companyRoutes.home,
    OFERTAS: companyRoutes.offers,
    NUEVA_OFERTA: companyRoutes.newOffer,
    OFERTA_DETAIL: companyRoutes.offerDetail,
    OFERTA_POSTULANTES: companyRoutes.offerApplicants,
    POSTULANTE_DETAIL: companyRoutes.applicantDetail,
    PERFIL: companyRoutes.profile,
  },
  ADMIN: {
    DASHBOARD: adminRoutes.dashboard,
    EGRESADOS: adminRoutes.graduates,
    EGRESADO_DETAIL: adminRoutes.graduateDetail,
    EMPRESAS: adminRoutes.companies,
    EMPRESA_DETAIL: adminRoutes.companyDetail,
    OFERTAS: adminRoutes.offers,
    REPORTES: adminRoutes.reports,
    HABILIDADES: adminRoutes.skills,
    CONFIGURACION: adminRoutes.settings,
  }
};
