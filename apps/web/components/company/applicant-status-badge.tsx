import { Badge } from "@/components/ui/badge";
import { applicationStatuses } from "@/lib/constants";

const statusMap = {
  [applicationStatuses.applied]: "bg-blue-100 text-blue-700",
  [applicationStatuses.reviewing]: "bg-amber-100 text-amber-700",
  [applicationStatuses.interview]: "bg-violet-100 text-violet-700",
  [applicationStatuses.hired]: "bg-emerald-100 text-emerald-700",
  [applicationStatuses.rejected]: "bg-rose-100 text-rose-700",
} as const;

const labelMap = {
  [applicationStatuses.applied]: "Postulado",
  [applicationStatuses.reviewing]: "En revisión",
  [applicationStatuses.interview]: "Entrevista",
  [applicationStatuses.hired]: "Contratado",
  [applicationStatuses.rejected]: "Rechazado",
} as const;

export function ApplicantStatusBadge({ status }: { status: string }) {
  const className = statusMap[status as keyof typeof statusMap] ?? "bg-slate-100 text-slate-700";
  const label = labelMap[status as keyof typeof labelMap] ?? status;

  return <Badge className={`${className} border-0 hover:${className}`}>{label}</Badge>;
}
