export type GraduateEducation = {
  institution: string;
  degree: string;
  period: string;
};

export type GraduateExperience = {
  company: string;
  role: string;
  period: string;
  description: string;
};

export type GraduateSkill = {
  id: string;
  name: string;
};

export type GraduateProfile = {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  carreraId?: string;
  carrera: string;
  anioEgreso: number;
  ciudad?: string;
  region?: string;
  telefono?: string;
  presentacion?: string;
  profileCompletion: number;
  skills: GraduateSkill[];
  education?: GraduateEducation[];
  experience?: GraduateExperience[];
};
