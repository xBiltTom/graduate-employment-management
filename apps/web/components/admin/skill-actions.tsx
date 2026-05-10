"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { skillTypes } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminSkill } from "@/types";

function normalizeSkillType(value: string | null) {
  if (value === skillTypes.technical || value === skillTypes.soft) {
    return value;
  }

  return null;
}

export function CreateSkillAction() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    try {
      const name = window.prompt("Nombre de la habilidad")?.trim();

      if (!name) {
        toast.info("Debes ingresar un nombre para la habilidad.");
        return;
      }

      const type = normalizeSkillType(
        window.prompt("Tipo de habilidad: TECNICA o BLANDA", skillTypes.technical)?.trim() ?? null,
      );

      if (!type) {
        toast.info("El tipo debe ser TECNICA o BLANDA.");
        return;
      }

      const category = window.prompt("Categoría", "General")?.trim() ?? undefined;

      setIsSubmitting(true);
      await adminService.createSkill({
        name,
        type,
        category,
      });
      toast.success("Habilidad creada correctamente.");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white"
      onClick={() => void handleCreate()}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Creando..." : "Nueva habilidad"}
    </Button>
  );
}

type SkillActionsProps = {
  skill: AdminSkill;
};

export function SkillActions({ skill }: SkillActionsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = async () => {
    try {
      const name = window.prompt("Nombre de la habilidad", skill.name)?.trim();

      if (!name) {
        toast.info("Debes ingresar un nombre para la habilidad.");
        return;
      }

      const type = normalizeSkillType(
        window.prompt("Tipo de habilidad: TECNICA o BLANDA", skill.type)?.trim() ?? null,
      );

      if (!type) {
        toast.info("El tipo debe ser TECNICA o BLANDA.");
        return;
      }

      const category = window.prompt("Categoría", skill.category ?? "")?.trim() ?? "";

      setIsSubmitting(true);
      await adminService.updateSkill({
        id: skill.id,
        name,
        type,
        category,
      });
      toast.success("Habilidad actualizada correctamente.");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`¿Deseas eliminar la habilidad ${skill.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      setIsSubmitting(true);
      await adminService.deleteSkill(skill.id);
      toast.success("Habilidad eliminada correctamente.");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => void handleEdit()} disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Editar"}
      </Button>
      <Button variant="outline" onClick={() => void handleDelete()} disabled={isSubmitting}>
        {isSubmitting ? "Procesando..." : "Eliminar"}
      </Button>
    </div>
  );
}
