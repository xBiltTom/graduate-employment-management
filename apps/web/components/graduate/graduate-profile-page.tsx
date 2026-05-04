"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mockGraduateProfile } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Plus, FileText, CheckCircle2, Edit2, Download } from "lucide-react";

export function GraduateProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockGraduateProfile);

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Perfil actualizado", {
      description: "Los cambios se guardarán en el backend en una fase posterior.",
      icon: <CheckCircle2 className="h-5 w-5 text-white" />,
      className: "bg-[var(--color-success)] text-white border-none",
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile(mockGraduateProfile); // Reset
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-[1000px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <h1 className="font-[var(--font-heading)] text-3xl font-bold text-[var(--color-text-heading)]">
            Mi Perfil Profesional
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Gestiona tu información pública para conectar con empresas.
          </p>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1 sm:flex-none bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm">
              Guardar Cambios
            </Button>
          </div>
        ) : (
          <Button onClick={handleEditClick} className="w-full sm:w-auto bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm">
            <Edit2 className="h-4 w-4 mr-2" /> Editar Perfil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Header Card / Basic Info */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm overflow-hidden">
            <div className="h-24 sm:h-32 bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-teal)] w-full"></div>
            <CardContent className="px-6 sm:px-8 pb-8 pt-0 relative">
              <div className="flex flex-col sm:flex-row gap-6 sm:items-end">
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-white p-1.5 shadow-md -mt-12 sm:-mt-16 relative shrink-0">
                  <div className="h-full w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-muted)]">
                    <User className="h-12 w-12 sm:h-16 sm:w-16 opacity-20" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-[var(--color-brand)] text-white shadow-md flex items-center justify-center hover:bg-[var(--color-brand-hover)] transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex-1 space-y-3 pb-2">
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Input value={profile.nombres} onChange={(e) => setProfile({...profile, nombres: e.target.value})} className="font-[var(--font-heading)] font-bold text-lg h-10 border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]" placeholder="Nombres" />
                      <Input value={profile.apellidos} onChange={(e) => setProfile({...profile, apellidos: e.target.value})} className="font-[var(--font-heading)] font-bold text-lg h-10 border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]" placeholder="Apellidos" />
                      <Input value={profile.carrera} onChange={(e) => setProfile({...profile, carrera: e.target.value})} className="col-span-2 text-sm h-9 border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]" placeholder="Carrera / Título" />
                    </div>
                  ) : (
                    <>
                      <h2 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--color-text-heading)] leading-none">
                        {profile.nombres} {profile.apellidos}
                      </h2>
                      <p className="text-lg text-[var(--color-brand)] font-medium">
                        {profile.carrera}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Presentación */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader className="pb-3 border-b border-[var(--color-border-subtle)] px-6 sm:px-8 pt-6 sm:pt-8">
              <CardTitle className="text-lg font-[var(--font-heading)] text-[var(--color-text-heading)]">Sobre mí</CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              {isEditing ? (
                <Textarea 
                  value={profile.presentacion} 
                  onChange={(e) => setProfile({...profile, presentacion: e.target.value})}
                  className="min-h-[120px] text-[var(--color-text-body)] border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                  placeholder="Escribe un breve resumen profesional..."
                />
              ) : (
                <p className="text-[var(--color-text-body)] leading-relaxed">
                  {profile.presentacion}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Formación Académica */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader className="pb-3 border-b border-[var(--color-border-subtle)] px-6 sm:px-8 pt-6 sm:pt-8 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-[var(--font-heading)] text-[var(--color-text-heading)] flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[var(--color-brand)]" />
                Formación Académica
              </CardTitle>
              {isEditing && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] hover:bg-[var(--color-brand-light)]">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-[var(--color-brand)] mt-1.5 shadow-[0_0_0_4px_var(--color-brand-light)]"></div>
                      {idx !== profile.education.length - 1 && <div className="w-0.5 h-full bg-[var(--color-border-subtle)] my-2"></div>}
                    </div>
                    <div className="pb-2 flex-1">
                      {isEditing ? (
                        <div className="space-y-2 mb-4 p-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50">
                          <Input defaultValue={edu.degree} className="h-8 font-medium border-[var(--color-border-subtle)]" placeholder="Grado / Título" />
                          <Input defaultValue={edu.institution} className="h-8 text-sm border-[var(--color-border-subtle)]" placeholder="Institución" />
                          <Input defaultValue={edu.period} className="h-8 text-xs border-[var(--color-border-subtle)]" placeholder="Periodo (ej: 2019 - 2023)" />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-semibold text-[var(--color-text-heading)]">{edu.degree}</h4>
                          <p className="text-sm text-[var(--color-text-body)] mt-1">{edu.institution}</p>
                          <p className="text-xs text-[var(--color-text-muted)] font-medium mt-1 uppercase tracking-wider">{edu.period}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experiencia Laboral */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader className="pb-3 border-b border-[var(--color-border-subtle)] px-6 sm:px-8 pt-6 sm:pt-8 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-[var(--font-heading)] text-[var(--color-text-heading)] flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[var(--color-teal)]" />
                Experiencia Laboral
              </CardTitle>
              {isEditing && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--color-teal)] hover:text-[var(--color-teal)]/90 hover:bg-[var(--color-teal)]/10">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-[var(--color-teal)] mt-1.5 shadow-[0_0_0_4px_rgba(20,184,166,0.15)]"></div>
                      {idx !== profile.experience.length - 1 && <div className="w-0.5 h-full bg-[var(--color-border-subtle)] my-2"></div>}
                    </div>
                    <div className="pb-2 flex-1">
                      {isEditing ? (
                        <div className="space-y-2 mb-4 p-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50">
                          <Input defaultValue={exp.role} className="h-8 font-medium border-[var(--color-border-subtle)]" placeholder="Cargo / Rol" />
                          <Input defaultValue={exp.company} className="h-8 text-sm border-[var(--color-border-subtle)]" placeholder="Empresa" />
                          <Input defaultValue={exp.period} className="h-8 text-xs border-[var(--color-border-subtle)]" placeholder="Periodo" />
                          <Textarea defaultValue={exp.description} className="text-sm mt-2 min-h-[80px] border-[var(--color-border-subtle)]" placeholder="Descripción de responsabilidades" />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-semibold text-[var(--color-text-heading)]">{exp.role}</h4>
                          <p className="text-sm text-[var(--color-text-body)] mt-1">{exp.company}</p>
                          <p className="text-xs text-[var(--color-text-muted)] font-medium mt-1 uppercase tracking-wider">{exp.period}</p>
                          <p className="text-sm text-[var(--color-text-muted)] mt-3 leading-relaxed">{exp.description}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          
          {/* Profile Completion Indicator */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm bg-gradient-to-b from-[var(--color-surface)] to-white">
            <CardContent className="p-6 text-center space-y-4">
              <div className="relative h-24 w-24 mx-auto flex items-center justify-center">
                <svg className="absolute inset-0 h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-border-subtle)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="var(--color-brand)" strokeWidth="8" 
                    strokeDasharray={`${(profile.profileCompletion / 100) * 283} 283`}
                    className="transition-all duration-1000 ease-in-out"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-2xl font-bold text-[var(--color-brand)]">{profile.profileCompletion}%</span>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text-heading)]">Perfil Incompleto</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Completa tu CV en PDF para llegar al 100%.</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader className="pb-3 border-b border-[var(--color-border-subtle)]">
              <CardTitle className="text-base font-[var(--font-heading)] text-[var(--color-text-heading)]">Contacto</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                    <Input value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="h-8 text-sm border-[var(--color-border-subtle)]" placeholder="Email" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                    <Input value={profile.telefono} onChange={(e) => setProfile({...profile, telefono: e.target.value})} className="h-8 text-sm border-[var(--color-border-subtle)]" placeholder="Teléfono" />
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                    <Input value={`${profile.ciudad}, ${profile.region}`} onChange={(e) => setProfile({...profile, ciudad: e.target.value.split(',')[0] || profile.ciudad})} className="h-8 text-sm border-[var(--color-border-subtle)]" placeholder="Ciudad, Región" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="h-4 w-4 text-[var(--color-text-muted)] shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text-body)] break-all">{profile.email}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="h-4 w-4 text-[var(--color-text-muted)] shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text-body)]">{profile.telefono}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-[var(--color-text-muted)] shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text-body)]">{profile.ciudad}, {profile.region}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <CardHeader className="pb-3 border-b border-[var(--color-border-subtle)] flex flex-row items-center justify-between">
              <CardTitle className="text-base font-[var(--font-heading)] text-[var(--color-text-heading)]">Habilidades</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-[var(--color-surface)] text-[var(--color-text-body)] border border-[var(--color-border-subtle)] font-medium pr-1.5">
                        {skill}
                        <span className="ml-1 text-[var(--color-text-muted)] hover:text-[var(--color-error)] cursor-pointer">×</span>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input className="h-8 text-sm border-[var(--color-border-subtle)]" placeholder="Nueva habilidad..." />
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-[var(--color-border-subtle)] text-[var(--color-text-heading)]">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-[var(--color-brand-light)] text-[var(--color-brand)] border-0 font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* CV Document */}
          <Card className="border-[var(--color-border-subtle)] shadow-sm bg-[var(--color-surface)]">
            <CardContent className="p-5 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-[var(--color-border-subtle)]">
                <FileText className="h-5 w-5 text-[var(--color-text-muted)]" />
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text-heading)] text-sm">Curriculum Vitae</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Aún no has subido tu CV</p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2 border-[var(--color-border-subtle)] bg-white text-[var(--color-brand)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]">
                <Download className="h-4 w-4 mr-2" /> Subir archivo PDF
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
