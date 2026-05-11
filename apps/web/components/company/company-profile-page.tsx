"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errors";
import { companyService, publicService } from "@/services";
import type { CatalogOption, CompanyProfile, CompanyValidationState } from "@/types";

type CompanyProfilePageProps = {
  initialProfile: CompanyProfile;
  validationState?: CompanyValidationState;
};

export function CompanyProfilePage({
  initialProfile,
  validationState,
}: CompanyProfilePageProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [profile, setProfile] = useState(initialProfile);
  const [sectors, setSectors] = useState<CatalogOption[]>([]);

  useEffect(() => {
    let isMounted = true;

    void publicService.getSectors()
      .then((items) => {
        if (!isMounted) {
          return;
        }

        setSectors(items);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setSectors([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const save = async () => {
    try {
      setSaving(true);

      const updatedProfile = await companyService.updateProfile({
        nombreComercial: profile.nombreComercial,
        telefono: profile.telefono,
        descripcion: profile.descripcion,
        sitioWeb: profile.sitioWeb,
        direccion: profile.direccion,
        ciudad: profile.ciudad,
        region: profile.region,
        pais: profile.pais,
        sectorId: profile.sectorId,
      });

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setEditing(false);
      toast.success("Perfil actualizado", {
        description: "La información de la empresa fue actualizada correctamente.",
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">Perfil de empresa</p>
          <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">{profile.nombreComercial}</h1>
          <p className="text-[var(--color-text-muted)]">Mantén actualizada tu identidad institucional y la información que verán los candidatos.</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setProfile(savedProfile); setEditing(false); }}>Cancelar</Button>
            <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={() => void save()} disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</Button>
          </div>
        ) : (
          <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={() => setEditing(true)}>Editar perfil</Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-[var(--color-border-subtle)] shadow-sm">
          <CardContent className="p-8 space-y-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,var(--color-brand-light),white)] text-3xl font-bold text-[var(--color-brand)] shadow-sm">
                T
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--color-text-heading)]">{profile.nombreComercial}</h2>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 hover:bg-emerald-100">{profile.validationStatus}</Badge>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">{profile.razonSocial}</p>
                <p className="text-sm text-[var(--color-text-body)]">RUC: {profile.ruc}</p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--color-text-heading)]">Sector</p>
                {editing ? (
                  <Select
                    value={profile.sectorId ?? ""}
                    onValueChange={(value) => {
                      const selectedSector = sectors.find((sector) => sector.id === value);
                      setProfile({
                        ...profile,
                        sectorId: value || undefined,
                        sector: selectedSector?.name ?? profile.sector,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-[var(--color-text-body)]">{profile.sector}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--color-text-heading)]">Sitio web</p>
                {editing ? <Input value={profile.sitioWeb ?? ""} onChange={(event) => setProfile({ ...profile, sitioWeb: event.target.value })} /> : <p className="text-[var(--color-text-body)]">{profile.sitioWeb}</p>}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--color-text-heading)]">Ciudad</p>
                {editing ? <Input value={profile.ciudad ?? ""} onChange={(event) => setProfile({ ...profile, ciudad: event.target.value })} /> : <p className="text-[var(--color-text-body)]">{profile.ciudad}</p>}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--color-text-heading)]">Región</p>
                {editing ? <Input value={profile.region ?? ""} onChange={(event) => setProfile({ ...profile, region: event.target.value })} /> : <p className="text-[var(--color-text-body)]">{profile.region}</p>}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--color-text-heading)]">País</p>
                {editing ? <Input value={profile.pais ?? ""} onChange={(event) => setProfile({ ...profile, pais: event.target.value })} /> : <p className="text-[var(--color-text-body)]">{profile.pais ?? "Peru"}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-semibold text-[var(--color-text-heading)]">Dirección</p>
                {editing ? <Input value={profile.direccion ?? ""} onChange={(event) => setProfile({ ...profile, direccion: event.target.value })} /> : <p className="text-[var(--color-text-body)]">{profile.direccion ?? "Sin dirección registrada"}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--color-text-heading)]">Descripción</p>
              {editing ? (
                <Textarea value={profile.descripcion ?? ""} onChange={(event) => setProfile({ ...profile, descripcion: event.target.value })} className="min-h-32" />
              ) : (
                <p className="leading-7 text-[var(--color-text-body)]">{profile.descripcion}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader><CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Contacto</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-heading)]">Email</p>
                <p className="mt-2 text-[var(--color-text-body)]">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-heading)]">Teléfono</p>
                {editing ? (
                  <Input value={profile.telefono ?? ""} onChange={(event) => setProfile({ ...profile, telefono: event.target.value })} className="mt-2" />
                ) : (
                  <p className="mt-2 text-[var(--color-text-body)]">{profile.telefono ?? "Sin teléfono registrado"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader><CardTitle className="font-[var(--font-heading)] text-xl text-[var(--color-text-heading)]">Estado de validación</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-[var(--color-text-body)]">
              <p>{validationState?.message ?? "Consulta el estado actual de validación de tu empresa."}</p>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 hover:bg-emerald-100 w-fit">{validationState?.status ?? profile.validationStatus}</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
