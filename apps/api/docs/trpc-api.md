# tRPC API

## Router: auth

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `me` | Usuario autenticado | Retorna el usuario autenticado resuelto desde el contexto tRPC. |

## Router: carreras

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `list` | Publico | Lista carreras con filtros basicos. |
| `getById` | Publico | Obtiene una carrera por id. |
| `create` | `ADMINISTRADOR` | Crea una carrera del catalogo. |
| `update` | `ADMINISTRADOR` | Actualiza una carrera existente. |
| `toggleActiva` | `ADMINISTRADOR` | Activa o desactiva una carrera. |

## Router: sectores

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `list` | Publico | Lista sectores empresariales. |
| `getById` | Publico | Obtiene un sector por id. |
| `create` | `ADMINISTRADOR` | Crea un sector. |
| `update` | `ADMINISTRADOR` | Actualiza un sector. |
| `toggleActivo` | `ADMINISTRADOR` | Activa o desactiva un sector. |

## Router: habilidades

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `list` | Publico | Lista habilidades del catalogo. |
| `getById` | Publico | Obtiene una habilidad por id. |
| `create` | `ADMINISTRADOR` | Crea una habilidad. |
| `update` | `ADMINISTRADOR` | Actualiza una habilidad. |
| `delete` | `ADMINISTRADOR` | Elimina una habilidad del catalogo. |

## Router: egresados

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `getMiPerfil` | `EGRESADO` | Devuelve el perfil propio del egresado. |
| `updateMiPerfil` | `EGRESADO` | Actualiza datos base del perfil. |
| `addFormacion` | `EGRESADO` | Agrega una formacion academica. |
| `updateFormacion` | `EGRESADO` | Edita una formacion. |
| `deleteFormacion` | `EGRESADO` | Elimina una formacion. |
| `addExperiencia` | `EGRESADO` | Agrega experiencia laboral. |
| `updateExperiencia` | `EGRESADO` | Edita experiencia laboral. |
| `deleteExperiencia` | `EGRESADO` | Elimina experiencia laboral. |
| `syncHabilidades` | `EGRESADO` | Sincroniza habilidades del perfil. |
| `getById` | Usuario autenticado | Obtiene perfil segun permisos del actor. |
| `buscar` | `ADMINISTRADOR`, `EMPRESA` | Busca egresados para reclutamiento o gestion. |

## Router: empresas

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `getMiPerfil` | `EMPRESA` | Devuelve el perfil propio de empresa. |
| `updateMiPerfil` | `EMPRESA` | Actualiza el perfil editable de empresa. |
| `getById` | Usuario autenticado | Muestra vista publica o administrativa de empresa. |
| `listar` | `ADMINISTRADOR` | Lista empresas para validacion y gestion. |
| `validar` | `ADMINISTRADOR` | Aprueba o rechaza una empresa. |
| `getEstadoValidacion` | `EMPRESA` | Devuelve el estado actual de validacion. |

## Router: ofertas

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `feed` | Usuario autenticado | Lista ofertas visibles segun rol. |
| `getById` | Usuario autenticado | Obtiene detalle de una oferta segun permisos. |
| `misOfertas` | `EMPRESA` | Lista ofertas propias de la empresa. |
| `create` | `EMPRESA` | Crea una oferta sujeta a moderacion. |
| `update` | `EMPRESA` | Actualiza una oferta propia. |
| `cerrar` | `EMPRESA` | Cierra una oferta propia. |
| `delete` | `EMPRESA` | Elimina una oferta sin postulaciones. |
| `adminList` | `ADMINISTRADOR` | Lista administrativa de ofertas. |
| `adminModerar` | `ADMINISTRADOR` | Aprueba o rechaza una oferta. |

## Router: postulaciones

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `postular` | `EGRESADO` | Crea una postulacion a una oferta activa. |
| `misPostulaciones` | `EGRESADO` | Lista postulaciones propias. |
| `getById` | Usuario autenticado | Obtiene detalle de postulacion segun permisos. |
| `postulantesPorOferta` | `EMPRESA` | Lista postulantes de una oferta propia. |
| `cambiarEstado` | `EMPRESA`, `ADMINISTRADOR` | Cambia el estado de una postulacion. |
| `historial` | Usuario autenticado | Retorna el historial de estados de una postulacion accesible. |
| `adminList` | `ADMINISTRADOR` | Lista administrativa de postulaciones. |

## Router: notificaciones

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `misNotificaciones` | Usuario autenticado | Lista notificaciones del usuario. |
| `noLeidasCount` | Usuario autenticado | Cuenta notificaciones no leidas. |
| `getById` | Usuario autenticado | Obtiene detalle de una notificacion propia. |
| `marcarLeida` | Usuario autenticado | Marca una notificacion como leida. |
| `marcarTodasLeidas` | Usuario autenticado | Marca todas las notificaciones como leidas. |
| `adminCrearSistema` | `ADMINISTRADOR` | Crea una notificacion de sistema. |

## Router: estadisticas

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `adminKPIs` | `ADMINISTRADOR` | Retorna KPIs globales del sistema. |
| `adminOfertasVsPostulaciones` | `ADMINISTRADOR` | Serie comparativa de ofertas y postulaciones. |
| `adminEgresadosPorCarrera` | `ADMINISTRADOR` | Distribucion de egresados por carrera. |
| `adminDemandaHabilidades` | `ADMINISTRADOR` | Demanda agregada de habilidades. |
| `adminContratacionPorCohorte` | `ADMINISTRADOR` | Contratacion por anio o cohorte. |
| `adminPostulacionesPorEstado` | `ADMINISTRADOR` | Distribucion de postulaciones por estado. |
| `egresadoResumen` | `EGRESADO` | Resumen personal de actividad del egresado. |
| `egresadoPostulacionesPorEstado` | `EGRESADO` | Conteo propio por estado de postulacion. |
| `egresadoRecomendacionesBasicas` | `EGRESADO` | Recomendaciones basicas por match de habilidades. |
| `empresaResumen` | `EMPRESA` | Resumen de actividad de ofertas propias. |
| `empresaEmbudoPostulantes` | `EMPRESA` | Embudo de estados para una oferta o conjunto propio. |
| `empresaRendimientoOfertas` | `EMPRESA` | Rendimiento paginado por oferta propia. |

## Router: reportes

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `solicitar` | Usuario autenticado | Solicita un reporte permitido por rol. |
| `misReportes` | Usuario autenticado | Lista reportes propios. |
| `getById` | Usuario autenticado | Obtiene estado y metadata de un reporte. |
| `reintentar` | Usuario autenticado | Reintenta un reporte fallido si tiene acceso. |

## Router: archivos

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `getById` | Usuario autenticado | Obtiene metadata segura de un archivo accesible. |
| `misArchivos` | Usuario autenticado | Lista archivos propios por categoria opcional. |

## Router: auditoria

| Procedimiento | Acceso | Descripcion |
|---|---|---|
| `listar` | `ADMINISTRADOR` | Lista registros de auditoria con filtros y paginacion. |
| `getById` | `ADMINISTRADOR` | Obtiene detalle saneado de un registro de auditoria. |
