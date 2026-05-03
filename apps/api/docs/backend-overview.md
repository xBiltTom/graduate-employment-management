# Backend Overview

## Stack

- NestJS
- Prisma
- PostgreSQL
- tRPC
- JWT cookies
- PDFKit
- Storage local

## Arquitectura

- REST para `health`, autenticacion, descargas de reportes y manejo de archivos.
- tRPC para la mayor parte del negocio interno del frontend.
- Prisma como capa de acceso a datos.
- Servicios por dominio con modulos Nest separados.
- Guards globales para JWT, roles y rate limiting.
- Auditoria y notificaciones como capacidades transversales.

## Modulos implementados

- Auth
- Carreras
- Sectores
- Habilidades
- Egresados
- Empresas
- Ofertas
- Postulaciones
- Notificaciones
- Estadisticas
- Reportes
- Archivos
- Auditoria

## Flujo principal

1. Empresa se registra con estado pendiente.
2. Admin valida o rechaza la empresa.
3. Empresa aprobada crea oferta laboral.
4. Admin modera la oferta antes de activarla.
5. Egresado completa perfil y postula.
6. Empresa cambia el estado de la postulacion.
7. Sistema notifica eventos clave.
8. Dashboards y reportes reflejan el estado agregado del sistema.

## Decisiones clave

- Cookies HTTP-only y JWT separados para access y refresh token.
- tRPC como contrato principal del frontend para negocio autenticado.
- REST mantenido para flujos donde el navegador necesita descarga o upload tradicional.
- Storage local abstraido detras de servicios para permitir migracion futura.
- Reportes asincronos base en proceso, preparados para cola real.
- Auditoria con sanitizacion de payloads para evitar fuga de datos sensibles.
