"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contractTypes, offerModalities } from "@/lib/constants";
import { OfferPreviewCard, type OfferDraft } from "@/components/company/offer-preview-card";

const steps = ["Información", "Condiciones", "Ubicación"];

const initialDraft: OfferDraft = {
  titulo: "",
  descripcion: "",
  vacantes: 1,
  modalidad: offerModalities.hybrid,
  tipoContrato: contractTypes.fullTime,
  salarioMin: "1800",
  salarioMax: "2500",
  pais: "Peru",
  region: "La Libertad",
  ciudad: "Trujillo",
  distrito: "Trujillo",
  direccion: "",
  cierreEn: "2026-06-30",
  habilidades: ["React", "TypeScript"],
};

export function OfferFormWizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<OfferDraft>(initialDraft);
  const [skillInput, setSkillInput] = useState("");

  const updateDraft = <K extends keyof OfferDraft>(key: K, value: OfferDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const addSkill = () => {
    const normalized = skillInput.trim();

    if (!normalized) return;

    if (!draft.habilidades.includes(normalized)) {
      setDraft((current) => ({ ...current, habilidades: [...current.habilidades, normalized] }));
    }

    setSkillInput("");
  };

  const submitDraft = () => {
    if (!draft.titulo.trim() || !draft.descripcion.trim()) {
      toast.error("Completa al menos el título y la descripción antes de continuar.");
      return;
    }

    toast.success("Oferta preparada para revisión", {
      description: "La publicación real será conectada con el backend en una fase posterior.",
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <Card className="border-[var(--color-border-subtle)] shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-wrap gap-3">
              {steps.map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${index <= step ? "bg-[var(--color-brand)] text-white" : "bg-[var(--color-surface-page)] text-[var(--color-text-muted)]"}`}>
                    {index + 1}
                  </div>
                  <span className={`text-sm font-medium ${index === step ? "text-[var(--color-text-heading)]" : "text-[var(--color-text-muted)]"}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {step === 0 ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Título del puesto</Label>
                  <Input value={draft.titulo} onChange={(event) => updateDraft("titulo", event.target.value)} placeholder="Ej. Desarrollador Frontend Junior" />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={draft.descripcion} onChange={(event) => updateDraft("descripcion", event.target.value)} className="min-h-40" placeholder="Describe objetivos, responsabilidades y propuesta de valor." />
                </div>
                <div className="space-y-2">
                  <Label>Vacantes</Label>
                  <Input type="number" min="1" value={draft.vacantes} onChange={(event) => updateDraft("vacantes", Number(event.target.value) || 1)} />
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Modalidad</Label>
                    <Select value={draft.modalidad} onValueChange={(value) => updateDraft("modalidad", value ?? offerModalities.hybrid)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={offerModalities.remote}>Remoto</SelectItem>
                        <SelectItem value={offerModalities.hybrid}>Híbrido</SelectItem>
                        <SelectItem value={offerModalities.onsite}>Presencial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de contrato</Label>
                    <Select value={draft.tipoContrato} onValueChange={(value) => updateDraft("tipoContrato", value ?? contractTypes.fullTime)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={contractTypes.fullTime}>Tiempo completo</SelectItem>
                        <SelectItem value={contractTypes.partTime}>Medio tiempo</SelectItem>
                        <SelectItem value={contractTypes.project}>Por proyecto</SelectItem>
                        <SelectItem value={contractTypes.internship}>Prácticas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Salario mínimo</Label>
                    <Input value={draft.salarioMin} onChange={(event) => updateDraft("salarioMin", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Salario máximo</Label>
                    <Input value={draft.salarioMax} onChange={(event) => updateDraft("salarioMax", event.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Fecha de cierre</Label>
                    <Input type="date" value={draft.cierreEn} onChange={(event) => updateDraft("cierreEn", event.target.value)} />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Habilidades requeridas</Label>
                  <div className="flex gap-2">
                    <Input value={skillInput} onChange={(event) => setSkillInput(event.target.value)} placeholder="Agregar habilidad" />
                    <Button type="button" variant="outline" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {draft.habilidades.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => updateDraft("habilidades", draft.habilidades.filter((item) => item !== skill))}
                        className="rounded-full bg-[var(--color-brand-light)] px-3 py-1 text-sm font-medium text-[var(--color-brand)]"
                      >
                        {skill} ×
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>País</Label>
                  <Input value={draft.pais} onChange={(event) => updateDraft("pais", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Región</Label>
                  <Input value={draft.region} onChange={(event) => updateDraft("region", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Ciudad</Label>
                  <Input value={draft.ciudad} onChange={(event) => updateDraft("ciudad", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Distrito</Label>
                  <Input value={draft.distrito} onChange={(event) => updateDraft("distrito", event.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Dirección</Label>
                  <Input value={draft.direccion} onChange={(event) => updateDraft("direccion", event.target.value)} placeholder="Av. Principal 123" />
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Atrás
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => toast.info("Borrador temporal guardado solo en la interfaz.")}>Guardar borrador</Button>
                {step < steps.length - 1 ? (
                  <Button type="button" className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={() => setStep((current) => current + 1)}>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="button" className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={submitDraft}>
                    Enviar a revisión
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <OfferPreviewCard draft={draft} />
    </div>
  );
}
