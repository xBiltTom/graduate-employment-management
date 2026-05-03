import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoReporte,
  ModalidadOferta,
  Prisma,
  RolUsuario,
  TipoReporte,
} from '@graduate-employment-management/database';
import { z } from 'zod';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import {
  buildPaginationMeta,
  normalizePagination,
} from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import {
  MisReportesInput,
  SolicitarReporteInput,
} from './schemas/reportes.schemas';
import { ReportsJobService } from './services/reports-job.service';
import { ReportsStorageService } from './services/reports-storage.service';

const reporteSelect = {
  id: true,
  usuarioId: true,
  tipo: true,
  estado: true,
  parametros: true,
  mensajeError: true,
  nombreArchivo: true,
  creadoEn: true,
  iniciadoEn: true,
  completadoEn: true,
  archivo: {
    select: {
      id: true,
      nombreArchivo: true,
      mimeType: true,
      tamanio: true,
    },
  },
} satisfies Prisma.ReporteSelect;

const solicitarOfertaParamsSchema = z.object({
  ofertaId: z.string().uuid(),
});

const egresadosPorCarreraParamsSchema = z.object({
  carreraId: z.string().uuid().optional(),
  anioEgreso: z.number().int().optional(),
});

const ofertasActivasParamsSchema = z.object({
  modalidad: z.nativeEnum(ModalidadOferta).optional(),
  ciudad: z.string().trim().min(1).optional(),
  region: z.string().trim().min(1).optional(),
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
export class ReportesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reportsJobService: ReportsJobService,
    private readonly reportsStorageService: ReportsStorageService,
  ) {}

  async solicitar(user: AuthenticatedUser, input: SolicitarReporteInput) {
    const parametros = await this.assertCanGenerateTipoReporte(
      user,
      input.tipo,
      input.parametros,
    );

    const reporte = await this.prisma.reporte.create({
      data: {
        usuarioId: user.id,
        tipo: input.tipo,
        estado: EstadoReporte.PENDIENTE,
        parametros,
      },
      select: {
        id: true,
      },
    });

    await this.reportsJobService.processReport(reporte.id);

    return this.getById(user, reporte.id);
  }

  async misReportes(userId: string, input: MisReportesInput) {
    const pagination = normalizePagination(input.page, input.limit);
    const where: Prisma.ReporteWhereInput = {
      usuarioId: userId,
      ...(input.tipo ? { tipo: input.tipo } : {}),
      ...(input.estado ? { estado: input.estado } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.reporte.findMany({
        where,
        select: reporteSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: {
          creadoEn: 'desc',
        },
      }),
      this.prisma.reporte.count({ where }),
    ]);

    return {
      data: data.map((reporte) => this.toSafeReporteView(reporte)),
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async getById(user: AuthenticatedUser, id: string) {
    const reporte = await this.prisma.reporte.findUnique({
      where: { id },
      select: reporteSelect,
    });

    if (!reporte) {
      throw new NotFoundException('Reporte no encontrado');
    }

    this.assertCanAccessReporte(user, reporte);

    return this.toSafeReporteView(reporte);
  }

  async reintentar(user: AuthenticatedUser, id: string) {
    const reporte = await this.prisma.reporte.findUnique({
      where: { id },
      select: reporteSelect,
    });

    if (!reporte) {
      throw new NotFoundException('Reporte no encontrado');
    }

    this.assertCanAccessReporte(user, reporte);

    if (reporte.estado !== EstadoReporte.FALLIDO) {
      throw new BadRequestException(
        'Solo se pueden reintentar reportes fallidos',
      );
    }

    await this.prisma.reporte.update({
      where: { id },
      data: {
        estado: EstadoReporte.PENDIENTE,
        mensajeError: null,
        iniciadoEn: null,
        completadoEn: null,
      },
    });

    await this.reportsJobService.processReport(id);

    return this.getById(user, id);
  }

  async download(user: AuthenticatedUser, id: string) {
    const reporte = await this.prisma.reporte.findUnique({
      where: { id },
      select: {
        ...reporteSelect,
        archivo: {
          select: {
            id: true,
            nombreArchivo: true,
            key: true,
            mimeType: true,
            tamanio: true,
          },
        },
      },
    });

    if (!reporte) {
      throw new NotFoundException('Reporte no encontrado');
    }

    this.assertCanAccessReporte(user, reporte);

    if (reporte.estado !== EstadoReporte.COMPLETADO) {
      throw new BadRequestException(
        'El reporte todavia no esta disponible para descarga',
      );
    }

    if (!reporte.archivo?.key) {
      throw new NotFoundException('Archivo de reporte no encontrado');
    }

    const filePath = await this.reportsStorageService.resolveExistingReportPath(
      reporte.archivo.key,
    );

    return {
      path: filePath,
      filename: reporte.archivo.nombreArchivo,
      mimeType: reporte.archivo.mimeType,
    };
  }

  assertCanAccessReporte(
    user: AuthenticatedUser,
    reporte: {
      usuarioId: string;
    },
  ) {
    if (user.rol === RolUsuario.ADMINISTRADOR) {
      return;
    }

    if (reporte.usuarioId !== user.id) {
      throw new ForbiddenException('No tienes acceso a este reporte');
    }
  }

  async assertCanGenerateTipoReporte(
    user: AuthenticatedUser,
    tipo: TipoReporte,
    parametros?: Record<string, unknown>,
  ): Promise<Prisma.InputJsonObject | undefined> {
    const sanitized = this.sanitizeParametros(parametros);

    if (user.rol === RolUsuario.EGRESADO) {
      throw new ForbiddenException(
        'Tu rol no puede generar este tipo de reporte',
      );
    }

    if (user.rol === RolUsuario.EMPRESA) {
      if (tipo !== TipoReporte.POSTULACIONES_POR_OFERTA) {
        throw new ForbiddenException(
          'Tu rol solo puede generar reportes de postulaciones por oferta propia',
        );
      }

      const parsed = solicitarOfertaParamsSchema.parse(parametros ?? {});
      await this.assertEmpresaOwnsOferta(user.id, parsed.ofertaId);
      return sanitized;
    }

    switch (tipo) {
      case TipoReporte.EGRESADOS_POR_CARRERA:
        egresadosPorCarreraParamsSchema.parse(parametros ?? {});
        break;
      case TipoReporte.OFERTAS_ACTIVAS:
        ofertasActivasParamsSchema.parse(parametros ?? {});
        break;
      case TipoReporte.POSTULACIONES_POR_OFERTA: {
        const parsed = solicitarOfertaParamsSchema.parse(parametros ?? {});
        await this.ensureOfertaExists(parsed.ofertaId);
        break;
      }
      case TipoReporte.EMPLEABILIDAD:
        empleabilidadParamsSchema.parse(parametros ?? {});
        break;
      case TipoReporte.DEMANDA_LABORAL:
        demandaLaboralParamsSchema.parse(parametros ?? {});
        break;
      case TipoReporte.COMPARATIVO_COHORTES:
        comparativoCohortesParamsSchema.parse(parametros ?? {});
        break;
      default:
        throw new ForbiddenException('Tipo de reporte no permitido');
    }

    return sanitized;
  }

  private toSafeReporteView(
    reporte: Prisma.ReporteGetPayload<{
      select: typeof reporteSelect;
    }>,
  ) {
    return {
      ...reporte,
      downloadUrl:
        reporte.estado === EstadoReporte.COMPLETADO
          ? `/api/v1/reportes/${reporte.id}/download`
          : null,
    };
  }

  private sanitizeParametros(
    parametros?: Record<string, unknown>,
  ): Prisma.InputJsonObject | undefined {
    if (!parametros) {
      return undefined;
    }

    const sanitizeValue = (value: unknown): Prisma.InputJsonValue | null => {
      if (value === null) {
        return null;
      }

      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        return value;
      }

      if (value instanceof Date) {
        return value.toISOString();
      }

      if (Array.isArray(value)) {
        return value.map((item) => sanitizeValue(item));
      }

      if (value && typeof value === 'object') {
        const result: Record<string, Prisma.InputJsonValue | null> = {};

        for (const [key, nested] of Object.entries(value)) {
          result[key] = sanitizeValue(nested);
        }

        return result;
      }

      return null;
    };

    return sanitizeValue(parametros) as Prisma.InputJsonObject;
  }

  private async assertEmpresaOwnsOferta(empresaId: string, ofertaId: string) {
    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id: ofertaId },
      select: {
        id: true,
        empresaId: true,
      },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.empresaId !== empresaId) {
      throw new ForbiddenException('No tienes acceso a esta oferta');
    }
  }

  private async ensureOfertaExists(ofertaId: string) {
    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id: ofertaId },
      select: { id: true },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }
  }
}
