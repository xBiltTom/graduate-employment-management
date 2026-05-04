import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type OfferDraft = {
  titulo: string;
  descripcion: string;
  vacantes: number;
  modalidad: string;
  tipoContrato: string;
  salarioMin: string;
  salarioMax: string;
  pais: string;
  region: string;
  ciudad: string;
  distrito: string;
  direccion: string;
  cierreEn: string;
  habilidades: string[];
};

export function OfferPreviewCard({ draft }: { draft: OfferDraft }) {
  return (
    <Card className="border-[var(--color-border-subtle)] bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Vista previa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-text-heading)]">
            {draft.titulo || "Título de la oferta"}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            {draft.descripcion || "Aquí se verá la descripción principal de la vacante para los candidatos."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{draft.modalidad || "Modalidad"}</Badge>
          <Badge variant="outline">{draft.tipoContrato || "Tipo de contrato"}</Badge>
          <Badge variant="outline">{draft.vacantes} vacantes</Badge>
          <Badge variant="outline">
            {draft.salarioMin || "0"} - {draft.salarioMax || "0"}
          </Badge>
        </div>

        <div className="rounded-2xl bg-[var(--color-surface-page)] p-4 text-sm text-[var(--color-text-body)]">
          <p>
            {draft.ciudad || "Ciudad"}, {draft.region || "Región"}, {draft.pais || "País"}
          </p>
          <p className="mt-1 text-[var(--color-text-muted)]">{draft.direccion || "Dirección"}</p>
          <p className="mt-3 text-[var(--color-text-muted)]">Cierre estimado: {draft.cierreEn || "Sin fecha"}</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-text-heading)]">Habilidades</p>
          <div className="flex flex-wrap gap-2">
            {draft.habilidades.length ? (
              draft.habilidades.map((skill) => (
                <Badge key={skill} className="bg-[var(--color-brand-light)] text-[var(--color-brand)] border-0 hover:bg-[var(--color-brand-light)]">
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-[var(--color-text-muted)]">Sin habilidades agregadas aún.</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
