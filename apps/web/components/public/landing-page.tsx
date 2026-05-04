import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight, Briefcase, Building, GraduationCap, Search } from 'lucide-react';
import { featuredJobs, publicStats } from '@/lib/mock-data';
import { offerModalities } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Impulsa tu <span className="text-primary">carrera profesional</span> al siguiente nivel
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Conectamos a los mejores egresados con empresas líderes. Encuentra ofertas exclusivas, gestiona tus postulaciones y construye tu futuro.
              </p>
            </div>
            
            <div className="w-full max-w-2xl space-y-4">
              <div className="flex w-full items-center space-x-2">
                <Input 
                  className="flex-1 bg-background h-12 text-lg" 
                  placeholder="Cargo, habilidad o empresa..." 
                  type="text" 
                />
                <Link
                  href={ROUTES.PUBLIC.OFERTAS}
                  className={buttonVariants({ className: 'h-12 px-8' })}
                >
                  <Search className="mr-2 h-4 w-4" /> Buscar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {publicStats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-4xl font-bold">{stat.value}</h3>
                <p className="text-primary-foreground/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Offers */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ofertas Destacadas</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Descubre las oportunidades más recientes publicadas por empresas top.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    {job.modality === offerModalities.remote && <Badge variant="secondary">Remoto</Badge>}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Building className="mr-1 h-4 w-4" />
                    {job.company}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      {job.contractType}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.skills.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href={ROUTES.PUBLIC.OFERTA_DETAIL(job.id)}
                    className={buttonVariants({ className: 'w-full' })}
                  >
                    Ver Detalles
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Link
              href={ROUTES.PUBLIC.OFERTAS}
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Ver todas las ofertas <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Para Egresados
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Tu primer gran paso profesional</h2>
              <p className="text-muted-foreground md:text-lg">
                Crea tu perfil profesional, sube tu CV, y postula a ofertas exclusivas. Haz seguimiento a tus candidaturas en un solo lugar.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center"><ArrowRight className="mr-2 h-4 w-4 text-primary" /> Perfil destacado ante reclutadores</li>
                <li className="flex items-center"><ArrowRight className="mr-2 h-4 w-4 text-primary" /> Alertas de empleo personalizadas</li>
                <li className="flex items-center"><ArrowRight className="mr-2 h-4 w-4 text-primary" /> Recursos para entrevistas</li>
              </ul>
              <Link
                href={ROUTES.AUTH.REGISTER_GRADUATE}
                className={buttonVariants()}
              >
                Soy Egresado
              </Link>
            </div>
            <div className="bg-background rounded-xl p-8 border shadow-sm">
              <GraduationCap className="h-16 w-16 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">¿Representas a una empresa?</h3>
              <p className="text-muted-foreground mb-6">
                Encuentra el talento joven mejor preparado. Publica tus ofertas y gestiona todo el proceso de selección desde nuestro panel administrativo.
              </p>
              <Link
                href={ROUTES.AUTH.REGISTER_COMPANY}
                className={buttonVariants({ variant: 'outline', className: 'w-full' })}
              >
                Registrar Empresa
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
