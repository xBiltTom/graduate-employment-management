import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { featuredJobs } from '@/lib/mock-data';
import { offerModalities } from '@/lib/constants';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Briefcase, Building, Calendar, MapPin, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type PublicOfferDetailPageProps = {
  id: string;
};

export function PublicOfferDetailPage({ id }: PublicOfferDetailPageProps) {
  const job = featuredJobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="container py-20 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold mb-2">Oferta no encontrada</h2>
        <p className="text-muted-foreground mb-6">La oferta que buscas no existe o ha sido retirada.</p>
        <Link
          href={ROUTES.PUBLIC.OFERTAS}
          className={buttonVariants()}
        >
          Volver a Ofertas
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6 max-w-5xl">
      <div className="mb-6">
        <Link href={ROUTES.PUBLIC.OFERTAS} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a ofertas
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {/* Header Info */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Link
                  href={ROUTES.AUTH.LOGIN}
                  className={buttonVariants()}
                >
                  Postularme
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1 text-foreground font-medium">
                <Building className="h-4 w-4" />
                {job.company}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {job.contractType}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Publicado hace 2 días
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {job.modality === offerModalities.remote && <Badge variant="default">Remoto</Badge>}
              <Badge variant="secondary">Informativa temporal</Badge>
              {job.skills.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-bold mb-4">Descripción del puesto</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  En <strong>{job.company}</strong> estamos buscando un profesional apasionado para unirse a nuestro equipo
                  como <strong>{job.title}</strong>. Formarás parte de un entorno dinámico y colaborativo.
                </p>
                <p>
                  Esta es una oferta temporal simulada. En fases posteriores, este contenido vendrá directamente
                  desde el backend con la descripción completa del puesto, responsabilidades y beneficios ofrecidos
                  por la empresa.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4">Requisitos</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Experiencia previa en roles similares.</li>
                <li>Conocimientos en {job.skills.join(', ')}.</li>
                <li>Habilidad para trabajar en equipo y resolver problemas complejos.</li>
                <li>Disponibilidad {job.contractType.toLowerCase()}.</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="w-full lg:w-[300px] space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Resumen de la oferta</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Salario ofrecido</div>
                <div className="font-medium">{job.salaryRange}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Modalidad</div>
                <div className="font-medium">{job.modality === offerModalities.remote ? 'Trabajo Remoto' : 'Presencial / Híbrido'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Nivel de experiencia</div>
                <div className="font-medium">Junior / Semi-Senior</div>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Para postularte o ver más detalles necesitas una cuenta.
              </p>
              <Link
                href={ROUTES.AUTH.LOGIN}
                className={buttonVariants({ className: 'w-full' })}
              >
                Inicia sesión para postular
              </Link>
              <Link
                href={ROUTES.AUTH.REGISTER}
                className={buttonVariants({ variant: 'outline', className: 'w-full' })}
              >
                Crear cuenta nueva
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
