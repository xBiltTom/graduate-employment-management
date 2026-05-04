"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export function RegisterGraduatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Funcionalidad pendiente de conexión con backend');
      console.log('Register Graduate attempt mock');
    }, 1000);
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-xl mx-auto py-8">
      <Link href={ROUTES.AUTH.REGISTER} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground w-fit mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a selección de cuenta
      </Link>
      
      <div className="flex flex-col space-y-2 text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-2">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Registro de Egresado</h1>
        <p className="text-sm text-muted-foreground">
          Completa tus datos personales y académicos para comenzar.
        </p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres</Label>
                <Input id="nombres" placeholder="Ej. María Fernanda" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input id="apellidos" placeholder="Ej. López Silva" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dni">DNI</Label>
                <Input id="dni" placeholder="Ej. 12345678" maxLength={8} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="correo@ejemplo.com" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carrera">Carrera Profesional</Label>
                <Input id="carrera" placeholder="Ej. Ingeniería de Software" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anoEgreso">Año de Egreso</Label>
                <Input id="anoEgreso" type="number" min={1950} max={2030} placeholder="Ej. 2023" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" required />
              <p className="text-xs text-muted-foreground">Mínimo 8 caracteres, al menos una mayúscula y un número.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-muted/20 border-t p-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Completar Registro"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Al registrarte, aceptas nuestros{" "}
              <Link href="#" className="underline hover:text-primary">Términos de servicio</Link> y{" "}
              <Link href="#" className="underline hover:text-primary">Políticas de privacidad</Link>.
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
