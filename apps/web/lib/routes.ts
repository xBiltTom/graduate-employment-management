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
