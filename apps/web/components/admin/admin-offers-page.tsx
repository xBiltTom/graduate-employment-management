"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAdminOffers } from "@/lib/mock-data";

export function AdminOffersPage() {
  const [status, setStatus] = useState("all");

  const offers = useMemo(() => {
    return mockAdminOffers.filter((offer) => status === "all" || offer.estado === status);
  }, [status]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">Moderación de ofertas</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">Aprueba, rechaza o solicita ajustes a las publicaciones laborales antes de su visibilidad pública.</p>
      </div>

      <Card className="border-[var(--color-border-subtle)] shadow-sm">
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
            <SelectTrigger className="w-[240px]"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {[...new Set(mockAdminOffers.map((offer) => offer.estado))].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="border-[var(--color-border-subtle)] shadow-sm">
            <CardContent className="flex flex-col gap-4 p-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-2">
                <p className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-text-heading)]">{offer.titulo}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{offer.empresa} · {offer.sector}</p>
                <p className="text-sm text-[var(--color-text-body)]">{offer.ubicacion} · {offer.modalidad} · {offer.tipoContrato}</p>
                <div className="pt-1"><AdminStatusBadge status={offer.estado} /></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => toast.info("Vista detallada de oferta pendiente para integración futura.")}>Ver</Button>
                <Button variant="outline" onClick={() => toast.info("Solicitud de cambios temporal.")}>Solicitar cambios</Button>
                <Button variant="outline" onClick={() => toast.info("Rechazo temporal sin backend.")}>Rechazar</Button>
                <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={() => toast.success("Oferta aprobada solo localmente.")}>Aprobar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
