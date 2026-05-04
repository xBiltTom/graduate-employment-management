"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Building2, ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export function RegisterCompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Empresa registrada. Pendiente de validación por administrador.');
      console.log('Register Company attempt mock');
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
          <Building2 className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Registro de Empresa</h1>
        <p className="text-sm text-muted-foreground">
          Registra tu organización para empezar a publicar ofertas. Tu cuenta pasará por un proceso de validación.
        </p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input id="ruc" placeholder="Ej. 20123456789" maxLength={11} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Sector Empresarial</Label>
                <Input id="sector" placeholder="Ej. Tecnología, Finanzas" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="razonSocial">Razón Social</Label>
              <Input id="razonSocial" placeholder="Ej. Empresa Tecnológica S.A.C." required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombreComercial">Nombre Comercial (Opcional)</Label>
              <Input id="nombreComercial" placeholder="Ej. EmpresaTech" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo corporativo</Label>
                <Input id="email" type="email" placeholder="contacto@empresa.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono de contacto</Label>
                <Input id="telefono" type="tel" placeholder="Ej. 987654321" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sitioWeb">Sitio Web (Opcional)</Label>
              <Input id="sitioWeb" type="url" placeholder="https://www.empresa.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción breve</Label>
              <Textarea id="descripcion" placeholder="¿A qué se dedica la empresa?" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-muted/20 border-t p-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Enviar Solicitud de Registro"}
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
