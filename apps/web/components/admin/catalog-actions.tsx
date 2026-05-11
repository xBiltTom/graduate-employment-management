"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Power } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminCatalogItem } from "@/types";

type CatalogKind = "sector" | "career";

function getCatalogCopy(kind: CatalogKind) {
  if (kind === "sector") {
    return {
      singular: "sector",
      createLabel: "Nuevo sector",
      editLabel: "Editar sector",
      activateLabel: "Activar sector",
      deactivateLabel: "Desactivar sector",
      successCreate: "Sector creado correctamente.",
      successUpdate: "Sector actualizado correctamente.",
      successToggle: "Estado del sector actualizado.",
    };
  }

  return {
    singular: "carrera",
    createLabel: "Nueva carrera",
    editLabel: "Editar carrera",
    activateLabel: "Activar carrera",
    deactivateLabel: "Desactivar carrera",
    successCreate: "Carrera creada correctamente.",
    successUpdate: "Carrera actualizada correctamente.",
    successToggle: "Estado de la carrera actualizado.",
  };
}

async function createCatalogItem(kind: CatalogKind, name: string, description?: string) {
  if (kind === "sector") {
    return adminService.createSector({ name, description });
  }

  return adminService.createCareer({ name, description });
}

async function updateCatalogItem(kind: CatalogKind, item: AdminCatalogItem, name: string, description?: string) {
  if (kind === "sector") {
    return adminService.updateSector({ id: item.id, name, description });
  }

  return adminService.updateCareer({ id: item.id, name, description });
}

async function toggleCatalogItem(kind: CatalogKind, id: string) {
  if (kind === "sector") {
    return adminService.toggleSectorActive(id);
  }

  return adminService.toggleCareerActive(id);
}

function CatalogFormDialog({
  kind,
  item,
  open,
  onOpenChange,
}: {
  kind: CatalogKind;
  item?: AdminCatalogItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const copy = getCatalogCopy(kind);
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(item);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.info(`Debes ingresar un nombre para ${isEditing ? "la" : "el nuevo"} ${copy.singular}.`);
      return;
    }

    try {
      setIsSubmitting(true);

      if (item) {
        await updateCatalogItem(kind, item, trimmedName, trimmedDescription || undefined);
        toast.success(copy.successUpdate);
      } else {
        await createCatalogItem(kind, trimmedName, trimmedDescription || undefined);
        toast.success(copy.successCreate);
      }

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden border border-[var(--color-border-subtle)] bg-white p-0 shadow-2xl" showCloseButton={!isSubmitting}>
        <div className="relative overflow-hidden rounded-t-xl border-b border-[var(--color-border-subtle)] bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.14),transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] p-6">
          <div className="absolute right-4 top-4 text-[3.5rem] font-black tracking-[-0.08em] text-[var(--color-brand)]/10">
            {kind === "sector" ? "S" : "C"}
          </div>
          <DialogHeader className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-brand)]/70">
              Catálogo maestro
            </p>
            <DialogTitle className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-text-heading)]">
              {isEditing ? copy.editLabel : copy.createLabel}
            </DialogTitle>
            <DialogDescription className="max-w-lg text-[var(--color-text-muted)]">
              Define el nombre visible y una descripción de apoyo para mantener consistencia en los formularios de empresas y egresados.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 p-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--color-text-heading)]" htmlFor={`${kind}-name`}>
              Nombre
            </label>
            <Input
              id={`${kind}-name`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={kind === "sector" ? "Ej. Tecnología" : "Ej. Ingeniería de Sistemas"}
              className="border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--color-text-heading)]" htmlFor={`${kind}-description`}>
              Descripción
            </label>
            <Textarea
              id={`${kind}-description`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Breve contexto para administración y control del catálogo."
              className="min-h-28 border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter className="border-[var(--color-border-subtle)] bg-[var(--color-surface-page)]/70">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            className="bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear elemento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CreateCatalogAction({ kind }: { kind: CatalogKind }) {
  const [open, setOpen] = useState(false);
  const copy = getCatalogCopy(kind);

  return (
    <>
      <Button
        className="bg-[var(--color-brand)] text-white shadow-sm hover:bg-[var(--color-brand-hover)]"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4" />
        {copy.createLabel}
      </Button>
      <CatalogFormDialog key={`${kind}-create-${open ? "open" : "closed"}`} kind={kind} open={open} onOpenChange={setOpen} />
    </>
  );
}

export function CatalogItemActions({
  kind,
  item,
}: {
  kind: CatalogKind;
  item: AdminCatalogItem;
}) {
  const router = useRouter();
  const copy = getCatalogCopy(kind);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async () => {
    try {
      setIsSubmitting(true);
      await toggleCatalogItem(kind, item.id);
      toast.success(copy.successToggle);
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setOpen(true)} disabled={isSubmitting}>
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
        <Button variant="outline" onClick={() => void handleToggle()} disabled={isSubmitting}>
          <Power className="h-4 w-4" />
          {isSubmitting
            ? "Procesando..."
            : item.isActive
              ? copy.deactivateLabel
              : copy.activateLabel}
        </Button>
      </div>
      <CatalogFormDialog key={`${kind}-${item.id}-${open ? "open" : "closed"}`} kind={kind} item={item} open={open} onOpenChange={setOpen} />
    </>
  );
}
