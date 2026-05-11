"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CatalogItemActions, CreateCatalogAction } from "@/components/admin/catalog-actions";
import type { AdminCatalogItem } from "@/types";

type CatalogKind = "sector" | "career";

function formatRelativeAudience(kind: CatalogKind) {
  return kind === "sector" ? "empresas" : "egresados";
}

function formatUpdatedAt(value: string) {
  if (!value) {
    return "Sin fecha registrada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function AdminCatalogPage({
  kind,
  title,
  description,
  items: initialItems,
}: {
  kind: CatalogKind;
  title: string;
  description: string;
  items: AdminCatalogItem[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const audience = formatRelativeAudience(kind);

  const items = useMemo(() => {
    return initialItems.filter((item) => {
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch = !normalizedSearch
        || item.name.toLowerCase().includes(normalizedSearch)
        || item.description?.toLowerCase().includes(normalizedSearch);
      const matchesStatus = status === "all"
        || (status === "active" && item.isActive)
        || (status === "inactive" && !item.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [initialItems, search, status]);

  const activeCount = initialItems.filter((item) => item.isActive).length;
  const linkedCount = initialItems.reduce((accumulator, item) => accumulator + item.usageCount, 0);

  return (
    <div className="space-y-6 animate-fade-up">
      <section className="relative overflow-hidden rounded-[28px] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(239,246,255,0.98)_38%,rgba(248,250,252,0.94)_100%)] p-6 shadow-sm md:p-8">
        <div className="absolute inset-y-0 right-0 hidden w-72 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.16),transparent_62%)] lg:block" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-brand)]/75">
              Orquestación de catálogos
            </p>
            <h1 className="mt-3 font-[var(--font-heading)] text-3xl font-bold tracking-tight text-[var(--color-text-heading)] md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)] md:text-base">
              {description}
            </p>
          </div>
          <CreateCatalogAction kind={kind} />
        </div>

        <div className="relative mt-8 grid gap-4 md:grid-cols-3">
          <Card className="border-white/70 bg-white/80 shadow-none backdrop-blur-sm">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Total catálogo</p>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">{initialItems.length}</p>
            </CardContent>
          </Card>
          <Card className="border-white/70 bg-white/80 shadow-none backdrop-blur-sm">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Activos</p>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">{activeCount}</p>
            </CardContent>
          </Card>
          <Card className="border-white/70 bg-white/80 shadow-none backdrop-blur-sm">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Asignaciones</p>
              <p className="mt-3 font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">{linkedCount}</p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">Seleccionados actualmente por {audience}.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="border-[var(--color-border-subtle)] shadow-sm">
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_220px]">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Buscar ${kind === "sector" ? "sector" : "carrera"}`}
            className="border-[var(--color-border-subtle)]"
          />
          <Select value={status} onValueChange={(value) => setStatus(value ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Solo activos</SelectItem>
              <SelectItem value="inactive">Solo inactivos</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {items.length ? (
          items.map((item, index) => (
            <Card
              key={item.id}
              className="overflow-hidden border-[var(--color-border-subtle)] bg-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
            >
              <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.5fr_0.8fr_auto] lg:items-center">
                <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(248,250,252,0.9),rgba(255,255,255,1))] p-5">
                  <div className="absolute right-4 top-3 text-5xl font-black tracking-[-0.08em] text-[var(--color-brand)]/8">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="relative">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-text-heading)]">
                        {item.name}
                      </p>
                      <Badge
                        className={item.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"}
                        variant="outline"
                      >
                        {item.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
                      {item.description ?? "Sin descripción complementaria."}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-3xl bg-[var(--color-surface-page)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">En uso por</p>
                    <p className="mt-2 font-[var(--font-heading)] text-2xl font-bold text-[var(--color-text-heading)]">
                      {item.usageCount}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">{audience}</p>
                  </div>
                  <div className="rounded-3xl bg-[var(--color-surface-page)] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Última edición</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-text-heading)]">
                      {formatUpdatedAt(item.updatedAt)}
                    </p>
                  </div>
                </div>

                <CatalogItemActions kind={kind} item={item} />
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-[var(--color-border-subtle)] shadow-none">
            <CardContent className="p-8 text-center">
              <p className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-text-heading)]">
                No encontramos resultados
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Ajusta los filtros o crea un nuevo elemento para ampliar el catálogo.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
