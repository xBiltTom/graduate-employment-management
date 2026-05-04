import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, GraduationCap } from 'lucide-react';

export function RegisterPage() {
  return (
    <div className="flex flex-col space-y-6 w-full max-w-2xl mx-auto">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Crea tu cuenta</h1>
        <p className="text-muted-foreground">
          Selecciona el tipo de cuenta que deseas crear en EgresadosPro
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="flex flex-col border-2 hover:border-primary transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>Soy Egresado</CardTitle>
            <CardDescription>
              Busco oportunidades laborales, quiero potenciar mi perfil y conectar con empresas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end mt-4">
            <Link
              href={ROUTES.AUTH.REGISTER_GRADUATE}
              className={buttonVariants({ size: 'lg', className: 'w-full' })}
            >
              Continuar como Egresado
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col border-2 hover:border-primary transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <CardTitle>Soy Empresa</CardTitle>
            <CardDescription>
              Represento a una organización que busca publicar ofertas y encontrar talento joven.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end mt-4">
            <Link
              href={ROUTES.AUTH.REGISTER_COMPANY}
              className={buttonVariants({ variant: 'outline', size: 'lg', className: 'w-full' })}
            >
              Continuar como Empresa
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-8">
        ¿Ya tienes una cuenta?{" "}
        <Link href={ROUTES.AUTH.LOGIN} className="underline hover:text-primary">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}
