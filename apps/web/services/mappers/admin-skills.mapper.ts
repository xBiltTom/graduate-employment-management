import type { AdminSkill } from "@/types";

export type BackendAdminSkill = {
  id: string;
  nombre?: string | null;
  tipo?: string | null;
  categoria?: string | null;
};

export function mapBackendAdminSkill(
  skill: BackendAdminSkill,
  usageInGraduates = 0,
  usageInOffers = 0,
): AdminSkill {
  return {
    id: skill.id,
    name: skill.nombre ?? "Habilidad",
    type: (skill.tipo as AdminSkill["type"] | undefined) ?? "TECNICA",
    category: skill.categoria ?? undefined,
    isActive: true,
    usageInGraduates,
    usageInOffers,
  };
}
