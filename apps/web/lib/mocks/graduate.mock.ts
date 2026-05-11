import { applicationStatuses } from "@/lib/constants";
import { featuredJobs } from "@/lib/mocks/public.mock";
import type { GraduateApplication, GraduateProfile, NotificationItem } from "@/types";

export const sampleApplication = {
  id: "application-1",
  jobId: "job-1",
  graduateId: "user-graduate-1",
  status: applicationStatuses.applied,
};

export const mockGraduateProfile: GraduateProfile & {
  education: { institution: string; degree: string; period: string }[];
  experience: { company: string; role: string; period: string; description: string }[];
} = {
  id: "user-graduate-1",
  nombres: "Ana",
  apellidos: "Torres",
  email: "ana.torres@example.com",
  carreraId: "career-systems",
  carrera: "Ingeniería de Sistemas",
  anioEgreso: 2024,
  ciudad: "Trujillo",
  region: "La Libertad",
  telefono: "999 999 999",
  presentacion:
    "Egresada interesada en desarrollo frontend, testing y soluciones digitales. Buscando oportunidades para aplicar mis conocimientos en proyectos desafiantes y seguir aprendiendo de profesionales experimentados.",
  profileCompletion: 75,
  skills: [
    { id: "skill-react", name: "React" },
    { id: "skill-typescript", name: "TypeScript" },
    { id: "skill-sql", name: "SQL" },
    { id: "skill-testing", name: "Testing" },
    { id: "skill-git", name: "Git" },
  ],
  education: [
    {
      institution: "Universidad Nacional de Trujillo",
      degree: "Bachiller en Ingeniería de Sistemas",
      period: "2019 - 2023",
    },
  ],
  experience: [
    {
      company: "Tech Solutions Perú",
      role: "Practicante Pre-Profesional",
      period: "Ene 2023 - Jul 2023",
      description: "Desarrollo de interfaces de usuario en React y mantenimiento de aplicaciones legacy.",
    },
  ],
};

export const mockGraduateApplications: GraduateApplication[] = [
  {
    id: "application-1",
    jobId: "job-1",
    graduateId: "graduate-1",
    status: applicationStatuses.applied,
    appliedAt: "2026-05-01",
    job: featuredJobs.find((job) => job.id === "job-1"),
  },
  {
    id: "application-2",
    jobId: "job-2",
    graduateId: "graduate-1",
    status: applicationStatuses.reviewing,
    appliedAt: "2026-05-02",
    job: featuredJobs.find((job) => job.id === "job-2"),
  },
  {
    id: "application-3",
    jobId: "job-3",
    graduateId: "graduate-1",
    status: applicationStatuses.interview,
    appliedAt: "2026-04-15",
    job: featuredJobs.find((job) => job.id === "job-3"),
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "notification-1",
    title: "Nueva oferta recomendada",
    content: "Hay una nueva oferta de Desarrollador Frontend que coincide con tus habilidades en React y TypeScript.",
    read: false,
    createdAt: "2026-05-03T10:30:00Z",
    type: "NEW_OFFER",
  },
  {
    id: "notification-2",
    title: "Postulación actualizada",
    content: "Tu postulación para 'Analista QA Junior' cambió a En revisión.",
    read: true,
    createdAt: "2026-05-02T15:45:00Z",
    type: "APPLICATION_UPDATE",
  },
  {
    id: "notification-3",
    title: "Bienvenido al portal",
    content: "Te sugerimos completar tu perfil al 100% para acceder a mejores oportunidades.",
    read: true,
    createdAt: "2026-05-01T08:00:00Z",
    type: "SYSTEM",
  },
];
