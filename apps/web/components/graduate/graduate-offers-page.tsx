"use client";

import { useState } from "react";
import Link from "next/link";
import { featuredJobs } from "@/lib/mock-data";
import { ROUTES } from "@/lib/routes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Filter, Building2, X } from "lucide-react";

export function GraduateOffersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModality, setFilterModality] = useState<string>("all");
  
  // Basic local filtering
  const filteredJobs = featuredJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesModality = filterModality === "all" || job.modality === filterModality;
    
    return matchesSearch && matchesModality;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="space-y-1">
        <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
          Descubre Oportunidades
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Encuentra ofertas laborales exclusivas que hacen match con tu perfil profesional.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <Card className="border-[var(--color-border-subtle)] shadow-sm bg-[var(--color-surface)]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
              <Input
                placeholder="Buscar por rol, empresa o habilidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)] bg-white h-11"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-4">
              <div className="w-full md:w-48">
                <Select value={filterModality} onValueChange={(val) => setFilterModality(val || "all")}>
                  <SelectTrigger className="border-[var(--color-border-subtle)] focus:ring-[var(--color-brand)] bg-white h-11">
                    <SelectValue placeholder="Modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las modalidades</SelectItem>
                    <SelectItem value="REMOTO">Remoto</SelectItem>
                    <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                    <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" className="border-[var(--color-border-subtle)] bg-white h-11 px-4">
                <Filter className="h-4 w-4 mr-2" />
                Más filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex justify-between items-center px-1">
        <h2 className="font-semibold text-[var(--color-text-heading)]">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
        </h2>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <span>Ordenar por:</span>
          <Select defaultValue="relevance">
            <SelectTrigger className="h-8 w-[140px] border-none bg-transparent shadow-none focus:ring-0 text-[var(--color-text-heading)] font-medium p-0 flex justify-end gap-1">
              <SelectValue placeholder="Relevancia" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="relevance">Mayor Match</SelectItem>
              <SelectItem value="recent">Más recientes</SelectItem>
              <SelectItem value="salary">Mayor salario</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Jobs Feed */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="border-[var(--color-border-subtle)] shadow-sm group hover:border-[var(--color-brand)]/50 hover:shadow-md transition-all duration-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Match Bar indicator */}
                  <div className="w-full md:w-1.5 h-1.5 md:h-auto bg-[var(--color-border-subtle)] shrink-0">
                    <div 
                      className={`h-full ${job.match >= 80 ? 'bg-[var(--color-success)]' : job.match >= 60 ? 'bg-amber-400' : 'bg-blue-400'}`} 
                      style={{ height: '100%' }} // Note: In a real app with vertical layout, you'd use style={{height: `${job.match}%`}} but for UI consistency we just use full height color
                    />
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col md:flex-row gap-6 items-start">
                    {/* Logo */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-brand-light)] shrink-0 shadow-sm border border-[var(--color-brand)]/10">
                      <span className="text-2xl font-bold text-[var(--color-brand)]">
                        {job.company.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Main info */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <Link href={ROUTES.EGRESADO.OFERTA_DETAIL(job.id)} className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-text-heading)] hover:text-[var(--color-brand)] transition-colors line-clamp-1">
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-sm text-[var(--color-text-body)]">
                            <Building2 className="h-4 w-4" />
                            <span className="font-medium">{job.company}</span>
                            <span className="text-[var(--color-border-subtle)]">•</span>
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{job.location}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="w-fit bg-[var(--color-success)]/10 text-[var(--color-success)] border-0 font-semibold px-3 py-1">
                          {job.match}% match
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge variant="outline" className="border-[var(--color-border-subtle)] text-[var(--color-text-muted)] text-xs font-normal bg-[var(--color-surface)]">
                          {job.modality}
                        </Badge>
                        <Badge variant="outline" className="border-[var(--color-border-subtle)] text-[var(--color-text-muted)] text-xs font-normal bg-[var(--color-surface)]">
                          {job.contractType.replace("_", " ")}
                        </Badge>
                        {job.salaryRange && (
                          <Badge variant="outline" className="border-[var(--color-border-subtle)] text-[var(--color-text-muted)] text-xs font-normal bg-[var(--color-surface)]">
                            {job.salaryRange}
                          </Badge>
                        )}
                        <span className="text-[var(--color-border-subtle)] hidden sm:inline">•</span>
                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 3).map(skill => (
                            <Badge key={skill} variant="secondary" className="bg-[var(--color-brand-light)] text-[var(--color-brand)] border-0 text-xs font-medium">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <span className="text-xs text-[var(--color-text-muted)] ml-1 align-middle">
                              +{job.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action */}
                    <div className="w-full md:w-auto flex flex-row md:flex-col items-center justify-between gap-4 md:pl-6 md:border-l border-[var(--color-border-subtle)] self-stretch">
                      <div className="text-xs text-[var(--color-text-muted)] hidden md:block">
                        Publicado el {new Date(job.publishedDate).toLocaleDateString()}
                      </div>
                      <Link href={ROUTES.EGRESADO.OFERTA_DETAIL(job.id)} className="w-full">
                        <Button className="w-full md:w-auto bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm">
                          Ver Detalle
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-[var(--color-border-subtle)] shadow-sm bg-[var(--color-surface)] border-dashed border-2 py-16">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-[var(--color-brand-light)] flex items-center justify-center">
              <Search className="h-8 w-8 text-[var(--color-brand)]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text-heading)]">No encontramos ofertas</h3>
              <p className="text-[var(--color-text-muted)] mt-2 max-w-md mx-auto">
                No hay resultados que coincidan con tu búsqueda actual. Intenta ajustar los filtros o buscar con otros términos.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setFilterModality("all");
              }}
              className="mt-2 border-[var(--color-border-subtle)] text-[var(--color-text-heading)] hover:bg-[var(--color-brand-light)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)]"
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
