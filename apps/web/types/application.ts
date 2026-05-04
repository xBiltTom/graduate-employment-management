import { applicationStatuses } from "@/lib/constants";
import type { JobSummary } from "@/types/job";

export type ApplicationStatus =
  (typeof applicationStatuses)[keyof typeof applicationStatuses];

export type GraduateApplication = {
  id: string;
  jobId: string;
  graduateId?: string;
  status: ApplicationStatus;
  appliedAt: string;
  job?: JobSummary;
};

export type ApplicationHistoryEntry = {
  id: string;
  estadoAnterior: ApplicationStatus | null;
  estadoNuevo: ApplicationStatus;
  creadoEn: string;
};
