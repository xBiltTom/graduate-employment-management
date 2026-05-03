# REST API

| Metodo | Ruta | Auth | Descripcion |
|---|---|---|---|
| `GET` | `/api/v1/health` | No | Healthcheck basico del backend. |
| `POST` | `/api/v1/auth/register` | No | Registro publico de egresado o empresa. |
| `POST` | `/api/v1/auth/login` | No | Inicio de sesion y seteo de cookies de auth. |
| `POST` | `/api/v1/auth/refresh` | No | Renueva tokens desde cookie o body. |
| `POST` | `/api/v1/auth/logout` | Si | Cierra sesion y limpia cookies. |
| `GET` | `/api/v1/auth/me` | Si | Devuelve el usuario autenticado actual. |
| `GET` | `/api/v1/reportes/:id/download` | Si | Descarga un reporte completado con control de acceso. |
| `POST` | `/api/v1/archivos/cv` | Si (`EGRESADO`) | Sube o reemplaza el CV del egresado. |
| `POST` | `/api/v1/archivos/logo` | Si (`EMPRESA`) | Sube o reemplaza el logo institucional. |
| `GET` | `/api/v1/archivos/:id/download` | Si | Descarga un archivo propio o autorizado. |
| `DELETE` | `/api/v1/archivos/:id` | Si | Elimina un archivo propio o autorizado. |
