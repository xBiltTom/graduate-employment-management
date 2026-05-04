"use client";

import { toast } from "sonner";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">Configuración del sistema</h1>
        <p className="mt-2 text-[var(--color-text-muted)]">Panel visual para parámetros institucionales y preferencias operativas del entorno administrativo.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminSectionCard title="Información institucional" description="Datos visibles de la plataforma y canal de soporte.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input defaultValue="Sistema de Gestión de Egresados" />
            <Input defaultValue="soporte@sistema.com" />
            <Input defaultValue="Universidad Nacional" />
            <Input defaultValue="www.sistema-egresados.edu" />
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Preferencias operativas" description="Parámetros visuales, sin persistencia real en esta fase.">
          <div className="grid gap-4 md:grid-cols-2">
            <Select defaultValue="daily">
              <SelectTrigger><SelectValue placeholder="Frecuencia" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Resumen diario</SelectItem>
                <SelectItem value="weekly">Resumen semanal</SelectItem>
                <SelectItem value="manual">Solo manual</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="pending-first">
              <SelectTrigger><SelectValue placeholder="Prioridad" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending-first">Pendientes primero</SelectItem>
                <SelectItem value="latest">Más recientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AdminSectionCard>
      </div>

      <div className="flex justify-end">
        <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white" onClick={() => toast.success("Configuración preparada localmente. Sin persistencia real todavía.")}>Guardar cambios</Button>
      </div>
    </div>
  );
}
