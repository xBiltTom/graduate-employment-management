"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAdminSkills } from "@/lib/mock-data";
import { skillTypes } from "@/lib/constants";

export function AdminSkillsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const skills = useMemo(() => {
    return mockAdminSkills.filter((skill) => {
      const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = type === "all" || skill.type === type;
      return matchesSearch && matchesType;
    });
  }, [search, type]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">Gestión de habilidades</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">Administra el catálogo maestro de competencias técnicas y blandas usadas por el sistema.</p>
        </div>
        <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={() => toast.info("La creación real de habilidades llegará en otra fase.")}>Nueva habilidad</Button>
      </div>

      <Card className="border-[var(--color-border-subtle)] shadow-sm">
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_240px]">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar habilidad" />
          <Select value={type} onValueChange={(value) => setType(value ?? "all")}>
            <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value={skillTypes.technical}>Técnica</SelectItem>
              <SelectItem value={skillTypes.soft}>Blanda</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {skills.map((skill) => (
          <Card key={skill.id} className="border-[var(--color-border-subtle)] shadow-sm">
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-[var(--color-text-heading)]">{skill.name}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{skill.category} · {skill.type}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
                <div className="rounded-2xl bg-[var(--color-surface-page)] p-3 text-sm">
                  <p className="text-[var(--color-text-muted)]">Uso en egresados</p>
                  <p className="mt-1 font-semibold text-[var(--color-text-heading)]">{skill.usageInGraduates}</p>
                </div>
                <div className="rounded-2xl bg-[var(--color-surface-page)] p-3 text-sm">
                  <p className="text-[var(--color-text-muted)]">Uso en ofertas</p>
                  <p className="mt-1 font-semibold text-[var(--color-text-heading)]">{skill.usageInOffers}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => toast.info("Edición visual temporal.")}>Editar</Button>
                <Button variant="outline" onClick={() => toast.info("Desactivación temporal sin backend.")}>Desactivar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
