"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApplyToJobButton } from "@/components/graduate/apply-to-job-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, MapPin, Briefcase, Calendar, CheckCircle2, ChevronLeft, AlertCircle, Share2, BookmarkPlus } from "lucide-react";
import type { JobSummary } from "@/types";

export function GraduateOfferDetailPage({ job }: { job: JobSummary | null }) {
  const router = useRouter();

  if (!job) {
    return null;
  }

  const handleSave = () => {
    toast.info("Oferta guardada", {
      description: "La oferta ha sido guardada en tus favoritos.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-[1000px] mx-auto">
      {/* Navigation */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]/50 -ml-2 mb-2"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Volver a resultados
      </Button>

      {/* Header Card */}
      <Card className="border-[var(--color-border-subtle)] shadow-sm bg-gradient-to-r from-[var(--color-brand-light)]/20 to-[var(--color-surface)] overflow-hidden">
        <CardContent className="p-0">
          {/* Top colored border */}
          <div className="h-2 w-full bg-[var(--color-brand)]"></div>
          
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-start justify-between">
            <div className="flex gap-6 items-start">
              {/* Logo */}
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-white shrink-0 shadow-sm border border-[var(--color-border-subtle)]">
                <span className="text-3xl sm:text-4xl font-bold text-[var(--color-brand)]">
                  {job.company.charAt(0)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--color-text-heading)]">
                    {job.title}
                  </h1>
                  <Badge variant="secondary" className="w-fit bg-[var(--color-success)]/15 text-[var(--color-success)] border-0 text-sm font-semibold px-3 py-1">
                    {job.match}% match con tu perfil
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-body)]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building2 className="h-4 w-4 text-[var(--color-text-muted)]" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[var(--color-text-muted)]" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-[var(--color-text-muted)]" />
                    {job.modality}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="outline" className="border-[var(--color-border-subtle)] text-[var(--color-text-muted)] bg-white font-normal">
                    {job.contractType.replace("_", " ")}
                  </Badge>
                  {job.salaryRange && (
                    <Badge variant="outline" className="border-[var(--color-border-subtle)] text-[var(--color-text-muted)] bg-white font-normal">
                      💰 {job.salaryRange}
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-[var(--color-border-subtle)] text-[var(--color-text-muted)] bg-white font-normal">
                    Publicado: {new Date(job.publishedDate).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Actions Desktop */}
            <div className="hidden md:flex flex-col gap-3 min-w-[200px]">
              <ApplyToJobButton jobId={job.id} className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-md text-base h-12" />
              <div className="flex gap-2">
                <Button onClick={handleSave} variant="outline" className="flex-1 border-[var(--color-border-subtle)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]/30">
                  <BookmarkPlus className="h-4 w-4 mr-2" /> Guardar
                </Button>
                <Button variant="outline" size="icon" className="border-[var(--color-border-subtle)] hover:text-[var(--color-text-heading)]">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content & Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardContent className="p-6 sm:p-8 space-y-8">
              
              {/* Description */}
              <div className="space-y-4">
                <h2 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-text-heading)] flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[var(--color-brand)]" />
                  Descripción del puesto
                </h2>
                <div className="text-[var(--color-text-body)] leading-relaxed space-y-4">
                  <p>{job.description}</p>
                </div>
              </div>

              <Separator className="bg-[var(--color-border-subtle)]" />

              {/* Requirements */}
              <div className="space-y-4">
                <h2 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-text-heading)] flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-brand)]" />
                  Requisitos del perfil
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)] shrink-0 mt-2"></div>
                      <span className="text-[var(--color-text-body)] leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator className="bg-[var(--color-border-subtle)]" />

              {/* Skills */}
              <div className="space-y-4">
                <h2 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-text-heading)]">
                  Habilidades valoradas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-[var(--color-brand-light)]/50 hover:bg-[var(--color-brand-light)] text-[var(--color-brand)] border border-[var(--color-brand)]/20 px-3 py-1.5 text-sm font-medium transition-colors">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          
          {/* Company Info */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm bg-[var(--color-surface)]">
            <CardContent className="p-6 space-y-6">
              <h3 className="font-[var(--font-heading)] text-lg font-bold text-[var(--color-text-heading)]">
                Sobre la empresa
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm border border-[var(--color-border-subtle)] shrink-0">
                  <span className="text-xl font-bold text-[var(--color-brand)]">
                    {job.company.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text-heading)]">{job.company}</p>
                  <p className="text-sm text-[var(--color-brand)] flex items-center gap-1 font-medium mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Empresa verificada
                  </p>
                </div>
              </div>
              
              <Separator className="bg-[var(--color-border-subtle)]" />
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-muted)] flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Publicado
                  </span>
                  <span className="font-medium text-[var(--color-text-heading)]">
                    {new Date(job.publishedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-muted)] flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Cierre
                  </span>
                  <span className="font-medium text-[var(--color-error)]">
                    {new Date(job.closingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full border-[var(--color-border-subtle)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]">
                Ver perfil de empresa
              </Button>
            </CardContent>
          </Card>
          
          {/* Notice Card */}
          <Card className="border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-4 flex gap-3 text-sm text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
              <p>
                Recuerda que esta plataforma es solo para egresados validados. No compartas información confidencial en el proceso de selección.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--color-border-subtle)] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 flex gap-3">
        <Button onClick={handleSave} variant="outline" size="icon" className="h-12 w-12 shrink-0 border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
          <BookmarkPlus className="h-5 w-5" />
        </Button>
        <ApplyToJobButton jobId={job.id} className="flex-1 h-12 bg-[var(--color-brand)] text-white font-semibold shadow-md" />
      </div>
    </div>
  );
}
