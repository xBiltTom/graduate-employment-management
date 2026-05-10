import type { AdminOffer } from "@/types";

export type BackendAdminOffer = {
  id: string;
  titulo?: string | null;
  modalidad?: string | null;
  tipoContrato?: string | null;
  ciudad?: string | null;
  region?: string | null;
  pais?: string | null;
  estado?: string | null;
  publicadoEn?: string | null;
  cierreEn?: string | null;
  creadoEn?: string | null;
  empresa?: {
    nombreComercial?: string | null;
    sector?: {
      nombre?: string | null;
    } | null;
  } | null;
  _count?: {
    postulaciones?: number | null;
  } | null;
};

function formatLocation(offer: BackendAdminOffer) {
  const location = [offer.ciudad, offer.region, offer.pais].filter(Boolean).join(", ");
  return location || "Ubicación no especificada";
}

export function mapBackendAdminOffer(offer: BackendAdminOffer): AdminOffer {
  return {
    id: offer.id,
    titulo: offer.titulo ?? "Oferta sin título",
    empresa: offer.empresa?.nombreComercial ?? "Empresa",
    sector: offer.empresa?.sector?.nombre ?? "Sector no especificado",
    ubicacion: formatLocation(offer),
    modalidad: (offer.modalidad as AdminOffer["modalidad"] | undefined) ?? "HIBRIDO",
    tipoContrato: (offer.tipoContrato as AdminOffer["tipoContrato"] | undefined) ?? "TIEMPO_COMPLETO",
    estado: (offer.estado as AdminOffer["estado"] | undefined) ?? "BORRADOR",
    publicadoEn: offer.publicadoEn ?? offer.creadoEn ?? "",
    cierreEn: offer.cierreEn ?? "",
    applicationsCount: offer._count?.postulaciones ?? 0,
  };
}
