# Environment Reference

| Variable | Requerida | Default dev | Descripcion | Produccion |
|---|---|---|---|---|
| `NODE_ENV` | No | `development` | Modo de ejecucion de la API. | Debe ser `production` en despliegue real. |
| `PORT` | No | `3001` | Puerto HTTP del backend NestJS. | Ajustar al puerto o binding del entorno. |
| `DATABASE_URL` | Si | N/A | Cadena de conexion PostgreSQL usada por Prisma. | Debe apuntar a instancia productiva con TLS si aplica. |
| `FRONTEND_URL` | No | `http://localhost:3000` | URL base del frontend para referencias locales. | Debe reflejar el dominio real del frontend. |
| `CORS_ORIGIN` | No | `http://localhost:3000` | Lista de origins permitidos para CORS, separada por comas. | No puede incluir `*` porque la API usa credentials. |
| `THROTTLE_TTL` | No | `60` | Ventana en segundos del rate limiting global. | Ajustar segun trafico y proteccion deseada. |
| `THROTTLE_LIMIT` | No | `100` | Numero maximo de requests por ventana global. | Ajustar por capacidad y perfil de uso. |
| `JWT_ACCESS_SECRET` | No en dev, Si en prod | `dev-access-secret-change-me` | Secreto para firmar access tokens. | Obligatorio, largo y no default en produccion. |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Duracion del access token. | Ajustar a politica de sesion deseada. |
| `JWT_REFRESH_SECRET` | No en dev, Si en prod | `dev-refresh-secret-change-me` | Secreto para firmar refresh tokens. | Obligatorio, largo y no default en produccion. |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Duracion del refresh token. | Ajustar segun politica de reautenticacion. |
| `COOKIE_DOMAIN` | No | vacio | Dominio opcional para cookies HTTP-only. | Configurar solo si la API comparte cookies entre subdominios. |
| `FILES_STORAGE_DIR` | No | `storage/files` | Directorio local para CVs y logos. | Idealmente migrar a storage externo privado. |
| `MAX_UPLOAD_SIZE_MB` | No | `10` | Limite global de subida para archivos. | Validado entre `1` y `50`; revisar segun politicas reales. |
| `REPORTS_STORAGE_DIR` | No | `storage/reports` | Directorio local para PDFs de reportes. | Idealmente mover a bucket o storage privado. |
| `REPORTS_BASE_URL` | No | `http://localhost:3001/api/v1/reportes` | Base URL usada para construir `downloadUrl` de reportes. | Debe reflejar URL publica real detras de proxy o gateway. |
| `SMTP_HOST` | No | N/A | Host SMTP para habilitar correo transaccional. | Requerido cuando se implemente el adaptador real de email. |
| `SMTP_PORT` | No | N/A | Puerto SMTP opcional reservado para futura integracion. | Configurarlo junto con TLS y proveedor real. |
| `SMTP_USER` | No | N/A | Usuario SMTP opcional reservado para futura integracion. | Guardarlo como secreto del entorno. |
| `SMTP_PASSWORD` | No | N/A | Password SMTP opcional reservado para futura integracion. | Guardarlo como secreto, nunca en repo. |
| `SMTP_FROM` | No | N/A | Remitente por defecto para futuros correos transaccionales. | Definir dominio autenticado del proveedor SMTP. |

## Notas

- `env.validation.ts` valida secretos JWT fuertes en produccion.
- `CORS_ORIGIN` debe contener URLs validas y nunca `*`.
- Los directorios locales de storage tienen defaults seguros para desarrollo.
- El backend no incluye secretos hardcodeados de produccion.
