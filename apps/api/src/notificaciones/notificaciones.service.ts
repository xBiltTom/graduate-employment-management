import {
  CanalNotificacion,
  Prisma,
  TipoNotificacion,
} from '@graduate-employment-management/database';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  buildPaginationMeta,
  normalizePagination,
} from '../common/utils/pagination.util';
import {
  AdminCrearSistemaInput,
  MisNotificacionesInput,
} from './schemas/notificaciones.schemas';
import { MailService } from './services/mail.service';
import { PrismaService } from '../prisma/prisma.service';

type InternalNotificationInput = {
  usuarioId: string;
  tipo: TipoNotificacion;
  titulo: string;
  contenido: string;
  metadata?: Record<string, unknown>;
};

type SanitizedJsonValue =
  | string
  | number
  | boolean
  | null
  | SanitizedJsonValue[]
  | SanitizedJsonObject;

type SanitizedJsonObject = {
  [key: string]: SanitizedJsonValue;
};

const notificationSelect = {
  id: true,
  usuarioId: true,
  tipo: true,
  canal: true,
  titulo: true,
  contenido: true,
  leida: true,
  metadata: true,
  creadoEn: true,
  leidaEn: true,
} satisfies Prisma.NotificacionSelect;

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async misNotificaciones(userId: string, input: MisNotificacionesInput) {
    const pagination = normalizePagination(input.page, input.limit);
    const where: Prisma.NotificacionWhereInput = {
      usuarioId: userId,
      ...(input.leida !== undefined ? { leida: input.leida } : {}),
      ...(input.tipo ? { tipo: input.tipo } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.notificacion.findMany({
        where,
        select: notificationSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: {
          creadoEn: 'desc',
        },
      }),
      this.prisma.notificacion.count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async noLeidasCount(userId: string) {
    const count = await this.prisma.notificacion.count({
      where: {
        usuarioId: userId,
        leida: false,
      },
    });

    return {
      count,
    };
  }

  async getById(userId: string, id: string) {
    const notificacion = await this.prisma.notificacion.findUnique({
      where: { id },
      select: notificationSelect,
    });

    if (!notificacion) {
      throw new NotFoundException('Notificacion no encontrada');
    }

    if (notificacion.usuarioId !== userId) {
      throw new ForbiddenException('No tienes acceso a esta notificacion');
    }

    return notificacion;
  }

  async marcarLeida(userId: string, id: string) {
    const notificacion = await this.getById(userId, id);

    if (notificacion.leida) {
      return notificacion;
    }

    return this.prisma.notificacion.update({
      where: { id },
      data: {
        leida: true,
        leidaEn: new Date(),
      },
      select: notificationSelect,
    });
  }

  async marcarTodasLeidas(userId: string) {
    const result = await this.prisma.notificacion.updateMany({
      where: {
        usuarioId: userId,
        leida: false,
      },
      data: {
        leida: true,
        leidaEn: new Date(),
      },
    });

    return {
      updated: result.count,
    };
  }

  async adminCrearSistema(input: AdminCrearSistemaInput) {
    await this.ensureUserExists(input.usuarioId);

    return this.crearInterna({
      usuarioId: input.usuarioId,
      tipo: TipoNotificacion.SISTEMA,
      titulo: input.titulo.trim(),
      contenido: input.contenido.trim(),
      metadata: input.metadata,
    });
  }

  async crearInterna(input: InternalNotificationInput) {
    const user = await this.ensureUserExists(input.usuarioId);
    const metadata = this.sanitizeMetadata(input.metadata);

    const notification = await this.prisma.notificacion.create({
      data: {
        usuarioId: input.usuarioId,
        tipo: input.tipo,
        canal: CanalNotificacion.INTERNA,
        titulo: input.titulo.trim(),
        contenido: input.contenido.trim(),
        leida: false,
        metadata,
      },
      select: notificationSelect,
    });

    await this.safeSendEmail({
      to: user.email,
      subject: input.titulo,
      html: `<p>${input.contenido}</p>`,
      text: input.contenido,
    });

    return notification;
  }

  async notificarEmpresaValidada(input: {
    empresaUsuarioId: string;
    aprobada: boolean;
    motivoRechazo?: string | null;
  }) {
    return this.crearInterna({
      usuarioId: input.empresaUsuarioId,
      tipo: TipoNotificacion.EMPRESA_VALIDADA,
      titulo: input.aprobada ? 'Empresa aprobada' : 'Empresa rechazada',
      contenido: input.aprobada
        ? 'Tu empresa fue aprobada. Ya puedes publicar ofertas laborales.'
        : 'Tu empresa fue rechazada. Revisa el motivo indicado.',
      metadata: input.aprobada
        ? undefined
        : { motivoRechazo: input.motivoRechazo ?? null },
    });
  }

  async notificarOfertaModerada(input: {
    empresaUsuarioId: string;
    ofertaId: string;
    tituloOferta: string;
    aprobada: boolean;
  }) {
    return this.crearInterna({
      usuarioId: input.empresaUsuarioId,
      tipo: input.aprobada
        ? TipoNotificacion.NUEVA_OFERTA
        : TipoNotificacion.SISTEMA,
      titulo: input.aprobada ? 'Oferta aprobada' : 'Oferta rechazada',
      contenido: input.aprobada
        ? `Tu oferta "${input.tituloOferta}" fue aprobada y ya esta visible.`
        : `Tu oferta "${input.tituloOferta}" fue rechazada.`,
      metadata: {
        ofertaId: input.ofertaId,
      },
    });
  }

  async notificarNuevaPostulacion(input: {
    empresaUsuarioId: string;
    ofertaId: string;
    postulacionId: string;
    tituloOferta: string;
    nombreEgresado: string;
  }) {
    return this.crearInterna({
      usuarioId: input.empresaUsuarioId,
      tipo: TipoNotificacion.POSTULACION_CREADA,
      titulo: 'Nueva postulacion',
      contenido: `${input.nombreEgresado} postulo a "${input.tituloOferta}".`,
      metadata: {
        ofertaId: input.ofertaId,
        postulacionId: input.postulacionId,
      },
    });
  }

  async notificarCambioEstadoPostulacion(input: {
    egresadoUsuarioId: string;
    postulacionId: string;
    ofertaId: string;
    tituloOferta: string;
    nuevoEstado: string;
  }) {
    return this.crearInterna({
      usuarioId: input.egresadoUsuarioId,
      tipo: TipoNotificacion.ESTADO_POSTULACION_CAMBIADO,
      titulo: 'Estado de postulacion actualizado',
      contenido: `Tu postulacion a "${input.tituloOferta}" cambio a ${input.nuevoEstado}.`,
      metadata: {
        ofertaId: input.ofertaId,
        postulacionId: input.postulacionId,
        nuevoEstado: input.nuevoEstado,
      },
    });
  }

  private async ensureUserExists(usuarioId: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  private sanitizeMetadata(
    metadata?: Record<string, unknown>,
  ): Prisma.InputJsonObject | undefined {
    if (!metadata) {
      return undefined;
    }

    const bannedKeys = [
      'password',
      'passwordHash',
      'token',
      'refreshToken',
      'accessToken',
      'cookie',
      'cookies',
      'secret',
      'proveedorId',
    ];

    const sanitizeValue = (value: unknown): SanitizedJsonValue => {
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

      if (Array.isArray(value)) {
        return value.map((item) => sanitizeValue(item));
      }

      if (value && typeof value === 'object') {
        const result: SanitizedJsonObject = {};

        for (const [key, nestedValue] of Object.entries(
          value as Record<string, unknown>,
        )) {
          if (
            bannedKeys.some(
              (bannedKey) => bannedKey.toLowerCase() === key.toLowerCase(),
            )
          ) {
            continue;
          }

          result[key] = sanitizeValue(nestedValue);
        }

        return result;
      }

      return null;
    };

    return sanitizeValue(metadata) as Prisma.InputJsonObject;
  }

  private async safeSendEmail(input: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    try {
      await this.mailService.sendTransactionalEmail(input);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(
        `No se pudo enviar email transaccional a ${input.to}: ${message}`,
      );
    }
  }
}
