import { reportStatuses, reportTypes } from "@/lib/constants";

export type ReportType = (typeof reportTypes)[keyof typeof reportTypes];
export type ReportStatus = (typeof reportStatuses)[keyof typeof reportStatuses];

export type ReportSummary = {
  id: string;
  type: ReportType;
  status: ReportStatus;
  createdAt: string;
  fileName: string | null;
  downloadUrl?: string | null;
  errorMessage?: string | null;
};
