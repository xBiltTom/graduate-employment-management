# Security Hardening Backend

## Autenticacion

- Autenticacion basada en JWT con access token y refresh token.
- `AuthService` valida estado del usuario y consistencia entre payload y registro persistido.
- En produccion, `env.validation.ts` exige secretos JWT de al menos 32 caracteres y bloquea secretos por defecto.

## Cookies

- Las cookies de auth son `httpOnly`.
- `CookieService` activa `secure: true` en produccion.
- `sameSite` queda en `lax` para compatibilidad razonable entre frontend y API.
- `COOKIE_DOMAIN` es opcional y no debe incluir protocolo.

## JWT

- Se separan `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET`.
- La expiracion se controla por `JWT_ACCESS_EXPIRES_IN` y `JWT_REFRESH_EXPIRES_IN`.
- El refresh token se valida contra `TokenStoreService`.
- Pendiente de produccion: mover el refresh token store en memoria a Redis u otro storage compartido.

## RBAC

- RBAC centralizado con `RolesGuard`, decoradores y helpers `requireRole` / `requireUser`.
- Los routers tRPC y endpoints REST sensibles validan rol antes de delegar al servicio.
- Las consultas administrativas de auditoria, empresas, ofertas, postulaciones y dashboards quedan restringidas a `ADMINISTRADOR`.

## CORS

- `main.ts` habilita CORS con `credentials: true`.
- `CORS_ORIGIN` admite lista separada por comas.
- `env.validation.ts` rechaza `*` en `CORS_ORIGIN` para evitar configuraciones inseguras con credenciales.

## Rate Limiting

- `ThrottlerGuard` esta registrado globalmente.
- `THROTTLE_TTL` y `THROTTLE_LIMIT` quedan parametrizados por entorno.
- Pendiente de produccion: revisar limites especificos por ruta critica y por actor.

## Validacion de inputs

- Validacion global con `ValidationPipe` usando `whitelist`, `forbidNonWhitelisted` y `transform`.
- Los routers tRPC usan `zod` para contratos de entrada.
- Los servicios mantienen validaciones de negocio adicionales para estados, ownership y transiciones.

## Archivos

- El modulo `Archivos` valida MIME, extension y tamano antes de persistir.
- `LocalFileStorageService` genera keys seguras y bloquea path traversal.
- No se expone el path fisico del archivo; solo `downloadUrl`.
- Pendiente de produccion: migrar storage local a proveedor privado con URLs firmadas y escaneo antivirus.

## Reportes

- La descarga de reportes exige autenticacion y ownership o bypass administrativo.
- Solo se permite descargar reportes en estado `COMPLETADO`.
- El job de reportes no expone rutas internas del filesystem.
- Pendiente de produccion: mover ejecucion en proceso a cola real y worker separado.

## Datos sensibles

- Los selects de usuario excluyen `passwordHash` y `proveedorId`.
- `AuditoriaService` redacciona claves sensibles como `password`, `token`, `secret`, `cookies` y `proveedorId`.
- El `dni` queda enmascarado al registrarse en auditoria.
- `NotificacionesService` y `ReportesService` ya sanean metadata y parametros antes de persistir.

## Auditoria

- `AuditoriaModule` registra acciones criticas de empresas, ofertas, postulaciones, archivos y reportes.
- `registrarSeguro` evita romper la operacion principal si falla la escritura de auditoria.
- Las lecturas sensibles, como descarga de reporte, registran solo metadata minima del actor y entidad.

## Pendientes para produccion

- Reemplazar refresh token store en memoria por Redis.
- Implementar SMTP real y plantillas transaccionales.
- Migrar storage local a S3/R2/Supabase Storage.
- Agregar logs estructurados, error tracking y metricas.
- Endurecer politicas de retencion para auditoria y archivos.
