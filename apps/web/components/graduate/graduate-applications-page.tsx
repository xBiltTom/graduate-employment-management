"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { applicationStatuses } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Calendar, FileText, CheckCircle2, Clock, MapPin, Search } from "lucide-react";
import type { GraduateApplication } from "@/types";

const getStatusDetails = (status: string) => {
  switch (status) {
    case applicationStatuses.applied:
      return { label: "Postulado", color: "bg-blue-100 text-blue-700", icon: FileText, step: 1 };
    case applicationStatuses.reviewing:
      return { label: "En Revisión", color: "bg-amber-100 text-amber-700", icon: Clock, step: 2 };
    case applicationStatuses.interview:
      return { label: "Entrevista", color: "bg-purple-100 text-purple-700", icon: Calendar, step: 3 };
    case applicationStatuses.hired:
      return { label: "Contratado", color: "bg-[var(--color-success)]/20 text-[var(--color-success)]", icon: CheckCircle2, step: 4 };
    case applicationStatuses.rejected:
      return { label: "No Seleccionado", color: "bg-[var(--color-error)]/20 text-[var(--color-error)]", icon: CheckCircle2, step: 4 };
    default:
      return { label: "Desconocido", color: "bg-gray-100 text-gray-700", icon: FileText, step: 0 };
  }
};

type GraduateApplicationsPageProps = {
  applications: GraduateApplication[];
};

export function GraduateApplicationsPage({
  applications,
}: GraduateApplicationsPageProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") {
      return (app.status as string) !== applicationStatuses.hired && (app.status as string) !== applicationStatuses.rejected;
    }
    return app.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-fade-up max-w-[1000px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
            Mis Postulaciones
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Da seguimiento al estado de tus procesos de selección activos.
          </p>
        </div>
        
        <Link href={ROUTES.EGRESADO.OFERTAS}>
          <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm">
            <Search className="h-4 w-4 mr-2" /> Buscar más ofertas
          </Button>
        </Link>
      </div>

      {/* Filters/Tabs */}
      <Tabs defaultValue="all" value={filterStatus} onValueChange={setFilterStatus} className="w-full">
        <TabsList className="bg-[var(--color-surface)] border border-[var(--color-border-subtle)] h-auto p-1 overflow-x-auto flex w-full justify-start sm:justify-center">
          <TabsTrigger value="all" className="rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[var(--color-brand)] data-[state=active]:shadow-sm">
            Todas ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[var(--color-brand)] data-[state=active]:shadow-sm">
            Activas ({applications.filter(a => (a.status as string) !== applicationStatuses.hired && (a.status as string) !== applicationStatuses.rejected).length})
          </TabsTrigger>
          <TabsTrigger value={applicationStatuses.hired} className="rounded-md px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-[var(--color-success)] data-[state=active]:shadow-sm">
            Contrataciones
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Applications List */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const statusInfo = getStatusDetails(app.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={app.id} className="border-[var(--color-border-subtle)] shadow-sm hover:border-[var(--color-brand)]/30 transition-colors overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left: Basic Info */}
                    <div className="p-6 md:w-5/12 flex gap-4 border-b md:border-b-0 md:border-r border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm border border-[var(--color-border-subtle)] shrink-0">
                        <span className="text-xl font-bold text-[var(--color-brand)]">
                          {app.job?.company.charAt(0) || "E"}
                        </span>
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-[var(--font-heading)] font-bold text-[var(--color-text-heading)] line-clamp-2">
                          {app.job?.title}
                        </h3>
                        <div className="flex flex-col gap-1 text-sm text-[var(--color-text-body)]">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Building2 className="h-4 w-4 text-[var(--color-text-muted)]" />
                            {app.job?.company}
                          </span>
                          <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                            <MapPin className="h-4 w-4" />
                            {app.job?.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Status Timeline & Action */}
                    <div className="p-6 md:w-7/12 flex flex-col sm:flex-row items-center gap-6 justify-between bg-white">
                      
                      {/* Timeline */}
                      <div className="w-full flex-1">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`${statusInfo.color} border-0 flex items-center gap-1 font-medium px-2.5 py-1`}>
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <span className="text-xs text-[var(--color-text-muted)] font-medium">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Visual Progress Bar */}
                        <div className="relative mt-4">
                          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-[var(--color-border-subtle)] rounded-full"></div>
                          <div 
                            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-[var(--color-brand)] rounded-full transition-all duration-500"
                            style={{ width: `${(statusInfo.step / 4) * 100}%` }}
                          ></div>
                          
                          <div className="relative flex justify-between">
                            {[1, 2, 3, 4].map((step) => (
                              <div 
                                key={step} 
                                className={`h-3 w-3 rounded-full border-2 bg-white ${
                                  step <= statusInfo.step 
                                    ? "border-[var(--color-brand)]" 
                                    : "border-[var(--color-border-subtle)]"
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between mt-1.5 text-[10px] text-[var(--color-text-muted)] font-medium px-1">
                          <span>Postulado</span>
                          <span>Revisión</span>
                          <span>Entrevista</span>
                          <span>Finalizado</span>
                        </div>
                      </div>
                      
                      {/* Action */}
                      <Link href={ROUTES.EGRESADO.OFERTA_DETAIL(app.jobId)}>
                        <Button variant="outline" className="w-full sm:w-auto border-[var(--color-border-subtle)] text-[var(--color-text-heading)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] shrink-0">
                          Ver detalle
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-[var(--color-border-subtle)] shadow-sm border-dashed border-2 bg-transparent py-16">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4 p-6">
            <div className="h-16 w-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border-subtle)]">
              <FileText className="h-8 w-8 text-[var(--color-text-muted)]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text-heading)]">Sin postulaciones activas</h3>
              <p className="text-[var(--color-text-muted)] mt-2 max-w-md mx-auto">
                {filterStatus === "all" 
                  ? "Aún no te has postulado a ninguna oferta. ¡Explora las vacantes disponibles y da el primer paso!"
                  : "No tienes postulaciones en este estado."}
              </p>
            </div>
            <Link href={ROUTES.EGRESADO.OFERTAS} className="mt-4">
              <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm">
                Buscar ofertas
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
