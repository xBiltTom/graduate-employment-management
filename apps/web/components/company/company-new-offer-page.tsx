import { OfferFormWizard } from "@/components/company/offer-form-wizard";

export function CompanyNewOfferPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">Nueva oferta</p>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">Crear nueva vacante</h1>
        <p className="max-w-2xl text-[var(--color-text-muted)]">
          Diseña una publicación clara, prepara las condiciones y revisa cómo se verá antes de enviarla a revisión.
        </p>
      </div>
      <OfferFormWizard />
    </div>
  );
}
