"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, Search } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROUTES } from "@/lib/routes";
import type { AdminGraduate } from "@/types";

export function AdminGraduatesPage({ graduates: initialGraduates }: { graduates: AdminGraduate[] }) {
  const [search, setSearch] = useState("");
  const [career, setCareer] = useState("all");
  const [year, setYear] = useState("all");
  const [status, setStatus] = useState("all");

  const graduates = useMemo(() => {
    return initialGraduates.filter((graduate) => {
      const fullName = `${graduate.nombres} ${graduate.apellidos}`.toLowerCase();
      const matchesSearch = fullName.includes(search.toLowerCase());
      const matchesCareer = career === "all" || graduate.carrera === career;
      const matchesYear = year === "all" || String(graduate.anioEgreso) === year;
      const matchesStatus = status === "all" || graduate.estado === status;

      return matchesSearch && matchesCareer && matchesYear && matchesStatus;
    });
  }, [career, initialGraduates, search, status, year]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">Directorio de egresados</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">Busca, filtra y revisa el estado operativo de los perfiles registrados en la plataforma.</p>
      </div>

      <Card className="border-[var(--color-border-subtle)] shadow-sm">
        <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative xl:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre" className="pl-9" />
          </div>
          <Select value={career} onValueChange={(value) => setCareer(value ?? "all")}>
            <SelectTrigger><SelectValue placeholder="Carrera" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las carreras</SelectItem>
              {[...new Set(initialGraduates.map((item) => item.carrera))].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={(value) => setYear(value ?? "all")}>
            <SelectTrigger><SelectValue placeholder="Año" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier año</SelectItem>
              {[...new Set(initialGraduates.map((item) => String(item.anioEgreso)))].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {[...new Set(initialGraduates.map((item) => item.estado))].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {graduates.length ? (
        <div className="overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-white shadow-sm">
          <div className="grid grid-cols-[1.3fr_1fr_0.8fr_0.8fr] gap-4 border-b border-[var(--color-border-subtle)] px-6 py-4 text-sm font-semibold text-[var(--color-text-muted)]">
            <span>Egresado</span>
            <span>Programa</span>
            <span>Año / Estado</span>
            <span>Acciones</span>
          </div>
          {graduates.map((graduate) => (
            <div key={graduate.id} className="grid grid-cols-[1.3fr_1fr_0.8fr_0.8fr] gap-4 border-b border-[var(--color-border-subtle)] px-6 py-5 last:border-b-0">
              <div>
                <p className="font-semibold text-[var(--color-text-heading)]">{graduate.nombres} {graduate.apellidos}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{graduate.email}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-heading)]">{graduate.carrera}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{graduate.habilidades.slice(0, 2).join(" · ")}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[var(--color-text-heading)]">{graduate.anioEgreso}</p>
                <AdminStatusBadge status={graduate.estado} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={ROUTES.ADMIN.EGRESADO_DETAIL(graduate.id)}>
                  <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-2" />Ver</Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => toast.info("La suspensión real se implementará en una fase posterior.")}>Suspender</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-[var(--color-border-subtle)] border-dashed shadow-sm"><CardContent className="p-8 text-center text-[var(--color-text-muted)]">No hay egresados para los filtros actuales.</CardContent></Card>
      )}
    </div>
  );
}
