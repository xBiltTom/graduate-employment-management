import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoOferta,
  EstadoPostulacion,
  Prisma,
  RolUsuario,
} from '@graduate-employment-management/database';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AuditoriaService } from '../auditoria/auditoria.service';
import {
  buildPaginationMeta,
  normalizePagination,
  runPaginatedReadQueries,
} from '../common/utils/pagination.util';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  AdminListPostulacionesInput,
  CambiarEstadoPostulacionInput,
  MisPostulacionesInput,
  PostulantesPorOfertaInput,
  PostularInput,
} from './schemas/postulaciones.schemas';

const safeUsuarioSelect = {
  id: true,
  email: true,
  rol: true,
  estado: true,
} satisfies Prisma.UsuarioSelect;

const empresaPublicaSelect = {
  id: true,
  nombreComercial: true,
  ciudad: true,
  region: true,
  pais: true,
} satisfies Prisma.EmpresaSelect;

const ofertaResumenSelect = {
  id: true,
  titulo: true,
  modalidad: true,
  tipoContrato: true,
  ciudad: true,
  region: true,
  pais: true,
  estado: true,
  publicadoEn: true,
  cierreEn: true,
  empresa: {
    select: empresaPublicaSelect,
  },
} satisfies Prisma.OfertaLaboralSelect;

const egresadoPublicoParaEmpresaSelect = {
  id: true,
  nombres: true,
  apellidos: true,
  presentacion: true,
  ciudad: true,
  region: true,
  pais: true,
  anioEgreso: true,
  carrera: {
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      estaActiva: true,
    },
  },
  habilidades: {
    select: {
      nivel: true,
      creadoEn: true,
      habilidad: {
        select: {
          id: true,
          nombre: true,
          tipo: true,
          categoria: true,
        },
      },
    },
    orderBy: {
      creadoEn: 'desc',
    },
  },
  formaciones: {
    select: {
      id: true,
      institucion: true,
      grado: true,
      campo: true,
      fechaInicio: true,
      fechaFin: true,
      esActual: true,
      descripcion: true,
      creadoEn: true,
      actualizadoEn: true,
    },
    orderBy: {
      creadoEn: 'desc',
    },
  },
  experiencias: {
    select: {
      id: true,
      empresa: true,
      cargo: true,
      descripcion: true,
      fechaInicio: true,
      fechaFin: true,
      esActual: true,
      creadoEn: true,
      actualizadoEn: true,
    },
    orderBy: {
      creadoEn: 'desc',
    },
  },
} satisfies Prisma.EgresadoSelect;

const egresadoAdminSelect = {
  ...egresadoPublicoParaEmpresaSelect,
  dni: true,
  telefono: true,
  direccion: true,
  fechaNacimiento: true,
  distrito: true,
  usuario: {
    select: safeUsuarioSelect,
  },
} satisfies Prisma.EgresadoSelect;

const historialSelect = {
  id: true,
  estadoAnterior: true,
  estadoNuevo: true,
  motivo: true,
  creadoEn: true,
  cambiadoPor: {
    select: safeUsuarioSelect,
  },
} satisfies Prisma.HistorialEstadoPostulacionSelect;

const postulacionResumenSelect = {
  id: true,
  estado: true,
  comentario: true,
  postuladoEn: true,
  creadoEn: true,
  actualizadoEn: true,
  oferta: {
    select: ofertaResumenSelect,
  },
} satisfies Prisma.PostulacionSelect;

const postulacionEmpresaDetalleSelect = {
  ...postulacionResumenSelect,
  egresado: {
    select: egresadoPublicoParaEmpresaSelect,
  },
  historial: {
    select: historialSelect,
    orderBy: {
      creadoEn: 'asc',
    },
  },
} satisfies Prisma.PostulacionSelect;

const postulacionEgresadoDetalleSelect = {
  ...postulacionResumenSelect,
  egresado: {
    select: egresadoPublicoParaEmpresaSelect,
  },
  historial: {
    select: historialSelect,
    orderBy: {
      creadoEn: 'asc',
    },
  },
} satisfies Prisma.PostulacionSelect;

const postulacionAdminDetalleSelect = {
  ...postulacionResumenSelect,
  egresado: {
    select: egresadoAdminSelect,
  },
  historial: {
    select: historialSelect,
    orderBy: {
      creadoEn: 'asc',
    },
  },
} satisfies Prisma.PostulacionSelect;

@Injectable()
export class PostulacionesService {
  private readonly logger = new Logger(PostulacionesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificacionesService: NotificacionesService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async postular(egresadoId: string, input: PostularInput) {
    const egresado = await this.ensureEgresadoExists(egresadoId);

    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id: input.ofertaId },
      select: {
        id: true,
        estado: true,
        cierreEn: true,
        titulo: true,
        empresaId: true,
      },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.estado !== EstadoOferta.ACTIVA) {
      throw new BadRequestException('Solo puedes postular a ofertas activas');
    }

    if (oferta.cierreEn && oferta.cierreEn <= new Date()) {
      throw new BadRequestException('La oferta ya no recibe postulaciones');
    }

    const existing = await this.prisma.postulacion.findUnique({
      where: {
        ofertaId_egresadoId: {
          ofertaId: input.ofertaId,
          egresadoId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      throw new ConflictException('Ya postulaste a esta oferta');
    }

    let postulacionId = '';
    await this.prisma.$transaction(async (tx) => {
      const postulacion = await tx.postulacion.create({
        data: {
          ofertaId: input.ofertaId,
          egresadoId,
          estado: EstadoPostulacion.POSTULADO,
          comentario: input.mensaje?.trim() ?? null,
        },
        select: {
          id: true,
        },
      });

      postulacionId = postulacion.id;

      await tx.historialEstadoPostulacion.create({
        data: {
          postulacionId,
          estadoAnterior: null,
          estadoNuevo: EstadoPostulacion.POSTULADO,
          cambiadoPorId: egresadoId,
        },
      });
    });

    await this.safeNotify(() =>
      this.notificacionesService.notificarNuevaPostulacion({
        empresaUsuarioId: oferta.empresaId,
        ofertaId: oferta.id,
        postulacionId,
        tituloOferta: oferta.titulo,
        nombreEgresado: `${egresado.nombres} ${egresado.apellidos}`.trim(),
      }),
    );

    const created = await this.getById(postulacionId, {
      id: egresadoId,
      email: '',
      rol: RolUsuario.EGRESADO,
    });

    await this.auditoriaService.registrarSeguro({
      usuarioId: egresadoId,
      accion: 'POSTULACION_CREADA',
      entidad: 'Postulacion',
      entidadId: postulacionId,
      datosNuevos: {
        ofertaId: oferta.id,
        egresadoId,
        estado: EstadoPostulacion.POSTULADO,
      },
    });

    return created;
  }

  async misPostulaciones(egresadoId: string, input: MisPostulacionesInput) {
    const pagination = normalizePagination(input.page, input.limit);
    const where: Prisma.PostulacionWhereInput = {
      egresadoId,
      ...(input.estado ? { estado: input.estado } : {}),
    };

    const [data, total] = await runPaginatedReadQueries(
      this.prisma.postulacion.findMany({
        where,
        select: postulacionResumenSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ postuladoEn: 'desc' }, { creadoEn: 'desc' }],
      }),
      this.prisma.postulacion.count({ where }),
    );

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async getById(id: string, viewer: AuthenticatedUser) {
    const accessData = await this.getPostulacionAccessData(id);

    if (!this.canViewPostulacion(accessData, viewer)) {
      throw new ForbiddenException('No tienes acceso a esta postulacion');
    }

    if (viewer.rol === RolUsuario.ADMINISTRADOR) {
      return this.getPostulacionOrFail(id, postulacionAdminDetalleSelect);
    }

    if (viewer.rol === RolUsuario.EMPRESA) {
      return this.getPostulacionOrFail(id, postulacionEmpresaDetalleSelect);
    }

    return this.getPostulacionOrFail(id, postulacionEgresadoDetalleSelect);
  }

  async postulantesPorOferta(
    empresaId: string,
    input: PostulantesPorOfertaInput,
  ) {
    await this.assertEmpresaOwnsOferta(empresaId, input.ofertaId);
    const pagination = normalizePagination(input.page, input.limit);
    const where: Prisma.PostulacionWhereInput = {
      ofertaId: input.ofertaId,
      ...(input.estado ? { estado: input.estado } : {}),
    };

    // TODO: auditar consulta de postulantes por empresa.
    const [data, total] = await runPaginatedReadQueries(
      this.prisma.postulacion.findMany({
        where,
        select: {
          id: true,
          estado: true,
          comentario: true,
          postuladoEn: true,
          creadoEn: true,
          actualizadoEn: true,
          egresado: {
            select: egresadoPublicoParaEmpresaSelect,
          },
          oferta: {
            select: ofertaResumenSelect,
          },
        },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ postuladoEn: 'desc' }, { creadoEn: 'desc' }],
      }),
      this.prisma.postulacion.count({ where }),
    );

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async cambiarEstado(
    actor: AuthenticatedUser,
    input: CambiarEstadoPostulacionInput,
  ) {
    const postulacion = await this.prisma.postulacion.findUnique({
      where: { id: input.postulacionId },
      select: {
        id: true,
        estado: true,
        egresadoId: true,
        oferta: {
          select: {
            id: true,
            empresaId: true,
            titulo: true,
          },
        },
      },
    });

    if (!postulacion) {
      throw new NotFoundException('Postulacion no encontrada');
    }

    if (
      actor.rol === RolUsuario.EMPRESA &&
      postulacion.oferta.empresaId !== actor.id
    ) {
      throw new ForbiddenException(
        'No puedes cambiar el estado de esta postulacion',
      );
    }

    if (postulacion.estado === input.nuevoEstado) {
      throw new BadRequestException('La postulacion ya tiene ese estado');
    }

    this.assertTransitionPermitida(postulacion.estado, input.nuevoEstado);
    await this.prisma.$transaction(async (tx) => {
      await tx.postulacion.update({
        where: { id: input.postulacionId },
        data: {
          estado: input.nuevoEstado,
        },
      });

      await tx.historialEstadoPostulacion.create({
        data: {
          postulacionId: input.postulacionId,
          estadoAnterior: postulacion.estado,
          estadoNuevo: input.nuevoEstado,
          motivo: input.motivo?.trim() ?? null,
          cambiadoPorId: actor.id,
        },
      });
    });

    await this.safeNotify(() =>
      this.notificacionesService.notificarCambioEstadoPostulacion({
        egresadoUsuarioId: postulacion.egresadoId,
        postulacionId: input.postulacionId,
        ofertaId: postulacion.oferta.id,
        tituloOferta: postulacion.oferta.titulo,
        nuevoEstado: input.nuevoEstado,
      }),
    );

    const updated = await this.getById(input.postulacionId, actor);

    await this.auditoriaService.registrarSeguro({
      usuarioId: actor.id,
      accion: 'POSTULACION_ESTADO_CAMBIADO',
      entidad: 'Postulacion',
      entidadId: input.postulacionId,
      datosAnteriores: {
        estado: postulacion.estado,
      },
      datosNuevos: {
        estado: input.nuevoEstado,
        motivo: input.motivo?.trim() ?? null,
      },
    });

    return updated;
  }

  async historial(postulacionId: string, viewer: AuthenticatedUser) {
    await this.getById(postulacionId, viewer);

    return this.prisma.historialEstadoPostulacion.findMany({
      where: { postulacionId },
      select: historialSelect,
      orderBy: {
        creadoEn: 'asc',
      },
    });
  }

  async adminList(input: AdminListPostulacionesInput) {
    const pagination = normalizePagination(input.page, input.limit);
    const dateRange = this.parseDateRange(input.fechaDesde, input.fechaHasta);
    const where: Prisma.PostulacionWhereInput = {
      ...(input.estado ? { estado: input.estado } : {}),
      ...(input.ofertaId ? { ofertaId: input.ofertaId } : {}),
      ...(input.egresadoId ? { egresadoId: input.egresadoId } : {}),
      ...(input.empresaId
        ? {
            oferta: {
              is: {
                empresaId: input.empresaId,
              },
            },
          }
        : {}),
      ...(dateRange ? { postuladoEn: dateRange } : {}),
    };

    // TODO: auditar consulta administrativa de postulaciones.
    const [data, total] = await runPaginatedReadQueries(
      this.prisma.postulacion.findMany({
        where,
        select: {
          id: true,
          estado: true,
          comentario: true,
          postuladoEn: true,
          creadoEn: true,
          actualizadoEn: true,
          egresado: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              ciudad: true,
              region: true,
              pais: true,
              anioEgreso: true,
              carrera: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
          oferta: {
            select: ofertaResumenSelect,
          },
        },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ postuladoEn: 'desc' }, { creadoEn: 'desc' }],
      }),
      this.prisma.postulacion.count({ where }),
    );

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  private assertTransitionPermitida(
    actual: EstadoPostulacion,
    nuevo: EstadoPostulacion,
  ) {
    const allowedTransitions: Record<EstadoPostulacion, EstadoPostulacion[]> = {
      [EstadoPostulacion.POSTULADO]: [
        EstadoPostulacion.EN_REVISION,
        EstadoPostulacion.RECHAZADO,
      ],
      [EstadoPostulacion.EN_REVISION]: [
        EstadoPostulacion.ENTREVISTA,
        EstadoPostulacion.RECHAZADO,
      ],
      [EstadoPostulacion.ENTREVISTA]: [
        EstadoPostulacion.CONTRATADO,
        EstadoPostulacion.RECHAZADO,
      ],
      [EstadoPostulacion.CONTRATADO]: [],
      [EstadoPostulacion.RECHAZADO]: [],
    };

    if (!allowedTransitions[actual].includes(nuevo)) {
      throw new BadRequestException(
        `Transicion no permitida de ${actual} a ${nuevo}`,
      );
    }
  }

  private canViewPostulacion(
    postulacion: {
      egresadoId: string;
      oferta: { empresaId: string };
    },
    viewer: AuthenticatedUser,
  ) {
    if (viewer.rol === RolUsuario.ADMINISTRADOR) {
      return true;
    }

    if (viewer.rol === RolUsuario.EGRESADO) {
      return postulacion.egresadoId === viewer.id;
    }

    if (viewer.rol === RolUsuario.EMPRESA) {
      return postulacion.oferta.empresaId === viewer.id;
    }

    return false;
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

  private async ensureEgresadoExists(egresadoId: string) {
    const egresado = await this.prisma.egresado.findUnique({
      where: { id: egresadoId },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
      },
    });

    if (!egresado) {
      throw new NotFoundException('Perfil de egresado no encontrado');
    }

    return egresado;
  }

  private async getPostulacionAccessData(id: string) {
    const postulacion = await this.prisma.postulacion.findUnique({
      where: { id },
      select: {
        id: true,
        egresadoId: true,
        oferta: {
          select: {
            empresaId: true,
          },
        },
      },
    });

    if (!postulacion) {
      throw new NotFoundException('Postulacion no encontrada');
    }

    return postulacion;
  }

  private async getPostulacionOrFail<T extends Prisma.PostulacionSelect>(
    id: string,
    select: T,
  ) {
    const postulacion = await this.prisma.postulacion.findUnique({
      where: { id },
      select,
    });

    if (!postulacion) {
      throw new NotFoundException('Postulacion no encontrada');
    }

    return postulacion;
  }

  private parseDateRange(
    fechaDesde: string | Date | undefined,
    fechaHasta: string | Date | undefined,
  ) {
    const desde = this.parseDate(fechaDesde);
    const hasta = this.parseDate(fechaHasta);

    if (desde && hasta && hasta < desde) {
      throw new BadRequestException(
        'La fechaHasta no puede ser anterior a fechaDesde',
      );
    }

    if (!desde && !hasta) {
      return null;
    }

    return {
      ...(desde ? { gte: desde } : {}),
      ...(hasta ? { lte: hasta } : {}),
    };
  }

  private parseDate(value: string | Date | undefined) {
    if (value === undefined) {
      return undefined;
    }

    const parsed = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('La fecha enviada no es valida');
    }

    return parsed;
  }

  private async safeNotify(callback: () => Promise<unknown>) {
    try {
      await callback();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`No se pudo crear notificacion: ${message}`);
    }
  }
}
