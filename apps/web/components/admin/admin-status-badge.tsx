import { Badge } from "@/components/ui/badge";
import {
  companyValidationStatuses,
  offerStatuses,
  reportStatuses,
  userStatuses,
} from "@/lib/constants";

function getStatusMeta(status: string) {
  switch (status) {
    case userStatuses.active:
      return { label: "Activo", className: "bg-emerald-100 text-emerald-700" };
    case userStatuses.pending:
      return { label: "Pendiente", className: "bg-amber-100 text-amber-700" };
    case userStatuses.suspended:
      return { label: "Suspendido", className: "bg-rose-100 text-rose-700" };
    case companyValidationStatuses.approved:
      return { label: "Aprobada", className: "bg-emerald-100 text-emerald-700" };
    case companyValidationStatuses.pending:
      return { label: "Pendiente", className: "bg-amber-100 text-amber-700" };
    case companyValidationStatuses.rejected:
      return { label: "Rechazada", className: "bg-rose-100 text-rose-700" };
    case offerStatuses.draft:
      return { label: "Borrador", className: "bg-slate-100 text-slate-700" };
    case offerStatuses.pendingReview:
      return { label: "En revisión", className: "bg-amber-100 text-amber-700" };
    case offerStatuses.approved:
      return { label: "Aprobada", className: "bg-sky-100 text-sky-700" };
    case offerStatuses.rejected:
      return { label: "Rechazada", className: "bg-rose-100 text-rose-700" };
    case offerStatuses.active:
      return { label: "Activa", className: "bg-emerald-100 text-emerald-700" };
    case offerStatuses.closed:
      return { label: "Cerrada", className: "bg-slate-200 text-slate-700" };
    case offerStatuses.expired:
      return { label: "Expirada", className: "bg-slate-200 text-slate-700" };
    case reportStatuses.pending:
      return { label: "Pendiente", className: "bg-slate-100 text-slate-700" };
    case reportStatuses.processing:
      return { label: "Procesando", className: "bg-blue-100 text-blue-700" };
    case reportStatuses.completed:
      return { label: "Completado", className: "bg-emerald-100 text-emerald-700" };
    case reportStatuses.failed:
      return { label: "Fallido", className: "bg-rose-100 text-rose-700" };
    default:
      return { label: status, className: "bg-slate-100 text-slate-700" };
  }
}

export function AdminStatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status);

  return <Badge className={`${meta.className} border-0 hover:${meta.className}`}>{meta.label}</Badge>;
}
