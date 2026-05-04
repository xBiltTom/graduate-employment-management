import Link from "next/link";
import { graduateService } from "@/services";
import { ROUTES } from "@/lib/routes";
import { applicationStatuses } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, ChevronRight, Bell, Clock, Building2, MapPin, CheckCircle2, User } from "lucide-react";
import type { JobSummary } from "@/types";

export function GraduateHomePage({ featuredJobs }: { featuredJobs: JobSummary[] }) {
  const mockGraduateProfile = graduateService.getProfile();
  const mockGraduateApplications = graduateService.getApplications();
  const mockNotifications = graduateService.getNotifications();
  const recentApplications = mockGraduateApplications.slice(0, 3);
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;
  
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header / Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
            Hola, {mockGraduateProfile.nombres} 👋
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Aquí tienes un resumen de tu actividad y nuevas oportunidades.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={ROUTES.EGRESADO.NOTIFICACIONES}>
            <Button variant="outline" size="sm" className="relative border-[var(--color-border-subtle)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]">
              <Bell className="h-4 w-4 mr-2" />
              Notificaciones
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-error)] text-[9px] font-bold text-white">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </Link>
          <Link href={ROUTES.EGRESADO.PERFIL}>
            <Button variant="outline" size="sm" className="border-[var(--color-border-subtle)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]">
              <User className="h-4 w-4 mr-2" />
              Mi Perfil
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Postulaciones Recientes */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-[var(--font-heading)] text-[var(--color-text-heading)]">
                  Postulaciones Recientes
                </CardTitle>
                <CardDescription>Seguimiento de tus aplicaciones activas</CardDescription>
              </div>
              <Link href={ROUTES.EGRESADO.POSTULACIONES}>
                <Button variant="ghost" size="sm" className="text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] hover:bg-[var(--color-brand-light)]/50">
                  Ver todas <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentApplications.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] hover:border-[var(--color-brand)]/30 transition-colors">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-brand-light)] shrink-0">
                        <span className="text-lg font-bold text-[var(--color-brand)]">
                          {app.job?.company.charAt(0) || "E"}
                        </span>
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <Link href={ROUTES.EGRESADO.OFERTA_DETAIL(app.jobId)} className="font-semibold text-[var(--color-text-heading)] hover:text-[var(--color-brand)] truncate transition-colors">
                            {app.job?.title}
                          </Link>
                          {app.status === applicationStatuses.applied && (
                            <Badge variant="secondary" className="w-fit bg-blue-100 text-blue-700 hover:bg-blue-100">Postulado</Badge>
                          )}
                          {app.status === applicationStatuses.reviewing && (
                            <Badge variant="secondary" className="w-fit bg-amber-100 text-amber-700 hover:bg-amber-100">En revisión</Badge>
                          )}
                          {app.status === applicationStatuses.interview && (
                            <Badge variant="secondary" className="w-fit bg-purple-100 text-purple-700 hover:bg-purple-100">Entrevista</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-2 truncate">
                          <Building2 className="h-3.5 w-3.5" />
                          {app.job?.company}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-2">
                          <Clock className="h-3 w-3" />
                          Postulado el {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-12 w-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-3">
                    <Briefcase className="h-6 w-6 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="font-medium text-[var(--color-text-heading)]">No hay postulaciones recientes</p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-sm">
                    Explora las ofertas disponibles y da el siguiente paso en tu carrera profesional.
                  </p>
                  <Link href={ROUTES.EGRESADO.OFERTAS} className="mt-4">
                    <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">
                      Explorar Ofertas
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ofertas Recomendadas */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-[var(--font-heading)] text-[var(--color-text-heading)]">
                  Recomendadas para ti
                </CardTitle>
                <CardDescription>Basado en tus habilidades e intereses</CardDescription>
              </div>
              <Link href={ROUTES.EGRESADO.OFERTAS}>
                <Button variant="ghost" size="sm" className="text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] hover:bg-[var(--color-brand-light)]/50">
                  Ver más <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {featuredJobs.slice(0, 2).map((job) => (
                  <Link key={job.id} href={ROUTES.EGRESADO.OFERTA_DETAIL(job.id)} className="group">
                    <div className="h-full p-5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] group-hover:border-[var(--color-brand)]/50 group-hover:shadow-md transition-all duration-200 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-light)] group-hover:bg-[var(--color-brand)] transition-colors">
                          <span className="text-sm font-bold text-[var(--color-brand)] group-hover:text-white transition-colors">
                            {job.company.charAt(0)}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-[var(--color-success)]/10 text-[var(--color-success)] border-0">
                          {job.match}% match
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-[var(--color-text-heading)] group-hover:text-[var(--color-brand)] transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-1">
                        {job.company}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)] flex flex-wrap gap-1 mt-auto">
                        {job.skills.slice(0, 2).map(skill => (
                          <Badge key={skill} variant="outline" className="text-[10px] font-normal border-[var(--color-border-subtle)]">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills.length > 2 && (
                          <Badge variant="outline" className="text-[10px] font-normal border-[var(--color-border-subtle)]">
                            +{job.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          
          {/* Profile Completion */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm bg-gradient-to-br from-[var(--color-brand-light)]/40 to-transparent">
            <CardContent className="p-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="font-semibold text-[var(--color-text-heading)]">Perfil Profesional</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">Completa tu información para destacar</p>
                </div>
                  <span className="text-2xl font-bold text-[var(--color-brand)]">{mockGraduateProfile.profileCompletion ?? 0}%</span>
                </div>
                <Progress value={mockGraduateProfile.profileCompletion ?? 0} className="h-2 mb-6" />
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-success)] shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-body)]">Datos personales y contacto</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-success)] shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-body)]">Formación académica</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-4 w-4 rounded-full border-2 border-[var(--color-border-subtle)] shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-muted)]">Experiencia laboral</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-4 w-4 rounded-full border-2 border-[var(--color-border-subtle)] shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--color-text-muted)]">CV en PDF (Opcional)</span>
                </div>
              </div>
              
              <Link href={ROUTES.EGRESADO.PERFIL} className="block mt-6">
                <Button className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">
                  Completar Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-[var(--color-border-subtle)] shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)] mb-2">
                  <Briefcase className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-[var(--color-text-heading)]">{mockGraduateApplications.length}</p>
                <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mt-1">Postulaciones</p>
              </CardContent>
            </Card>
            <Card className="border-[var(--color-border-subtle)] shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-[var(--color-text-heading)]">{mockGraduateProfile.skills.length}</p>
                <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mt-1">Habilidades</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
