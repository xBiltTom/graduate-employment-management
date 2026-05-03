import {
  CategoriaArchivo,
  EstadoOferta,
  EstadoPostulacion,
  EstadoReporte,
  ModalidadOferta,
  Prisma,
  TipoEntidadArchivo,
  TipoNotificacion,
  TipoReporte,
} from '@graduate-employment-management/database';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { NotificacionesService } from '../../notificaciones/notificaciones.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportsStorageService } from './reports-storage.service';
import { PdfGeneratorService } from './pdf-generator.service';

const reportSelect = {
  id: true,
  usuarioId: true,
  tipo: true,
  estado: true,
  parametros: true,
  nombreArchivo: true,
  archivoId: true,
  mensajeError: true,
  usuario: {
    select: {
      id: true,
      email: true,
      rol: true,
    },
  },
  archivo: {
    select: {
      id: true,
      nombreArchivo: true,
      key: true,
      mimeType: true,
      tamanio: true,
      url: true,
    },
  },
} satisfies Prisma.ReporteSelect;

const adminCarreraParamsSchema = z.object({
  carreraId: z.string().uuid().optional(),
  anioEgreso: z.number().int().optional(),
});

const ofertasActivasParamsSchema = z.object({
  modalidad: z.nativeEnum(ModalidadOferta).optional(),
  ciudad: z.string().trim().min(1).optional(),
  region: z.string().trim().min(1).optional(),
});

const postulacionesPorOfertaParamsSchema = z.object({
  ofertaId: z.string().uuid(),
});

const empleabilidadParamsSchema = z.object({
  carreraId: z.string().uuid().optional(),
  anioEgreso: z.number().int().optional(),
});

const demandaLaboralParamsSchema = z
  .object({
    fechaDesde: z.coerce.date().optional(),
    fechaHasta: z.coerce.date().optional(),
    modalidad: z.nativeEnum(ModalidadOferta).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.fechaDesde &&
      value.fechaHasta &&
      value.fechaDesde > value.fechaHasta
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'fechaDesde no puede ser mayor que fechaHasta',
        path: ['fechaDesde'],
      });
    }
  });

const comparativoCohortesParamsSchema = z.object({
  carreraId: z.string().uuid().optional(),
  anios: z.array(z.number().int()).max(20).optional(),
});

@Injectable()
export class ReportsJobService {
  private readonly logger = new Logger(ReportsJobService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfGeneratorService: PdfGeneratorService,
    private readonly reportsStorageService: ReportsStorageService,
    private readonly configService: ConfigService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async processReport(reporteId: string) {
    const reporte = await this.prisma.reporte.findUnique({
      where: { id: reporteId },
      select: reportSelect,
    });

    if (!reporte) {
      return;
    }

    await this.prisma.reporte.update({
      where: { id: reporteId },
      data: {
        estado: EstadoReporte.PROCESANDO,
        iniciadoEn: new Date(),
        completadoEn: null,
        mensajeError: null,
      },
    });

    try {
      const payload = await this.buildReportPayload(reporte);
      const buffer = await this.pdfGeneratorService.generateReportPdf({
        title: payload.title,
        subtitle: payload.subtitle,
        generatedBy: reporte.usuario.email,
        generatedAt: new Date(),
        sections: payload.sections,
      });

      const filename = this.reportsStorageService.buildReportFilename(
        reporte.id,
        reporte.tipo,
      );

      if (reporte.archivo?.key) {
        await this.reportsStorageService.deleteIfExists(reporte.archivo.key);
      }

      const savedFile = await this.reportsStorageService.writePdf(
        filename,
        buffer,
      );
      const downloadUrl = this.buildDownloadUrl(reporte.id);

      const archivo = reporte.archivoId
        ? await this.prisma.archivo.update({
            where: { id: reporte.archivoId },
            data: {
              url: downloadUrl,
              key: filename,
              nombreArchivo: filename,
              mimeType: 'application/pdf',
              tamanio: savedFile.size,
              categoria: CategoriaArchivo.REPORTE,
              tipoEntidad: TipoEntidadArchivo.REPORTE,
              entidadId: reporte.id,
              proveedorAlmacenamiento: 'LOCAL',
            },
            select: {
              id: true,
            },
          })
        : await this.prisma.archivo.create({
            data: {
              url: downloadUrl,
              key: filename,
              nombreArchivo: filename,
              mimeType: 'application/pdf',
              tamanio: savedFile.size,
              categoria: CategoriaArchivo.REPORTE,
              tipoEntidad: TipoEntidadArchivo.REPORTE,
              entidadId: reporte.id,
              proveedorAlmacenamiento: 'LOCAL',
            },
            select: {
              id: true,
            },
          });

      await this.prisma.reporte.update({
        where: { id: reporte.id },
        data: {
          estado: EstadoReporte.COMPLETADO,
          nombreArchivo: filename,
          archivoId: archivo.id,
          completadoEn: new Date(),
          mensajeError: null,
        },
      });

      await this.safeNotify({
        usuarioId: reporte.usuarioId,
        tipo: TipoNotificacion.REPORTE_GENERADO,
        titulo: 'Reporte generado',
        contenido: 'Tu reporte ya esta listo para descargar.',
        metadata: {
          reporteId: reporte.id,
          tipo: reporte.tipo,
        },
      });
    } catch (error) {
      const message = this.sanitizeErrorMessage(error);

      await this.prisma.reporte.update({
        where: { id: reporte.id },
        data: {
          estado: EstadoReporte.FALLIDO,
          completadoEn: null,
          mensajeError: message,
        },
      });

      await this.safeNotify({
        usuarioId: reporte.usuarioId,
        tipo: TipoNotificacion.SISTEMA,
        titulo: 'Reporte fallido',
        contenido: 'No se pudo generar tu reporte. Intenta nuevamente.',
        metadata: {
          reporteId: reporte.id,
          tipo: reporte.tipo,
        },
      });
    }
  }

  private async buildReportPayload(reporte: {
    id: string;
    tipo: TipoReporte;
    parametros: Prisma.JsonValue | null;
  }) {
    switch (reporte.tipo) {
      case TipoReporte.EGRESADOS_POR_CARRERA:
        return this.buildEgresadosPorCarreraReport(reporte.parametros);
      case TipoReporte.OFERTAS_ACTIVAS:
        return this.buildOfertasActivasReport(reporte.parametros);
      case TipoReporte.POSTULACIONES_POR_OFERTA:
        return this.buildPostulacionesPorOfertaReport(reporte.parametros);
      case TipoReporte.EMPLEABILIDAD:
        return this.buildEmpleabilidadReport(reporte.parametros);
      case TipoReporte.DEMANDA_LABORAL:
        return this.buildDemandaLaboralReport(reporte.parametros);
      case TipoReporte.COMPARATIVO_COHORTES:
        return this.buildComparativoCohortesReport(reporte.parametros);
      default:
        throw new Error('Tipo de reporte no soportado');
    }
  }

  private async buildEgresadosPorCarreraReport(
    parametros: Prisma.JsonValue | null,
  ) {
    const parsed = adminCarreraParamsSchema.parse(this.toRecord(parametros));

    const [rows, total] = await Promise.all([
      this.prisma.egresado.findMany({
        where: {
          ...(parsed.carreraId ? { carreraId: parsed.carreraId } : {}),
          ...(parsed.anioEgreso ? { anioEgreso: parsed.anioEgreso } : {}),
        },
        select: {
          nombres: true,
          apellidos: true,
          anioEgreso: true,
          ciudad: true,
          carrera: {
            select: {
              nombre: true,
            },
          },
        },
        orderBy: [{ anioEgreso: 'desc' }, { apellidos: 'asc' }],
      }),
      this.prisma.egresado.count({
        where: {
          ...(parsed.carreraId ? { carreraId: parsed.carreraId } : {}),
          ...(parsed.anioEgreso ? { anioEgreso: parsed.anioEgreso } : {}),
        },
      }),
    ]);

    return {
      title: 'Reporte de Egresados por Carrera',
      subtitle: 'Listado base de egresados filtrados por carrera/cohorte',
      sections: [
        {
          heading: 'Resumen',
          metrics: [{ label: 'Total de egresados', value: total }],
        },
        {
          heading: 'Detalle',
          rows: rows.map((row) => ({
            nombres: `${row.nombres} ${row.apellidos}`.trim(),
            carrera: row.carrera?.nombre ?? 'Sin carrera',
            anioEgreso: row.anioEgreso ?? '-',
            ciudad: row.ciudad ?? '-',
          })),
        },
      ],
    };
  }

  private async buildOfertasActivasReport(parametros: Prisma.JsonValue | null) {
    const parsed = ofertasActivasParamsSchema.parse(this.toRecord(parametros));

    const rows = await this.prisma.ofertaLaboral.findMany({
      where: {
        estado: EstadoOferta.ACTIVA,
        ...(parsed.modalidad ? { modalidad: parsed.modalidad } : {}),
        ...(parsed.ciudad
          ? {
              ciudad: {
                contains: parsed.ciudad,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(parsed.region
          ? {
              region: {
                contains: parsed.region,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      select: {
        titulo: true,
        modalidad: true,
        tipoContrato: true,
        ciudad: true,
        region: true,
        publicadoEn: true,
        empresa: {
          select: {
            nombreComercial: true,
          },
        },
      },
      orderBy: [{ publicadoEn: 'desc' }, { creadoEn: 'desc' }],
    });

    return {
      title: 'Reporte de Ofertas Activas',
      subtitle: 'Listado operativo de ofertas activas publicadas',
      sections: [
        {
          heading: 'Resumen',
          metrics: [{ label: 'Total de ofertas activas', value: rows.length }],
        },
        {
          heading: 'Detalle',
          rows: rows.map((row) => ({
            titulo: row.titulo,
            empresa: row.empresa.nombreComercial,
            modalidad: row.modalidad,
            contrato: row.tipoContrato,
            ubicacion: `${row.ciudad ?? '-'} / ${row.region ?? '-'}`,
            publicadoEn: row.publicadoEn?.toISOString() ?? '-',
          })),
        },
      ],
    };
  }

  private async buildPostulacionesPorOfertaReport(
    parametros: Prisma.JsonValue | null,
  ) {
    const parsed = postulacionesPorOfertaParamsSchema.parse(
      this.toRecord(parametros),
    );

    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id: parsed.ofertaId },
      select: {
        id: true,
        titulo: true,
        empresa: {
          select: {
            nombreComercial: true,
          },
        },
        postulaciones: {
          select: {
            estado: true,
            postuladoEn: true,
            egresado: {
              select: {
                nombres: true,
                apellidos: true,
                carrera: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
          },
          orderBy: {
            postuladoEn: 'desc',
          },
        },
      },
    });

    if (!oferta) {
      throw new Error('Oferta no encontrada para generar el reporte');
    }

    const estadoCounts = this.countByEstado(oferta.postulaciones);

    return {
      title: 'Reporte de Postulaciones por Oferta',
      subtitle: `${oferta.titulo} - ${oferta.empresa.nombreComercial}`,
      sections: [
        {
          heading: 'Resumen',
          metrics: [
            {
              label: 'Total de postulaciones',
              value: oferta.postulaciones.length,
            },
            ...estadoCounts,
          ],
        },
        {
          heading: 'Detalle',
          rows: oferta.postulaciones.map((row) => ({
            egresado:
              `${row.egresado.nombres} ${row.egresado.apellidos}`.trim(),
            carrera: row.egresado.carrera?.nombre ?? 'Sin carrera',
            estado: row.estado,
            postuladoEn: row.postuladoEn.toISOString(),
          })),
        },
      ],
    };
  }

  private async buildEmpleabilidadReport(parametros: Prisma.JsonValue | null) {
    const parsed = empleabilidadParamsSchema.parse(this.toRecord(parametros));

    const where = {
      ...(parsed.carreraId ? { carreraId: parsed.carreraId } : {}),
      ...(parsed.anioEgreso ? { anioEgreso: parsed.anioEgreso } : {}),
    } satisfies Prisma.EgresadoWhereInput;

    const [egresados, contratados] = await Promise.all([
      this.prisma.egresado.findMany({
        where,
        select: {
          id: true,
          anioEgreso: true,
          carrera: {
            select: {
              nombre: true,
            },
          },
        },
      }),
      this.prisma.postulacion.findMany({
        where: {
          estado: EstadoPostulacion.CONTRATADO,
          ...(parsed.carreraId || parsed.anioEgreso
            ? {
                egresado: {
                  is: where,
                },
              }
            : {}),
        },
        distinct: ['egresadoId'],
        select: {
          egresadoId: true,
        },
      }),
    ]);

    const contratadosSet = new Set(contratados.map((item) => item.egresadoId));
    const total = egresados.length;
    const totalContratados = egresados.filter((item) =>
      contratadosSet.has(item.id),
    ).length;

    return {
      title: 'Reporte de Empleabilidad',
      subtitle: 'Indicadores base de empleabilidad de egresados',
      sections: [
        {
          heading: 'Resumen',
          metrics: [
            { label: 'Total de egresados', value: total },
            { label: 'Total contratados', value: totalContratados },
            {
              label: 'Tasa de empleabilidad',
              value: this.percentage(totalContratados, total),
            },
          ],
        },
        {
          heading: 'Cohortes consideradas',
          rows: egresados.map((row) => ({
            carrera: row.carrera?.nombre ?? 'Sin carrera',
            anioEgreso: row.anioEgreso ?? '-',
            contratado: contratadosSet.has(row.id) ? 'Si' : 'No',
          })),
        },
      ],
    };
  }

  private async buildDemandaLaboralReport(parametros: Prisma.JsonValue | null) {
    const parsed = demandaLaboralParamsSchema.parse(this.toRecord(parametros));
    const dateFilter = this.buildDateFilter(
      parsed.fechaDesde,
      parsed.fechaHasta,
    );

    const rows = await this.prisma.habilidadOferta.findMany({
      where: {
        oferta: {
          is: {
            ...(parsed.modalidad ? { modalidad: parsed.modalidad } : {}),
            ...(dateFilter
              ? {
                  OR: [
                    {
                      publicadoEn: dateFilter,
                    },
                    {
                      AND: [{ publicadoEn: null }, { creadoEn: dateFilter }],
                    },
                  ],
                }
              : {}),
          },
        },
      },
      select: {
        habilidadId: true,
        habilidad: {
          select: {
            nombre: true,
            tipo: true,
            categoria: true,
          },
        },
      },
    });

    const grouped = new Map<
      string,
      { habilidad: string; tipo: string; categoria: string; total: number }
    >();

    for (const row of rows) {
      const current = grouped.get(row.habilidadId) ?? {
        habilidad: row.habilidad.nombre,
        tipo: row.habilidad.tipo,
        categoria: row.habilidad.categoria ?? '-',
        total: 0,
      };
      current.total += 1;
      grouped.set(row.habilidadId, current);
    }

    const ordered = [...grouped.values()].sort((a, b) => b.total - a.total);

    return {
      title: 'Reporte de Demanda Laboral',
      subtitle: 'Habilidades mas solicitadas en ofertas laborales',
      sections: [
        {
          heading: 'Resumen',
          metrics: [
            { label: 'Habilidades analizadas', value: ordered.length },
            { label: 'Registros de demanda', value: rows.length },
          ],
        },
        {
          heading: 'Ranking',
          rows: ordered.map((row) => ({
            habilidad: row.habilidad,
            tipo: row.tipo,
            categoria: row.categoria,
            totalOfertas: row.total,
          })),
        },
      ],
    };
  }

  private async buildComparativoCohortesReport(
    parametros: Prisma.JsonValue | null,
  ) {
    const parsed = comparativoCohortesParamsSchema.parse(
      this.toRecord(parametros),
    );

    const egresados = await this.prisma.egresado.findMany({
      where: {
        ...(parsed.carreraId ? { carreraId: parsed.carreraId } : {}),
        ...(parsed.anios && parsed.anios.length > 0
          ? {
              anioEgreso: {
                in: parsed.anios,
              },
            }
          : {}),
      },
      select: {
        id: true,
        anioEgreso: true,
      },
    });

    const contratados = await this.prisma.postulacion.findMany({
      where: {
        estado: EstadoPostulacion.CONTRATADO,
        ...(parsed.carreraId || (parsed.anios && parsed.anios.length > 0)
          ? {
              egresado: {
                is: {
                  ...(parsed.carreraId ? { carreraId: parsed.carreraId } : {}),
                  ...(parsed.anios && parsed.anios.length > 0
                    ? {
                        anioEgreso: {
                          in: parsed.anios,
                        },
                      }
                    : {}),
                },
              },
            }
          : {}),
      },
      distinct: ['egresadoId'],
      select: {
        egresadoId: true,
      },
    });

    const contratadosSet = new Set(contratados.map((item) => item.egresadoId));
    const grouped = new Map<
      string,
      { anioEgreso: number | null; totalEgresados: number; contratados: number }
    >();

    for (const egresado of egresados) {
      const key = String(egresado.anioEgreso ?? 'null');
      const current = grouped.get(key) ?? {
        anioEgreso: egresado.anioEgreso,
        totalEgresados: 0,
        contratados: 0,
      };
      current.totalEgresados += 1;
      if (contratadosSet.has(egresado.id)) {
        current.contratados += 1;
      }
      grouped.set(key, current);
    }

    const rows = [...grouped.values()]
      .map((row) => ({
        anioEgreso: row.anioEgreso ?? '-',
        totalEgresados: row.totalEgresados,
        contratados: row.contratados,
        tasaContratacion: this.percentage(row.contratados, row.totalEgresados),
      }))
      .sort((a, b) => String(a.anioEgreso).localeCompare(String(b.anioEgreso)));

    return {
      title: 'Reporte Comparativo de Cohortes',
      subtitle: 'Comparacion base por anio de egreso',
      sections: [
        {
          heading: 'Resumen',
          metrics: [{ label: 'Cohortes incluidas', value: rows.length }],
        },
        {
          heading: 'Comparativo',
          rows,
        },
      ],
    };
  }

  private countByEstado(
    postulaciones: Array<{
      estado: EstadoPostulacion;
    }>,
  ) {
    const totals = new Map<EstadoPostulacion, number>();

    for (const postulacion of postulaciones) {
      totals.set(postulacion.estado, (totals.get(postulacion.estado) ?? 0) + 1);
    }

    return [
      EstadoPostulacion.POSTULADO,
      EstadoPostulacion.EN_REVISION,
      EstadoPostulacion.ENTREVISTA,
      EstadoPostulacion.CONTRATADO,
      EstadoPostulacion.RECHAZADO,
    ].map((estado) => ({
      label: estado,
      value: totals.get(estado) ?? 0,
    }));
  }

  private buildDownloadUrl(reporteId: string) {
    const base =
      this.configService.get<string>('REPORTS_BASE_URL') ??
      'http://localhost:3001/api/v1/reportes';

    return `${base.replace(/\/$/, '')}/${reporteId}/download`;
  }

  private sanitizeErrorMessage(error: unknown) {
    const fallback = 'No se pudo generar el reporte';

    if (!(error instanceof Error)) {
      return fallback;
    }

    return error.message.slice(0, 500) || fallback;
  }

  private toRecord(parametros: Prisma.JsonValue | null) {
    if (
      !parametros ||
      typeof parametros !== 'object' ||
      Array.isArray(parametros)
    ) {
      return {};
    }

    return parametros as Record<string, unknown>;
  }

  private buildDateFilter(fechaDesde?: Date, fechaHasta?: Date) {
    return {
      ...(fechaDesde ? { gte: fechaDesde } : {}),
      ...(fechaHasta ? { lte: fechaHasta } : {}),
    };
  }

  private percentage(part: number, total: number) {
    if (total <= 0) {
      return 0;
    }

    return Number(((part / total) * 100).toFixed(2));
  }

  private async safeNotify(input: {
    usuarioId: string;
    tipo: TipoNotificacion;
    titulo: string;
    contenido: string;
    metadata: Record<string, unknown>;
  }) {
    try {
      await this.notificacionesService.crearInterna(input);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`No se pudo notificar reporte: ${message}`);
    }
  }
}
