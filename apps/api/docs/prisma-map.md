# Mapa de Equivalencias Prisma

| Concepto de negocio | Modelo real en Prisma | Campo clave | Observaciones |
|---|---|---|---|
| Usuario del sistema | `Usuario` | `email` | Define autenticación, rol (`rol`) y estado (`estado`); se relaciona 1:1 con `Egresado`, `Empresa` o `Administrador`. |
| Perfil de egresado | `Egresado` | `id` | Usa el mismo `id` de `Usuario`; `dni` es único y `carreraId` es opcional. |
| Empresa | `Empresa` | `ruc` | Usa el mismo `id` de `Usuario`; su validación se maneja con `estadoValidacion`, `validadoPorId` y `validadoEn`. |
| Oferta laboral | `OfertaLaboral` | `id` | Pertenece a una `Empresa`; usa `estado`, `modalidad`, `tipoContrato` y rango salarial opcional. |
| Postulación | `Postulacion` | `id` | Relación entre `OfertaLaboral` y `Egresado`; tiene restricción única compuesta en `[ofertaId, egresadoId]`. |
| Historial de estados | `HistorialEstadoPostulacion` | `id` | Guarda transiciones de estado por `postulacionId`; `cambiadoPorId` es opcional. |
| Habilidad | `Habilidad` | `nombre` | Catálogo único con `tipo` y `categoria`; se relaciona con egresados y ofertas vía tablas pivote. |
| Carrera | `Carrera` | `nombre` | Catálogo único; se vincula opcionalmente desde `Egresado`. |
| Sector empresarial | `Sector` | `nombre` | Catálogo único; se vincula opcionalmente desde `Empresa`. |
| Notificación | `Notificacion` | `id` | Pertenece a `Usuario`; maneja `tipo`, `canal`, `leida` y `metadata`. |
| Reporte generado | `Reporte` | `id` | Pertenece a `Usuario`; referencia opcionalmente a `Archivo` mediante `archivoId` único. |

# Auditoría del Schema Prisma

## 1. Modelos encontrados

| Modelo Prisma | Propósito | Relaciones principales |
|---|---|---|
| `Usuario` | Cuenta base del sistema y punto de autenticación/autorización. | 1:1 con `Egresado`, `Empresa`, `Administrador`; 1:N con `Notificacion`, `Reporte`, `Auditoria`, `Empresa` validada, `HistorialEstadoPostulacion`. |
| `Carrera` | Catálogo académico. | 1:N con `Egresado`. |
| `Sector` | Catálogo de sectores empresariales. | 1:N con `Empresa`. |
| `Egresado` | Perfil profesional del egresado. | 1:1 con `Usuario`; N:1 con `Carrera`; 1:N con `FormacionEgresado`, `ExperienciaEgresado`, `Postulacion`; N:M con `Habilidad` vía `HabilidadEgresado`. |
| `FormacionEgresado` | Estudios/formación del egresado. | N:1 con `Egresado`. |
| `ExperienciaEgresado` | Experiencia laboral del egresado. | N:1 con `Egresado`. |
| `Empresa` | Perfil empresarial publicador de ofertas. | 1:1 con `Usuario`; N:1 con `Sector`; N:1 opcional con `Usuario` validador; 1:N con `OfertaLaboral`. |
| `Administrador` | Perfil administrativo del sistema. | 1:1 con `Usuario`. |
| `Habilidad` | Catálogo de habilidades. | N:M con `Egresado` vía `HabilidadEgresado`; N:M con `OfertaLaboral` vía `HabilidadOferta`. |
| `HabilidadEgresado` | Pivot entre egresado y habilidad. | N:1 con `Egresado`; N:1 con `Habilidad`. |
| `OfertaLaboral` | Publicación de oportunidad laboral. | N:1 con `Empresa`; 1:N con `Postulacion`; N:M con `Habilidad` vía `HabilidadOferta`. |
| `HabilidadOferta` | Pivot entre oferta y habilidad. | N:1 con `OfertaLaboral`; N:1 con `Habilidad`. |
| `Postulacion` | Proceso de aplicación a una oferta. | N:1 con `OfertaLaboral`; N:1 con `Egresado`; 1:N con `HistorialEstadoPostulacion`. |
| `HistorialEstadoPostulacion` | Trazabilidad de cambios de estado en postulaciones. | N:1 con `Postulacion`; N:1 opcional con `Usuario`. |
| `Notificacion` | Mensajería interna y/o por correo. | N:1 con `Usuario`. |
| `Reporte` | Ejecución y seguimiento de reportes. | N:1 con `Usuario`; 1:1 opcional con `Archivo`. |
| `Archivo` | Metadatos de archivos del sistema. | 1:1 opcional inversa con `Reporte`; referencia polimórfica por `tipoEntidad` + `entidadId`. |
| `Auditoria` | Registro de acciones sobre entidades. | N:1 opcional con `Usuario`. |
| `MetricaAgregada` | Almacenamiento de métricas agregadas periódicas. | Sin relaciones directas. |

## 2. Enums encontrados

| Enum | Valores | Uso |
|---|---|---|
| `RolUsuario` | `ADMINISTRADOR`, `EGRESADO`, `EMPRESA` | Campo `Usuario.rol`. |
| `EstadoUsuario` | `ACTIVO`, `PENDIENTE`, `SUSPENDIDO` | Campo `Usuario.estado`. |
| `ProveedorAuth` | `CREDENCIALES`, `GOOGLE` | Campo `Usuario.proveedorAuth`. |
| `TipoHabilidad` | `TECNICA`, `BLANDA` | Campo `Habilidad.tipo`. |
| `NivelHabilidad` | `BASICO`, `INTERMEDIO`, `AVANZADO`, `EXPERTO` | Campo `HabilidadEgresado.nivel`. |
| `EstadoValidacionEmpresa` | `PENDIENTE`, `APROBADA`, `RECHAZADA` | Campo `Empresa.estadoValidacion`. |
| `ModalidadOferta` | `REMOTO`, `HIBRIDO`, `PRESENCIAL` | Campo `OfertaLaboral.modalidad`. |
| `TipoContrato` | `TIEMPO_COMPLETO`, `MEDIO_TIEMPO`, `POR_PROYECTO`, `PRACTICAS` | Campo `OfertaLaboral.tipoContrato`. |
| `EstadoOferta` | `BORRADOR`, `PENDIENTE_REVISION`, `APROBADA`, `RECHAZADA`, `ACTIVA`, `CERRADA`, `EXPIRADA` | Campo `OfertaLaboral.estado`. |
| `EstadoPostulacion` | `POSTULADO`, `EN_REVISION`, `ENTREVISTA`, `CONTRATADO`, `RECHAZADO` | Campos `Postulacion.estado`, `HistorialEstadoPostulacion.estadoAnterior`, `estadoNuevo`. |
| `CategoriaArchivo` | `CV`, `LOGO`, `REPORTE`, `DOCUMENTO`, `AVATAR` | Campo `Archivo.categoria`. |
| `TipoEntidadArchivo` | `USUARIO`, `EGRESADO`, `EMPRESA`, `REPORTE`, `SISTEMA` | Campo `Archivo.tipoEntidad`. |
| `TipoReporte` | `EGRESADOS_POR_CARRERA`, `OFERTAS_ACTIVAS`, `POSTULACIONES_POR_OFERTA`, `EMPLEABILIDAD`, `DEMANDA_LABORAL`, `COMPARATIVO_COHORTES` | Campo `Reporte.tipo`. |
| `EstadoReporte` | `PENDIENTE`, `PROCESANDO`, `COMPLETADO`, `FALLIDO` | Campo `Reporte.estado`. |
| `CanalNotificacion` | `INTERNA`, `EMAIL` | Campo `Notificacion.canal`. |
| `TipoNotificacion` | `NUEVA_OFERTA`, `POSTULACION_CREADA`, `ESTADO_POSTULACION_CAMBIADO`, `EMPRESA_VALIDADA`, `REPORTE_GENERADO`, `SISTEMA` | Campo `Notificacion.tipo`. |
| `TipoMetrica` | `KPIS_ADMINISTRADOR`, `EMPLEABILIDAD_POR_CARRERA`, `DEMANDA_HABILIDADES`, `OFERTAS_VS_POSTULACIONES`, `EGRESADOS_POR_CARRERA`, `CONTRATACION_POR_COHORTE`, `POSTULACIONES_POR_ESTADO` | Campo `MetricaAgregada.tipoMetrica`. |

## 3. Campos sensibles

| Modelo | Campo | Riesgo | Recomendación |
|---|---|---|---|
| `Usuario` | `passwordHash` | Credencial sensible; nunca debe exponerse en respuestas API. | Excluirlo de DTOs/respuestas y centralizar hashing/verificación. |
| `Usuario` | `proveedorId` | Identificador externo de OAuth. | No retornarlo salvo necesidad operativa. |
| `Egresado` | `dni` | Dato personal identificable. | Proteger en listados y registrar accesos administrativos. |
| `Egresado` | `fechaNacimiento`, `telefono`, `direccion` | Datos personales sensibles. | Aplicar control de acceso por rol y mínima exposición. |
| `Empresa` | `ruc` | Identificador fiscal sensible. | Validar formato y restringir exposición innecesaria. |
| `Auditoria` | `datosAnteriores`, `datosNuevos`, `ip`, `userAgent` | Puede contener datos sensibles y trazas de usuario. | Definir política de retención y sanitización. |
| `Notificacion` | `metadata` | JSON libre con riesgo de fuga de datos. | Normalizar payloads y validar contenido. |
| `Reporte` | `parametros`, `mensajeError` | Puede revelar filtros internos o fallas del sistema. | Sanitizar errores antes de exponerlos. |
| `Archivo` | `url`, `key` | Ubicación o llave de almacenamiento. | Evitar exposición directa si luego se migra a storage privado. |

## 4. Campos únicos

| Modelo | Campo único | Uso esperado |
|---|---|---|
| `Usuario` | `email` | Inicio de sesión e identidad primaria de cuenta. |
| `Carrera` | `nombre` | Catálogo sin duplicados. |
| `Sector` | `nombre` | Catálogo sin duplicados. |
| `Egresado` | `dni` | Identificación única del egresado. |
| `Empresa` | `ruc` | Identificación tributaria única. |
| `Habilidad` | `nombre` | Catálogo sin duplicados. |
| `Postulacion` | `[ofertaId, egresadoId]` | Evita postulaciones duplicadas a una misma oferta. |
| `Reporte` | `archivoId` | Asegura relación 1:1 opcional con `Archivo`. |
| `MetricaAgregada` | `[fecha, tipoMetrica]` | Evita métricas agregadas duplicadas por corte y tipo. |

## 5. Relaciones principales

| Relación | Tipo | Observación |
|---|---|---|
| `Usuario` - `Egresado` | 1:1 | `Egresado.id` reutiliza el `id` del usuario. |
| `Usuario` - `Empresa` | 1:1 | `Empresa.id` reutiliza el `id` del usuario. |
| `Usuario` - `Administrador` | 1:1 | `Administrador.id` reutiliza el `id` del usuario. |
| `Carrera` - `Egresado` | 1:N | `carreraId` es opcional y usa `onDelete: SetNull`. |
| `Sector` - `Empresa` | 1:N | `sectorId` es opcional y usa `onDelete: SetNull`. |
| `Usuario` - `Empresa` validador | 1:N | Relación nombrada `ValidadorEmpresa`; separada del vínculo 1:1 base. |
| `Empresa` - `OfertaLaboral` | 1:N | Una empresa puede publicar múltiples ofertas. |
| `OfertaLaboral` - `Postulacion` | 1:N | Eliminación en cascada desde la oferta. |
| `Egresado` - `Postulacion` | 1:N | Eliminación en cascada desde el egresado. |
| `Postulacion` - `HistorialEstadoPostulacion` | 1:N | Permite trazabilidad temporal del proceso. |
| `Egresado` - `Habilidad` | N:M | Vía `HabilidadEgresado` con campo adicional `nivel`. |
| `OfertaLaboral` - `Habilidad` | N:M | Vía `HabilidadOferta` con campo adicional `requerida`. |
| `Usuario` - `Notificacion` | 1:N | Índice compuesto para lectura por estado. |
| `Usuario` - `Reporte` | 1:N | Cada usuario puede generar varios reportes. |
| `Reporte` - `Archivo` | 1:1 opcional | `archivoId` único en `Reporte`. |
| `Usuario` - `Auditoria` | 1:N opcional | La auditoría puede persistir aunque el usuario sea nulo. |

## 6. Índices existentes

| Modelo | Índice | Consulta que optimiza |
|---|---|---|
| `Usuario` | `[rol]`, `[estado]` | Filtrado por rol y estado de cuenta. |
| `Carrera` | `[estaActiva]` | Catálogo activo/inactivo. |
| `Sector` | `[estaActivo]` | Catálogo activo/inactivo. |
| `Egresado` | `[carreraId]`, `[anioEgreso]`, `[ciudad]`, `[region]` | Búsqueda y segmentación de egresados. |
| `FormacionEgresado` | `[egresadoId]`, `[institucion]` | Perfil y búsqueda por institución. |
| `ExperienciaEgresado` | `[egresadoId]`, `[empresa]`, `[cargo]` | Perfil y filtros por experiencia. |
| `Empresa` | `[sectorId]`, `[estadoValidacion]`, `[ciudad]`, `[region]` | Directorio empresarial y cola de validación. |
| `Habilidad` | `[tipo]`, `[categoria]` | Catálogo de habilidades por clasificación. |
| `HabilidadEgresado` | `[habilidadId]` | Búsqueda inversa por habilidad. |
| `OfertaLaboral` | `[empresaId]`, `[estado]`, `[modalidad]`, `[tipoContrato]`, `[publicadoEn]`, `[cierreEn]`, `[ciudad]`, `[region]`, `[salarioMin, salarioMax]` | Feed y filtros de ofertas. |
| `HabilidadOferta` | `[habilidadId]` | Búsqueda inversa por habilidad requerida. |
| `Postulacion` | `[ofertaId]`, `[egresadoId]`, `[estado]`, `[postuladoEn]` | Gestión de postulaciones por oferta, egresado y estado. |
| `HistorialEstadoPostulacion` | `[postulacionId]`, `[estadoNuevo]`, `[creadoEn]` | Auditoría temporal de cambios. |
| `Notificacion` | `[usuarioId, leida]`, `[tipo]`, `[creadoEn]` | Inbox por usuario y estado de lectura. |
| `Reporte` | `[usuarioId]`, `[tipo]`, `[estado]`, `[creadoEn]` | Listado y seguimiento de reportes. |
| `Archivo` | `[categoria]`, `[tipoEntidad, entidadId]` | Recuperación por tipo de archivo o entidad dueña. |
| `Auditoria` | `[usuarioId]`, `[accion]`, `[entidad]`, `[entidadId]`, `[creadoEn]` | Trazabilidad operativa y forense. |
| `MetricaAgregada` | `[tipoMetrica]`, `[fecha]` | Consultas analíticas por fecha y métrica. |

## 7. Posibles riesgos o inconsistencias

| Riesgo | Impacto | Recomendación |
|---|---|---|
| `datasource db` no declara `url` explícita en `schema.prisma`. | La configuración depende del adapter en runtime; puede confundir scripts Prisma o futuros mantenedores. | Mantenerlo si la generación/migración actual funciona, pero documentar la estrategia y validar comandos de CI. |
| `passwordHash` es opcional mientras existe `ProveedorAuth.CREDENCIALES`. | Puede permitir usuarios locales sin hash si no se valida en capa de servicio. | En Auth, exigir hash para credenciales y consistencia con proveedor. |
| `pais` tiene default `"Peru"` en `Egresado`, `Empresa` y `OfertaLaboral`. | Puede introducir datos por defecto incorrectos en contextos multi-país. | Tratarlo como supuesto local del negocio y revisarlo si el alcance cambia. |
| `Archivo` usa referencia polimórfica (`tipoEntidad` + `entidadId`) sin FK real salvo en `Reporte`. | Riesgo de registros huérfanos o integridad referencial parcial. | Validar estas asociaciones desde servicios de aplicación. |
| JSON libres (`metadata`, `parametros`, `valores`, auditoría). | Riesgo de payloads inconsistentes y sobreexposición de datos. | Definir contratos por caso de uso antes de exponer endpoints. |
| No existe convención de alias de imports en `apps/api`. | El crecimiento modular puede derivar en imports relativos profundos. | Evaluar alias cuando se inicien módulos funcionales. |

## PrismaService actual

- Ubicación: `apps/api/src/prisma/prisma.service.ts`
- ¿Está marcado como Global?: Indirectamente sí, porque `PrismaModule` usa `@Global()`.
- ¿Extiende PrismaClient?: Sí, importa `PrismaClient` desde `@graduate-employment-management/database`.
- ¿Implementa OnModuleInit?: Sí.
- ¿Implementa enableShutdownHooks?: No.
- ¿Está importado en AppModule?: Sí, mediante `PrismaModule`.
- Recomendación: La base es correcta para NestJS. En fases posteriores conviene evaluar `enableShutdownHooks` si se requiere apagado coordinado del proceso o integración con tests/e2e más complejos.

## ConfigModule actual

- Ubicación: `apps/api/src/app.module.ts`
- ¿Está configurado con `isGlobal: true`?: Sí.
- ¿Carga variables desde `.env`?: Sí, por comportamiento por defecto de `ConfigModule.forRoot()`.
- ¿Hay validación de variables de entorno?: No.
- Recomendación: Mantenerlo así en esta fase y agregar validación formal en la fase transversal indicada por el plan.

## Convenciones detectadas

- Nombres de archivos: kebab-case con sufijos de Nest (`app.module.ts`, `prisma.service.ts`, `app.controller.spec.ts`).
- Nombres de clases: PascalCase (`AppModule`, `PrismaService`, `AppController`).
- Alias de imports: No se observan alias locales; predominan imports relativos y de paquetes.
- Ubicación de módulos: `apps/api/src/<dominio>/<archivo>.module.ts` o directamente en `src` para el módulo raíz.
- Ubicación de DTOs: No existen todavía en `apps/api/src`.
- Ubicación de guards: No existen todavía en `apps/api/src`.
- Ubicación de decorators: No existen todavía en `apps/api/src`.
- Ubicación de routers tRPC: No existen todavía en `apps/api/src`.

## Exportación actual del paquete database

- Paquete: `packages/database/package.json`
- Export principal: `src/index.ts`
- Contenido exportado: `export * from '@prisma/client';`
- Observación: Los modelos, enums y `PrismaClient` se consumen desde `@graduate-employment-management/database`, pero el paquete no añade abstracciones propias todavía.
