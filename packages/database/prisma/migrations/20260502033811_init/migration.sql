-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMINISTRADOR', 'EGRESADO', 'EMPRESA');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'PENDIENTE', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "ProveedorAuth" AS ENUM ('CREDENCIALES', 'GOOGLE');

-- CreateEnum
CREATE TYPE "TipoHabilidad" AS ENUM ('TECNICA', 'BLANDA');

-- CreateEnum
CREATE TYPE "NivelHabilidad" AS ENUM ('BASICO', 'INTERMEDIO', 'AVANZADO', 'EXPERTO');

-- CreateEnum
CREATE TYPE "EstadoValidacionEmpresa" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "ModalidadOferta" AS ENUM ('REMOTO', 'HIBRIDO', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "TipoContrato" AS ENUM ('TIEMPO_COMPLETO', 'MEDIO_TIEMPO', 'POR_PROYECTO', 'PRACTICAS');

-- CreateEnum
CREATE TYPE "EstadoOferta" AS ENUM ('BORRADOR', 'PENDIENTE_REVISION', 'APROBADA', 'RECHAZADA', 'ACTIVA', 'CERRADA', 'EXPIRADA');

-- CreateEnum
CREATE TYPE "EstadoPostulacion" AS ENUM ('POSTULADO', 'EN_REVISION', 'ENTREVISTA', 'CONTRATADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "CategoriaArchivo" AS ENUM ('CV', 'LOGO', 'REPORTE', 'DOCUMENTO', 'AVATAR');

-- CreateEnum
CREATE TYPE "TipoEntidadArchivo" AS ENUM ('USUARIO', 'EGRESADO', 'EMPRESA', 'REPORTE', 'SISTEMA');

-- CreateEnum
CREATE TYPE "TipoReporte" AS ENUM ('EGRESADOS_POR_CARRERA', 'OFERTAS_ACTIVAS', 'POSTULACIONES_POR_OFERTA', 'EMPLEABILIDAD', 'DEMANDA_LABORAL', 'COMPARATIVO_COHORTES');

-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'FALLIDO');

-- CreateEnum
CREATE TYPE "CanalNotificacion" AS ENUM ('INTERNA', 'EMAIL');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('NUEVA_OFERTA', 'POSTULACION_CREADA', 'ESTADO_POSTULACION_CAMBIADO', 'EMPRESA_VALIDADA', 'REPORTE_GENERADO', 'SISTEMA');

-- CreateEnum
CREATE TYPE "TipoMetrica" AS ENUM ('KPIS_ADMINISTRADOR', 'EMPLEABILIDAD_POR_CARRERA', 'DEMANDA_HABILIDADES', 'OFERTAS_VS_POSTULACIONES', 'EGRESADOS_POR_CARRERA', 'CONTRATACION_POR_COHORTE', 'POSTULACIONES_POR_ESTADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "rol" "RolUsuario" NOT NULL,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'PENDIENTE',
    "proveedor_auth" "ProveedorAuth" NOT NULL DEFAULT 'CREDENCIALES',
    "proveedor_id" TEXT,
    "email_verificado_en" TIMESTAMP(3),
    "ultimo_login_en" TIMESTAMP(3),
    "avatar_url" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carreras" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "esta_activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carreras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sectores" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sectores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "egresados" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3),
    "telefono" TEXT,
    "direccion" TEXT,
    "carrera_id" TEXT,
    "anio_egreso" INTEGER,
    "pais" TEXT DEFAULT 'Peru',
    "region" TEXT,
    "ciudad" TEXT,
    "distrito" TEXT,
    "presentacion" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "egresados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formaciones_egresado" (
    "id" TEXT NOT NULL,
    "egresado_id" TEXT NOT NULL,
    "institucion" TEXT NOT NULL,
    "grado" TEXT,
    "campo" TEXT,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "es_actual" BOOLEAN NOT NULL DEFAULT false,
    "descripcion" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formaciones_egresado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiencias_egresado" (
    "id" TEXT NOT NULL,
    "egresado_id" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "es_actual" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiencias_egresado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "nombre_comercial" TEXT NOT NULL,
    "razon_social" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "sector_id" TEXT,
    "sitio_web" TEXT,
    "descripcion" TEXT,
    "pais" TEXT DEFAULT 'Peru',
    "region" TEXT,
    "ciudad" TEXT,
    "distrito" TEXT,
    "direccion" TEXT,
    "estado_validacion" "EstadoValidacionEmpresa" NOT NULL DEFAULT 'PENDIENTE',
    "validado_por_id" TEXT,
    "validado_en" TIMESTAMP(3),
    "motivo_rechazo" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administradores" (
    "id" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "area" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "administradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habilidades" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoHabilidad" NOT NULL,
    "categoria" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habilidades_egresado" (
    "egresado_id" TEXT NOT NULL,
    "habilidad_id" TEXT NOT NULL,
    "nivel" "NivelHabilidad",
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habilidades_egresado_pkey" PRIMARY KEY ("egresado_id","habilidad_id")
);

-- CreateTable
CREATE TABLE "ofertas_laborales" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "vacantes" INTEGER NOT NULL DEFAULT 1,
    "modalidad" "ModalidadOferta" NOT NULL,
    "tipo_contrato" "TipoContrato" NOT NULL,
    "salario_min" DECIMAL(10,2),
    "salario_max" DECIMAL(10,2),
    "pais" TEXT DEFAULT 'Peru',
    "region" TEXT,
    "ciudad" TEXT,
    "distrito" TEXT,
    "direccion" TEXT,
    "estado" "EstadoOferta" NOT NULL DEFAULT 'BORRADOR',
    "publicado_en" TIMESTAMP(3),
    "cierre_en" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ofertas_laborales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habilidades_oferta" (
    "oferta_id" TEXT NOT NULL,
    "habilidad_id" TEXT NOT NULL,
    "requerida" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habilidades_oferta_pkey" PRIMARY KEY ("oferta_id","habilidad_id")
);

-- CreateTable
CREATE TABLE "postulaciones" (
    "id" TEXT NOT NULL,
    "oferta_id" TEXT NOT NULL,
    "egresado_id" TEXT NOT NULL,
    "estado" "EstadoPostulacion" NOT NULL DEFAULT 'POSTULADO',
    "comentario" TEXT,
    "postulado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "postulaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_estados_postulacion" (
    "id" TEXT NOT NULL,
    "postulacion_id" TEXT NOT NULL,
    "estado_anterior" "EstadoPostulacion",
    "estado_nuevo" "EstadoPostulacion" NOT NULL,
    "motivo" TEXT,
    "cambiado_por_id" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_estados_postulacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "canal" "CanalNotificacion" NOT NULL DEFAULT 'INTERNA',
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leida_en" TIMESTAMP(3),

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo" "TipoReporte" NOT NULL,
    "estado" "EstadoReporte" NOT NULL DEFAULT 'PENDIENTE',
    "nombre_archivo" TEXT,
    "archivo_id" TEXT,
    "parametros" JSONB,
    "mensaje_error" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "iniciado_en" TIMESTAMP(3),
    "completado_en" TIMESTAMP(3),

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT,
    "nombre_archivo" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "tamanio" INTEGER,
    "categoria" "CategoriaArchivo" NOT NULL,
    "tipo_entidad" "TipoEntidadArchivo" NOT NULL,
    "entidad_id" TEXT NOT NULL,
    "proveedor_almacenamiento" TEXT NOT NULL DEFAULT 'LOCAL',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditorias" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidad_id" TEXT,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "ip" TEXT,
    "user_agent" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metricas_agregadas" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipo_metrica" "TipoMetrica" NOT NULL,
    "valores" JSONB NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metricas_agregadas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE INDEX "usuarios_estado_idx" ON "usuarios"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "carreras_nombre_key" ON "carreras"("nombre");

-- CreateIndex
CREATE INDEX "carreras_esta_activa_idx" ON "carreras"("esta_activa");

-- CreateIndex
CREATE UNIQUE INDEX "sectores_nombre_key" ON "sectores"("nombre");

-- CreateIndex
CREATE INDEX "sectores_esta_activo_idx" ON "sectores"("esta_activo");

-- CreateIndex
CREATE UNIQUE INDEX "egresados_dni_key" ON "egresados"("dni");

-- CreateIndex
CREATE INDEX "egresados_carrera_id_idx" ON "egresados"("carrera_id");

-- CreateIndex
CREATE INDEX "egresados_anio_egreso_idx" ON "egresados"("anio_egreso");

-- CreateIndex
CREATE INDEX "egresados_ciudad_idx" ON "egresados"("ciudad");

-- CreateIndex
CREATE INDEX "egresados_region_idx" ON "egresados"("region");

-- CreateIndex
CREATE INDEX "formaciones_egresado_egresado_id_idx" ON "formaciones_egresado"("egresado_id");

-- CreateIndex
CREATE INDEX "formaciones_egresado_institucion_idx" ON "formaciones_egresado"("institucion");

-- CreateIndex
CREATE INDEX "experiencias_egresado_egresado_id_idx" ON "experiencias_egresado"("egresado_id");

-- CreateIndex
CREATE INDEX "experiencias_egresado_empresa_idx" ON "experiencias_egresado"("empresa");

-- CreateIndex
CREATE INDEX "experiencias_egresado_cargo_idx" ON "experiencias_egresado"("cargo");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_ruc_key" ON "empresas"("ruc");

-- CreateIndex
CREATE INDEX "empresas_sector_id_idx" ON "empresas"("sector_id");

-- CreateIndex
CREATE INDEX "empresas_estado_validacion_idx" ON "empresas"("estado_validacion");

-- CreateIndex
CREATE INDEX "empresas_ciudad_idx" ON "empresas"("ciudad");

-- CreateIndex
CREATE INDEX "empresas_region_idx" ON "empresas"("region");

-- CreateIndex
CREATE UNIQUE INDEX "habilidades_nombre_key" ON "habilidades"("nombre");

-- CreateIndex
CREATE INDEX "habilidades_tipo_idx" ON "habilidades"("tipo");

-- CreateIndex
CREATE INDEX "habilidades_categoria_idx" ON "habilidades"("categoria");

-- CreateIndex
CREATE INDEX "habilidades_egresado_habilidad_id_idx" ON "habilidades_egresado"("habilidad_id");

-- CreateIndex
CREATE INDEX "ofertas_laborales_empresa_id_idx" ON "ofertas_laborales"("empresa_id");

-- CreateIndex
CREATE INDEX "ofertas_laborales_estado_idx" ON "ofertas_laborales"("estado");

-- CreateIndex
CREATE INDEX "ofertas_laborales_modalidad_idx" ON "ofertas_laborales"("modalidad");

-- CreateIndex
CREATE INDEX "ofertas_laborales_tipo_contrato_idx" ON "ofertas_laborales"("tipo_contrato");

-- CreateIndex
CREATE INDEX "ofertas_laborales_publicado_en_idx" ON "ofertas_laborales"("publicado_en");

-- CreateIndex
CREATE INDEX "ofertas_laborales_cierre_en_idx" ON "ofertas_laborales"("cierre_en");

-- CreateIndex
CREATE INDEX "ofertas_laborales_ciudad_idx" ON "ofertas_laborales"("ciudad");

-- CreateIndex
CREATE INDEX "ofertas_laborales_region_idx" ON "ofertas_laborales"("region");

-- CreateIndex
CREATE INDEX "ofertas_laborales_salario_min_salario_max_idx" ON "ofertas_laborales"("salario_min", "salario_max");

-- CreateIndex
CREATE INDEX "habilidades_oferta_habilidad_id_idx" ON "habilidades_oferta"("habilidad_id");

-- CreateIndex
CREATE INDEX "postulaciones_oferta_id_idx" ON "postulaciones"("oferta_id");

-- CreateIndex
CREATE INDEX "postulaciones_egresado_id_idx" ON "postulaciones"("egresado_id");

-- CreateIndex
CREATE INDEX "postulaciones_estado_idx" ON "postulaciones"("estado");

-- CreateIndex
CREATE INDEX "postulaciones_postulado_en_idx" ON "postulaciones"("postulado_en");

-- CreateIndex
CREATE UNIQUE INDEX "postulaciones_oferta_id_egresado_id_key" ON "postulaciones"("oferta_id", "egresado_id");

-- CreateIndex
CREATE INDEX "historial_estados_postulacion_postulacion_id_idx" ON "historial_estados_postulacion"("postulacion_id");

-- CreateIndex
CREATE INDEX "historial_estados_postulacion_estado_nuevo_idx" ON "historial_estados_postulacion"("estado_nuevo");

-- CreateIndex
CREATE INDEX "historial_estados_postulacion_creado_en_idx" ON "historial_estados_postulacion"("creado_en");

-- CreateIndex
CREATE INDEX "notificaciones_usuario_id_leida_idx" ON "notificaciones"("usuario_id", "leida");

-- CreateIndex
CREATE INDEX "notificaciones_tipo_idx" ON "notificaciones"("tipo");

-- CreateIndex
CREATE INDEX "notificaciones_creado_en_idx" ON "notificaciones"("creado_en");

-- CreateIndex
CREATE UNIQUE INDEX "reportes_archivo_id_key" ON "reportes"("archivo_id");

-- CreateIndex
CREATE INDEX "reportes_usuario_id_idx" ON "reportes"("usuario_id");

-- CreateIndex
CREATE INDEX "reportes_tipo_idx" ON "reportes"("tipo");

-- CreateIndex
CREATE INDEX "reportes_estado_idx" ON "reportes"("estado");

-- CreateIndex
CREATE INDEX "reportes_creado_en_idx" ON "reportes"("creado_en");

-- CreateIndex
CREATE INDEX "archivos_categoria_idx" ON "archivos"("categoria");

-- CreateIndex
CREATE INDEX "archivos_tipo_entidad_entidad_id_idx" ON "archivos"("tipo_entidad", "entidad_id");

-- CreateIndex
CREATE INDEX "auditorias_usuario_id_idx" ON "auditorias"("usuario_id");

-- CreateIndex
CREATE INDEX "auditorias_accion_idx" ON "auditorias"("accion");

-- CreateIndex
CREATE INDEX "auditorias_entidad_idx" ON "auditorias"("entidad");

-- CreateIndex
CREATE INDEX "auditorias_entidad_id_idx" ON "auditorias"("entidad_id");

-- CreateIndex
CREATE INDEX "auditorias_creado_en_idx" ON "auditorias"("creado_en");

-- CreateIndex
CREATE INDEX "metricas_agregadas_tipo_metrica_idx" ON "metricas_agregadas"("tipo_metrica");

-- CreateIndex
CREATE INDEX "metricas_agregadas_fecha_idx" ON "metricas_agregadas"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "metricas_agregadas_fecha_tipo_metrica_key" ON "metricas_agregadas"("fecha", "tipo_metrica");

-- AddForeignKey
ALTER TABLE "egresados" ADD CONSTRAINT "egresados_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "egresados" ADD CONSTRAINT "egresados_carrera_id_fkey" FOREIGN KEY ("carrera_id") REFERENCES "carreras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formaciones_egresado" ADD CONSTRAINT "formaciones_egresado_egresado_id_fkey" FOREIGN KEY ("egresado_id") REFERENCES "egresados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiencias_egresado" ADD CONSTRAINT "experiencias_egresado_egresado_id_fkey" FOREIGN KEY ("egresado_id") REFERENCES "egresados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_validado_por_id_fkey" FOREIGN KEY ("validado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administradores" ADD CONSTRAINT "administradores_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades_egresado" ADD CONSTRAINT "habilidades_egresado_egresado_id_fkey" FOREIGN KEY ("egresado_id") REFERENCES "egresados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades_egresado" ADD CONSTRAINT "habilidades_egresado_habilidad_id_fkey" FOREIGN KEY ("habilidad_id") REFERENCES "habilidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ofertas_laborales" ADD CONSTRAINT "ofertas_laborales_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades_oferta" ADD CONSTRAINT "habilidades_oferta_oferta_id_fkey" FOREIGN KEY ("oferta_id") REFERENCES "ofertas_laborales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habilidades_oferta" ADD CONSTRAINT "habilidades_oferta_habilidad_id_fkey" FOREIGN KEY ("habilidad_id") REFERENCES "habilidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulaciones" ADD CONSTRAINT "postulaciones_oferta_id_fkey" FOREIGN KEY ("oferta_id") REFERENCES "ofertas_laborales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulaciones" ADD CONSTRAINT "postulaciones_egresado_id_fkey" FOREIGN KEY ("egresado_id") REFERENCES "egresados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados_postulacion" ADD CONSTRAINT "historial_estados_postulacion_postulacion_id_fkey" FOREIGN KEY ("postulacion_id") REFERENCES "postulaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados_postulacion" ADD CONSTRAINT "historial_estados_postulacion_cambiado_por_id_fkey" FOREIGN KEY ("cambiado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes" ADD CONSTRAINT "reportes_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
