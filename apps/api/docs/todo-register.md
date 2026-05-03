# TODO Register

| Archivo | TODO | Prioridad | Recomendacion |
|---|---|---|---|
| `apps/api/src/ofertas/ofertas.service.ts` | Notificar a administradores sobre oferta pendiente de revision. | Media | Crear una notificacion interna o cola administrativa al publicar o editar ofertas. |
| `apps/api/src/ofertas/ofertas.service.ts` | Notificar cierre de oferta si corresponde. | Baja | Definir si el cierre debe disparar notificaciones a postulantes o dashboards. |
| `apps/api/src/ofertas/ofertas.service.ts` | Auditar eliminacion de oferta laboral. | Media | Registrar eliminacion cuando el negocio decida mantener esa operacion habilitada. |
| `apps/api/src/egresados/egresados.service.ts` | Auditar cambios de perfil del egresado. | Alta | Integrar `AuditoriaService` cuidando no persistir `dni` completo ni datos sensibles innecesarios. |
| `apps/api/src/egresados/egresados.service.ts` | Auditar sincronizacion de habilidades del egresado. | Media | Registrar diff minimo de habilidades agregadas y removidas. |
| `apps/api/src/egresados/egresados.service.ts` | Auditar visualizacion de perfil de egresado por empresa. | Alta | Registrar lecturas sensibles con actor, entidad y timestamp. |
| `apps/api/src/egresados/egresados.service.ts` | Auditar busquedas de egresados realizadas por empresa. | Alta | Registrar filtros usados y actor sin guardar resultados completos. |
| `apps/api/src/empresas/empresas.service.ts` | Auditar visualizacion de empresa por administrador. | Baja | Registrar solo actor, entidad y entidadId al tratarse de lectura administrativa. |
| `apps/api/src/empresas/empresas.service.ts` | Auditar consulta de listado administrativo de empresas. | Baja | Registrar consulta agregada si el negocio necesita trazabilidad de accesos. |
| `apps/api/src/ofertas/ofertas.service.ts` | Auditar visualizacion administrativa de ofertas. | Baja | Registrar consulta administrativa en caso de exigencia operativa o compliance. |
| `apps/api/src/postulaciones/postulaciones.service.ts` | Auditar consulta de postulantes por empresa. | Alta | Registrar accesos a postulantes porque involucra datos personales y perfil profesional. |
| `apps/api/src/postulaciones/postulaciones.service.ts` | Auditar consulta administrativa de postulaciones. | Media | Registrar filtros y actor sin guardar snapshots masivos. |
| `apps/api/src/notificaciones/services/mail.service.ts` | Implementar adaptador SMTP real. | Alta | Mover de stub best-effort a proveedor real con credenciales y plantillas. |
| `apps/api/src/reportes/services/reports-job.service.ts` | Mantener jobs en proceso. | Alta | Migrar a BullMQ/Redis y worker separado para produccion. |
| `apps/api/src/auth/services/in-memory-token-store.service.ts` | Token store en memoria. | Alta | Migrar refresh tokens a Redis u otro storage compartido y con expiracion centralizada. |
| `apps/api/src/archivos/services/local-file-storage.service.ts` | Storage local para archivos. | Alta | Migrar a storage privado con URLs firmadas y scanning si el alcance crece. |
