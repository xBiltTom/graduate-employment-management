"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/errors";
import { graduateService, publicService } from "@/services";
import type { CatalogOption, GraduateProfile, SkillCatalogOption } from "@/types";

import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Plus, FileText, CheckCircle2, Edit2, Download } from "lucide-react";

type GraduateProfilePageProps = {
  initialProfile: GraduateProfile;
};

const emptyEducationForm = {
  institucion: "",
  grado: "",
  campo: "",
  fechaInicio: "",
  fechaFin: "",
  esActual: false,
  descripcion: "",
};

const emptyExperienceForm = {
  empresa: "",
  cargo: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  esActual: false,
};

function formatLocation(ciudad?: string, region?: string) {
  return [ciudad, region].filter(Boolean).join(", ");
}

function parseLocation(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return {
      ciudad: "",
      region: "",
    };
  }

  const [cityPart, ...regionParts] = normalized.split(",");

  return {
    ciudad: cityPart?.trim() ?? "",
    region: regionParts.join(",").trim(),
  };
}

export function GraduateProfilePage({
  initialProfile,
}: GraduateProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [profile, setProfile] = useState(initialProfile);
  const [locationInput, setLocationInput] = useState(
    formatLocation(initialProfile.ciudad, initialProfile.region),
  );
  const [careers, setCareers] = useState<CatalogOption[]>([]);
  const [skillsCatalog, setSkillsCatalog] = useState<SkillCatalogOption[]>([]);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [educationForm, setEducationForm] = useState(emptyEducationForm);
  const [experienceForm, setExperienceForm] = useState(emptyExperienceForm);

  useEffect(() => {
    let isMounted = true;

    void Promise.all([publicService.getCareers(), publicService.getSkills()])
      .then(([careerOptions, skillOptions]) => {
        if (!isMounted) {
          return;
        }

        setCareers(careerOptions);
        setSkillsCatalog(skillOptions);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setCareers([]);
        setSkillsCatalog([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const parsedLocation = parseLocation(locationInput);

      const updatedProfile = await graduateService.updateProfile({
        nombres: profile.nombres,
        apellidos: profile.apellidos,
        presentacion: profile.presentacion,
        telefono: profile.telefono,
        ciudad: parsedLocation.ciudad,
        region: parsedLocation.region,
        carreraId: profile.carreraId,
        anioEgreso: profile.anioEgreso,
        skills: profile.skills,
      });

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setLocationInput(formatLocation(updatedProfile.ciudad, updatedProfile.region));
      setIsEditing(false);
      toast.success("Perfil actualizado", {
        description: "Los cambios fueron guardados correctamente.",
        icon: <CheckCircle2 className="h-5 w-5 text-white" />,
        className: "bg-[var(--color-success)] text-white border-none",
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = () => {
    setLocationInput(formatLocation(profile.ciudad, profile.region));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setLocationInput(formatLocation(savedProfile.ciudad, savedProfile.region));
    setIsEditing(false);
    setShowEducationForm(false);
    setShowExperienceForm(false);
    setEducationForm(emptyEducationForm);
    setExperienceForm(emptyExperienceForm);
  };

  const toggleSkill = (skillId: string) => {
    const existingSkill = profile.skills.find((skill) => skill.id === skillId);

    if (existingSkill) {
      setProfile({
        ...profile,
        skills: profile.skills.filter((skill) => skill.id !== skillId),
      });
      return;
    }

    const selectedSkill = skillsCatalog.find((skill) => skill.id === skillId);
    if (!selectedSkill) {
      return;
    }

    setProfile({
      ...profile,
      skills: [...profile.skills, { id: selectedSkill.id, name: selectedSkill.name }],
    });
  };

  const handleAddEducation = async () => {
    if (!educationForm.institucion.trim()) {
      toast.error("Ingresa la institución.");
      return;
    }

    try {
      setIsAddingEducation(true);
      const updatedProfile = await graduateService.addEducation({
        institucion: educationForm.institucion,
        ...(educationForm.grado ? { grado: educationForm.grado } : {}),
        ...(educationForm.campo ? { campo: educationForm.campo } : {}),
        ...(educationForm.fechaInicio ? { fechaInicio: educationForm.fechaInicio } : {}),
        ...(educationForm.fechaFin && !educationForm.esActual
          ? { fechaFin: educationForm.fechaFin }
          : {}),
        esActual: educationForm.esActual,
        ...(educationForm.descripcion ? { descripcion: educationForm.descripcion } : {}),
      });

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setEducationForm(emptyEducationForm);
      setShowEducationForm(false);
      toast.success("Formación agregada correctamente.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsAddingEducation(false);
    }
  };

  const handleAddExperience = async () => {
    if (!experienceForm.empresa.trim() || !experienceForm.cargo.trim()) {
      toast.error("Ingresa la empresa y el cargo.");
      return;
    }

    try {
      setIsAddingExperience(true);
      const updatedProfile = await graduateService.addExperience({
        empresa: experienceForm.empresa,
        cargo: experienceForm.cargo,
        ...(experienceForm.descripcion ? { descripcion: experienceForm.descripcion } : {}),
        ...(experienceForm.fechaInicio ? { fechaInicio: experienceForm.fechaInicio } : {}),
        ...(experienceForm.fechaFin && !experienceForm.esActual
          ? { fechaFin: experienceForm.fechaFin }
          : {}),
        esActual: experienceForm.esActual,
      });

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setExperienceForm(emptyExperienceForm);
      setShowExperienceForm(false);
      toast.success("Experiencia agregada correctamente.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsAddingExperience(false);
    }
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
            <Button onClick={() => void handleSave()} disabled={isSaving} className="flex-1 sm:flex-none bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white shadow-sm">
              {isSaving ? "Guardando..." : "Guardar Cambios"}
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
                      <div className="col-span-2 grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
                        <Select
                          value={profile.carreraId ?? ""}
                          onValueChange={(value) => {
                            const selectedCareer = careers.find((career) => career.id === value);
                            setProfile({
                              ...profile,
                              carreraId: value || undefined,
                              carrera: selectedCareer?.name ?? profile.carrera,
                            });
                          }}
                        >
                          <SelectTrigger className="w-full text-sm h-9 border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]">
                            <SelectValue placeholder="Selecciona tu carrera" />
                          </SelectTrigger>
                          <SelectContent>
                            {careers.map((career) => (
                              <SelectItem key={career.id} value={career.id}>
                                {career.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={String(profile.anioEgreso ?? "")}
                          onChange={(e) => setProfile({
                            ...profile,
                            anioEgreso: Number(e.target.value) || new Date().getFullYear(),
                          })}
                          className="text-sm h-9 border-[var(--color-border-subtle)] focus-visible:ring-[var(--color-brand)]"
                          placeholder="Año"
                          inputMode="numeric"
                        />
                      </div>
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
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowEducationForm((current) => !current)} className="h-8 w-8 text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] hover:bg-[var(--color-brand-light)]">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                {isEditing && showEducationForm ? (
                  <div className="space-y-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50 p-4">
                    <Input value={educationForm.institucion} onChange={(e) => setEducationForm({ ...educationForm, institucion: e.target.value })} className="h-9 border-[var(--color-border-subtle)]" placeholder="Institución" />
                    <Input value={educationForm.grado} onChange={(e) => setEducationForm({ ...educationForm, grado: e.target.value })} className="h-9 border-[var(--color-border-subtle)]" placeholder="Grado / Título" />
                    <Input value={educationForm.campo} onChange={(e) => setEducationForm({ ...educationForm, campo: e.target.value })} className="h-9 border-[var(--color-border-subtle)]" placeholder="Campo de estudio" />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input value={educationForm.fechaInicio} onChange={(e) => setEducationForm({ ...educationForm, fechaInicio: e.target.value })} type="date" className="h-9 border-[var(--color-border-subtle)]" />
                      <Input value={educationForm.fechaFin} onChange={(e) => setEducationForm({ ...educationForm, fechaFin: e.target.value })} type="date" disabled={educationForm.esActual} className="h-9 border-[var(--color-border-subtle)] disabled:opacity-60" />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[var(--color-text-body)]">
                      <input type="checkbox" checked={educationForm.esActual} onChange={(e) => setEducationForm({ ...educationForm, esActual: e.target.checked, fechaFin: e.target.checked ? "" : educationForm.fechaFin })} />
                      Actualmente curso o estudio aquí
                    </label>
                    <Textarea value={educationForm.descripcion} onChange={(e) => setEducationForm({ ...educationForm, descripcion: e.target.value })} className="min-h-[90px] border-[var(--color-border-subtle)]" placeholder="Descripción opcional" />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => { setShowEducationForm(false); setEducationForm(emptyEducationForm); }} className="border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        Cancelar
                      </Button>
                      <Button type="button" onClick={() => void handleAddEducation()} disabled={isAddingEducation} className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white">
                        {isAddingEducation ? "Agregando..." : "Agregar formación"}
                      </Button>
                    </div>
                  </div>
                ) : null}
                {(profile.education ?? []).map((edu, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-[var(--color-brand)] mt-1.5 shadow-[0_0_0_4px_var(--color-brand-light)]"></div>
                      {idx !== (profile.education ?? []).length - 1 && <div className="w-0.5 h-full bg-[var(--color-border-subtle)] my-2"></div>}
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
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowExperienceForm((current) => !current)} className="h-8 w-8 text-[var(--color-teal)] hover:text-[var(--color-teal)]/90 hover:bg-[var(--color-teal)]/10">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                {isEditing && showExperienceForm ? (
                  <div className="space-y-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/50 p-4">
                    <Input value={experienceForm.cargo} onChange={(e) => setExperienceForm({ ...experienceForm, cargo: e.target.value })} className="h-9 border-[var(--color-border-subtle)]" placeholder="Cargo / Rol" />
                    <Input value={experienceForm.empresa} onChange={(e) => setExperienceForm({ ...experienceForm, empresa: e.target.value })} className="h-9 border-[var(--color-border-subtle)]" placeholder="Empresa" />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input value={experienceForm.fechaInicio} onChange={(e) => setExperienceForm({ ...experienceForm, fechaInicio: e.target.value })} type="date" className="h-9 border-[var(--color-border-subtle)]" />
                      <Input value={experienceForm.fechaFin} onChange={(e) => setExperienceForm({ ...experienceForm, fechaFin: e.target.value })} type="date" disabled={experienceForm.esActual} className="h-9 border-[var(--color-border-subtle)] disabled:opacity-60" />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-[var(--color-text-body)]">
                      <input type="checkbox" checked={experienceForm.esActual} onChange={(e) => setExperienceForm({ ...experienceForm, esActual: e.target.checked, fechaFin: e.target.checked ? "" : experienceForm.fechaFin })} />
                      Actualmente trabajo aquí
                    </label>
                    <Textarea value={experienceForm.descripcion} onChange={(e) => setExperienceForm({ ...experienceForm, descripcion: e.target.value })} className="min-h-[90px] border-[var(--color-border-subtle)]" placeholder="Descripción de responsabilidades" />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => { setShowExperienceForm(false); setExperienceForm(emptyExperienceForm); }} className="border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        Cancelar
                      </Button>
                      <Button type="button" onClick={() => void handleAddExperience()} disabled={isAddingExperience} className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 text-white">
                        {isAddingExperience ? "Agregando..." : "Agregar experiencia"}
                      </Button>
                    </div>
                  </div>
                ) : null}
                {(profile.experience ?? []).map((exp, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-[var(--color-teal)] mt-1.5 shadow-[0_0_0_4px_rgba(20,184,166,0.15)]"></div>
                      {idx !== (profile.experience ?? []).length - 1 && <div className="w-0.5 h-full bg-[var(--color-border-subtle)] my-2"></div>}
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
                    <Input value={profile.email} readOnly className="h-8 text-sm border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)]" placeholder="Email" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                    <Input value={profile.telefono ?? ""} onChange={(e) => setProfile({...profile, telefono: e.target.value})} className="h-8 text-sm border-[var(--color-border-subtle)]" placeholder="Teléfono" />
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                    <Input value={locationInput} onChange={(e) => setLocationInput(e.target.value)} className="h-8 text-sm border-[var(--color-border-subtle)]" placeholder="Ciudad, Región" />
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
                    <span className="text-[var(--color-text-body)]">{formatLocation(profile.ciudad, profile.region) || "Ubicación no especificada"}</span>
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
                    {profile.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="bg-[var(--color-surface)] text-[var(--color-text-body)] border border-[var(--color-border-subtle)] font-medium pr-1.5">
                        {skill.name}
                        <button type="button" onClick={() => toggleSkill(skill.id)} className="ml-1 text-[var(--color-text-muted)] hover:text-[var(--color-error)] cursor-pointer">×</button>
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-[var(--color-text-muted)]">Selecciona habilidades del catálogo</Label>
                    <div className="flex flex-wrap gap-2">
                      {skillsCatalog.map((skill) => {
                        const isSelected = profile.skills.some((item) => item.id === skill.id);

                        return (
                          <button
                            key={skill.id}
                            type="button"
                            onClick={() => toggleSkill(skill.id)}
                            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                              isSelected
                                ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                                : "border-[var(--color-border-subtle)] bg-white text-[var(--color-text-body)]"
                            }`}
                          >
                            {skill.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="bg-[var(--color-brand-light)] text-[var(--color-brand)] border-0 font-medium">
                      {skill.name}
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
