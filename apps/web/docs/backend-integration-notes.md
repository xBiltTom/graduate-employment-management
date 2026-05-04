# Backend integration notes

## API style detected
- Ambos
- tRPC como contrato principal para negocio autenticado
- REST para auth, descargas y uploads tradicionales

## Base URL
- Local: `http://localhost:3001`
- Production placeholder: `Pendiente de confirmar`

## Prefixes observed
- REST global prefix: `/api/v1`
- tRPC endpoint: `/trpc`

## Auth strategy observed
- JWT con cookies HTTP-only
- `accessToken` y `refreshToken`
- CORS con `credentials: true`
- REST auth disponible en `/api/v1/auth/*`
- tRPC resuelve usuario desde contexto usando cookies del request

## Available modules
- Auth: REST + `auth.me` por tRPC
- Offers: tRPC (`feed`, `getById`, `misOfertas`, `create`, `update`, `cerrar`, `adminList`, `adminModerar`)
- Applications: tRPC (`postular`, `misPostulaciones`, `postulantesPorOferta`, `cambiarEstado`, `historial`, `adminList`)
- Company: tRPC (`getMiPerfil`, `updateMiPerfil`, `getById`, `listar`, `validar`, `getEstadoValidacion`)
- Admin: tRPC distribuido entre `empresas`, `ofertas`, `estadisticas`, `reportes`, `auditoria`, `habilidades`, `sectores`, `carreras`
- Reports: tRPC para solicitar/listar + REST para descarga (`/api/v1/reportes/:id/download`)
- Notifications: tRPC (`misNotificaciones`, `noLeidasCount`, `marcarLeida`, `marcarTodasLeidas`, `adminCrearSistema`)
- Files: tRPC metadata + REST para upload/download/delete (`/api/v1/archivos/*`)

## DTOs and schemas observed
- REST DTOs en `apps/api/src/auth/dto/`
- Schemas Zod por dominio en `apps/api/src/*/schemas/*.schemas.ts`

## Error style observed
- REST usa `GlobalExceptionFilter` con shape:
  - `statusCode`
  - `message`
  - `error`
  - `timestamp`
  - `path`
- tRPC usa `TRPCError` y validaciones Zod

## Missing or unclear contracts
- Production base URL: Pendiente de confirmar
- Convención final para compartir tipos `AppRouter` con frontend sin acoplar `apps/web` a `apps/api/src`: Pendiente de confirmar
- La importación directa de `apps/api/src/trpc/trpc.router` desde `apps/web` rompe el typecheck por decoradores y contexto Nest; se requiere paquete compartido o export tipado aislado
- Qué módulos del frontend se conectarán primero en siguientes fases: Pendiente de confirmar

## Frontend integration decision
- Usar modo `mock` por defecto
- Preparar cliente tRPC como camino principal para módulos autenticados
- Preparar cliente HTTP base para auth, uploads y descargas
- Mantener adaptadores `mock` y `api` por módulo para reemplazo progresivo
