import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, RolUsuario } from '@graduate-employment-management/database';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import {
  buildPaginationMeta,
  normalizePagination,
} from '../common/utils/pagination.util';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import {
  GetAuditoriaByIdInput,
  ListarAuditoriaInput,
} from './schemas/auditoria.schemas';

const usuarioAuditSelect = {
  id: true,
  email: true,
  rol: true,
} satisfies Prisma.UsuarioSelect;

const auditoriaSelect = {
  id: true,
  usuarioId: true,
  accion: true,
  entidad: true,
  entidadId: true,
  datosAnteriores: true,
  datosNuevos: true,
  ip: true,
  userAgent: true,
  creadoEn: true,
  usuario: {
    select: usuarioAuditSelect,
  },
} satisfies Prisma.AuditoriaSelect;

type AuditoriaRecord = Prisma.AuditoriaGetPayload<{
  select: typeof auditoriaSelect;
}>;

type JsonLike =
  | string
  | number
  | boolean
  | null
  | JsonLike[]
  | { [key: string]: JsonLike };

export type RegistrarAuditoriaInput = {
  usuarioId?: string | null;
  accion: string;
  entidad: string;
  entidadId?: string | null;
  datosAnteriores?: unknown;
  datosNuevos?: unknown;
  ip?: string | null;
  userAgent?: string | null;
};

@Injectable()
export class AuditoriaService {
  private readonly logger = new Logger(AuditoriaService.name);
  private readonly sensitiveKeys = new Set([
    'password',
    'passwordHash',
    'token',
    'accessToken',
    'refreshToken',
    'cookie',
    'cookies',
    'secret',
    'proveedorId',
  ]);
  private readonly maxStringLength = 500;
  private readonly maxEntries = 50;
  private readonly maxDepth = 5;
  private readonly maxJsonLength = 4000;

  constructor(private readonly prisma: PrismaService) {}

  async registrar(input: RegistrarAuditoriaInput): Promise<void> {
    await this.prisma.auditoria.create({
      data: {
        usuarioId: input.usuarioId ?? null,
        accion: input.accion.trim(),
        entidad: input.entidad.trim(),
        entidadId: input.entidadId?.trim() ?? null,
        datosAnteriores: this.prepareJsonForStorage(input.datosAnteriores),
        datosNuevos: this.prepareJsonForStorage(input.datosNuevos),
        ip: input.ip?.trim() ?? null,
        userAgent: this.normalizeString(input.userAgent),
      },
    });
  }

  async registrarSeguro(input: RegistrarAuditoriaInput): Promise<void> {
    try {
      await this.registrar(input);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`No se pudo registrar auditoria: ${message}`);
    }
  }

  async listar(
    actor: AuthenticatedUser,
    input: ListarAuditoriaInput,
  ): Promise<PaginatedResponse<ReturnType<AuditoriaService['toSafeView']>>> {
    this.assertAdmin(actor);
    const pagination = normalizePagination(input.page, input.limit);
    const where = this.buildWhere(input);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.auditoria.findMany({
        where,
        select: auditoriaSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: {
          creadoEn: 'desc',
        },
      }),
      this.prisma.auditoria.count({ where }),
    ]);

    return {
      data: data.map((record) => this.toSafeView(record)),
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async getById(
    actor: AuthenticatedUser,
    input: GetAuditoriaByIdInput | string,
  ) {
    this.assertAdmin(actor);
    const id = typeof input === 'string' ? input : input.id;

    const record = await this.prisma.auditoria.findUnique({
      where: { id },
      select: auditoriaSelect,
    });

    if (!record) {
      throw new NotFoundException('Registro de auditoria no encontrado');
    }

    return this.toSafeView(record);
  }

  private assertAdmin(user: AuthenticatedUser) {
    if (user.rol !== RolUsuario.ADMINISTRADOR) {
      throw new ForbiddenException('No tienes acceso a la auditoria');
    }
  }

  private buildWhere(input: ListarAuditoriaInput): Prisma.AuditoriaWhereInput {
    const fechaDesde = this.parseDate(input.fechaDesde);
    const fechaHasta = this.parseDate(input.fechaHasta);

    return {
      ...(input.usuarioId ? { usuarioId: input.usuarioId } : {}),
      ...(input.accion
        ? {
            accion: {
              contains: input.accion.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.entidad
        ? {
            entidad: {
              contains: input.entidad.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.entidadId ? { entidadId: input.entidadId.trim() } : {}),
      ...(fechaDesde || fechaHasta
        ? {
            creadoEn: {
              ...(fechaDesde ? { gte: fechaDesde } : {}),
              ...(fechaHasta ? { lte: fechaHasta } : {}),
            },
          }
        : {}),
    };
  }

  private parseDate(value: Date | undefined) {
    return value instanceof Date && !Number.isNaN(value.getTime())
      ? value
      : undefined;
  }

  private toSafeView(record: AuditoriaRecord) {
    return {
      id: record.id,
      usuarioId: record.usuarioId,
      accion: record.accion,
      entidad: record.entidad,
      entidadId: record.entidadId,
      datosAnteriores: this.sanitizeForRead(record.datosAnteriores),
      datosNuevos: this.sanitizeForRead(record.datosNuevos),
      ip: record.ip,
      userAgent: record.userAgent,
      creadoEn: record.creadoEn,
      usuario: record.usuario,
    };
  }

  private prepareJsonForStorage(
    value: unknown,
  ): Prisma.InputJsonValue | undefined {
    if (value === undefined) {
      return undefined;
    }

    const sanitized = this.sanitizeUnknownValue(value, 0);

    if (sanitized === undefined) {
      return undefined;
    }

    const serialized = JSON.stringify(sanitized);

    if (serialized.length <= this.maxJsonLength) {
      return sanitized as Prisma.InputJsonValue;
    }

    return {
      _truncated: true,
      preview: serialized.slice(0, this.maxJsonLength),
      originalLength: serialized.length,
    } satisfies Prisma.InputJsonObject;
  }

  private sanitizeForRead(value: Prisma.JsonValue | null): JsonLike | null {
    if (value === null) {
      return null;
    }

    return this.sanitizeUnknownValue(value, 0) ?? null;
  }

  private sanitizeUnknownValue(
    value: unknown,
    depth: number,
  ): JsonLike | undefined {
    if (depth > this.maxDepth) {
      return '[MAX_DEPTH_REACHED]';
    }

    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    if (typeof value === 'string') {
      return this.normalizeString(value);
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (Array.isArray(value)) {
      return value
        .slice(0, this.maxEntries)
        .map((item) => this.sanitizeUnknownValue(item, depth + 1) ?? null);
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>).slice(
        0,
        this.maxEntries,
      );
      const result: Record<string, JsonLike> = {};

      for (const [key, nestedValue] of entries) {
        if (this.sensitiveKeys.has(key)) {
          result[key] = '[REDACTED]';
          continue;
        }

        if (key.toLowerCase() === 'dni') {
          result[key] = this.maskSensitiveIdentifier(nestedValue);
          continue;
        }

        const sanitized = this.sanitizeUnknownValue(nestedValue, depth + 1);

        if (sanitized !== undefined) {
          result[key] = sanitized;
        }
      }

      return result;
    }

    return '[UNSUPPORTED_VALUE]';
  }

  private normalizeString(value: string | null | undefined) {
    if (value == null) {
      return value ?? null;
    }

    const trimmed = value.trim();
    return trimmed.slice(0, this.maxStringLength);
  }

  private maskSensitiveIdentifier(value: unknown): string {
    if (typeof value !== 'string') {
      return '[REDACTED]';
    }

    const visible = value.slice(-4);
    return `***${visible}`;
  }
}
