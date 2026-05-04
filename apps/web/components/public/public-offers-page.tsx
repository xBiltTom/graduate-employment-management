import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { featuredJobs } from '@/lib/mock-data';
import { offerModalities } from '@/lib/constants';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Building, MapPin, Search, Filter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function PublicOffersPage() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters (Visual) */}
        <aside className="w-full md:w-64 space-y-6 flex-shrink-0">
          <div>
            <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filtros
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Modalidad</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="mod-remoto" className="rounded border-gray-300" />
                    <label htmlFor="mod-remoto" className="text-sm text-muted-foreground">Remoto</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="mod-presencial" className="rounded border-gray-300" />
                    <label htmlFor="mod-presencial" className="text-sm text-muted-foreground">Presencial</label>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de contrato</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="type-full" className="rounded border-gray-300" />
                    <label htmlFor="type-full" className="text-sm text-muted-foreground">Tiempo Completo</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="type-part" className="rounded border-gray-300" />
                    <label htmlFor="type-part" className="text-sm text-muted-foreground">Medio Tiempo</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full">Limpiar Filtros</Button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por cargo, empresa o palabra clave..."
                className="pl-8 bg-background"
              />
            </div>
            <Button>Buscar</Button>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              {featuredJobs.length} ofertas encontradas
            </h2>
          </div>

          <div className="grid gap-4">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={ROUTES.PUBLIC.OFERTA_DETAIL(job.id)} className="hover:underline">
                            <h3 className="text-xl font-bold">{job.title}</h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                            <Building className="h-4 w-4" />
                            <span>{job.company}</span>
                          </div>
                        </div>
                        {job.modality === offerModalities.remote && <Badge>Remoto</Badge>}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.contractType}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {job.skills.map(tag => (
                          <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 min-w-[150px]">
                      <div className="font-medium text-lg mb-2">{job.salaryRange}</div>
                      <Link
                        href={ROUTES.PUBLIC.OFERTA_DETAIL(job.id)}
                        className={buttonVariants()}
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {featuredJobs.length === 0 && (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">No se encontraron ofertas que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
