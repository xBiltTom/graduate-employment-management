import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoOferta,
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
import { EmpresasService } from '../empresas/empresas.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  AdminListOfertasInput,
  AdminModerarOfertaInput,
  CreateOfertaInput,
  FeedOfertasInput,
  MisOfertasInput,
  UpdateOfertaInput,
} from './schemas/ofertas.schemas';

const publicEmpresaSelect = {
  id: true,
  nombreComercial: true,
  descripcion: true,
  sitioWeb: true,
  ciudad: true,
  region: true,
  pais: true,
  sector: {
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      estaActivo: true,
    },
  },
} satisfies Prisma.EmpresaSelect;

const habilidadOfertaSelect = {
  requerida: true,
  creadoEn: true,
  habilidad: {
    select: {
      id: true,
      nombre: true,
      tipo: true,
      categoria: true,
    },
  },
} satisfies Prisma.HabilidadOfertaSelect;

const publicOfertaSelect = {
  id: true,
  titulo: true,
  descripcion: true,
  vacantes: true,
  modalidad: true,
  tipoContrato: true,
  salarioMin: true,
  salarioMax: true,
  ciudad: true,
  region: true,
  pais: true,
  distrito: true,
  direccion: true,
  estado: true,
  publicadoEn: true,
  cierreEn: true,
  creadoEn: true,
  actualizadoEn: true,
  empresa: {
    select: publicEmpresaSelect,
  },
  habilidades: {
    select: habilidadOfertaSelect,
    orderBy: {
      creadoEn: 'desc',
    },
  },
} satisfies Prisma.OfertaLaboralSelect;

const privateOfertaSelect = {
  ...publicOfertaSelect,
  _count: {
    select: {
      postulaciones: true,
    },
  },
} satisfies Prisma.OfertaLaboralSelect;

@Injectable()
export class OfertasService {
  private readonly logger = new Logger(OfertasService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly empresasService: EmpresasService,
    private readonly notificacionesService: NotificacionesService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async feed(input: FeedOfertasInput, viewer: AuthenticatedUser) {
    const pagination = normalizePagination(input.page, input.limit);
    const where = this.buildFeedWhere(input, viewer);
    const select =
      viewer.rol === RolUsuario.ADMINISTRADOR
        ? privateOfertaSelect
        : publicOfertaSelect;

    const [data, total] = await runPaginatedReadQueries(
      this.prisma.ofertaLaboral.findMany({
        where,
        select,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ publicadoEn: 'desc' }, { creadoEn: 'desc' }],
      }),
      this.prisma.ofertaLaboral.count({ where }),
    );

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async publicFeed(input: FeedOfertasInput) {
    const pagination = normalizePagination(input.page, input.limit);
    const where = this.buildPublicFeedWhere(input);

    const [data, total] = await runPaginatedReadQueries(
      this.prisma.ofertaLaboral.findMany({
        where,
        select: publicOfertaSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ publicadoEn: 'desc' }, { creadoEn: 'desc' }],
      }),
      this.prisma.ofertaLaboral.count({ where }),
    );

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async getById(id: string, viewer: AuthenticatedUser) {
    if (viewer.rol === RolUsuario.ADMINISTRADOR) {
      return this.getOfertaOrFail(id, privateOfertaSelect);
    }

    if (viewer.rol === RolUsuario.EMPRESA) {
      const propia = await this.prisma.ofertaLaboral.findUnique({
        where: { id },
        select: privateOfertaSelect,
      });

      if (!propia) {
        throw new NotFoundException('Oferta no encontrada');
      }

      if (propia.empresa.id === viewer.id) {
        return propia;
      }

      if (!this.isOfertaPublica(propia.estado)) {
        throw new ForbiddenException('No tienes acceso a esta oferta');
      }

      const publica = await this.prisma.ofertaLaboral.findUnique({
        where: { id },
        select: publicOfertaSelect,
      });

      if (!publica) {
        throw new NotFoundException('Oferta no encontrada');
      }

      return publica;
    }

    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id },
      select: publicOfertaSelect,
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (!this.isOfertaPublica(oferta.estado)) {
      throw new ForbiddenException('No tienes acceso a esta oferta');
    }

    return oferta;
  }

  async publicGetById(id: string) {
    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id },
      select: publicOfertaSelect,
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (!this.isOfertaPublica(oferta.estado)) {
      throw new ForbiddenException('No tienes acceso a esta oferta');
    }

    return oferta;
  }

  async misOfertas(empresaId: string, input: MisOfertasInput) {
    const pagination = normalizePagination(input.page, input.limit);
    const where = this.buildMisOfertasWhere(empresaId, input);

    const [data, total] = await runPaginatedReadQueries(
      this.prisma.ofertaLaboral.findMany({
        where,
        select: privateOfertaSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ actualizadoEn: 'desc' }, { creadoEn: 'desc' }],
      }),
      this.prisma.ofertaLaboral.count({ where }),
    );

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async create(empresaId: string, input: CreateOfertaInput) {
    await this.empresasService.assertEmpresaAprobada(empresaId);
    this.validateSalaryRange(input.salarioMin, input.salarioMax);
    const cierreEn = this.parseOptionalFutureDate(input.cierreEn);
    this.ensureNoDuplicateHabilidades(input.habilidadIds);
    await this.ensureHabilidadesExist(input.habilidadIds);

    let ofertaId = '';

    // TODO: notificar a administradores sobre oferta pendiente de revision.
    await this.prisma.$transaction(async (tx) => {
      const oferta = await tx.ofertaLaboral.create({
        data: {
          empresaId,
          titulo: input.titulo.trim(),
          descripcion: input.descripcion.trim(),
          modalidad: input.modalidad,
          tipoContrato: input.tipoContrato,
          ciudad: input.ciudad?.trim() ?? null,
          region: input.region?.trim() ?? null,
          pais: input.pais?.trim() ?? null,
          salarioMin: input.salarioMin ?? null,
          salarioMax: input.salarioMax ?? null,
          cierreEn,
          estado: EstadoOferta.PENDIENTE_REVISION,
        },
        select: {
          id: true,
        },
      });

      ofertaId = oferta.id;

      if (input.habilidadIds && input.habilidadIds.length > 0) {
        await tx.habilidadOferta.createMany({
          data: input.habilidadIds.map((habilidadId) => ({
            ofertaId: oferta.id,
            habilidadId,
            requerida: true,
          })),
        });
      }
    });

    const created = await this.getById(ofertaId, {
      id: empresaId,
      email: '',
      rol: RolUsuario.EMPRESA,
    });

    await this.auditoriaService.registrarSeguro({
      usuarioId: empresaId,
      accion: 'OFERTA_CREADA',
      entidad: 'OfertaLaboral',
      entidadId: ofertaId,
      datosNuevos: this.toOfertaAuditSnapshot(created),
    });

    return created;
  }

  async update(empresaId: string, input: UpdateOfertaInput) {
    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id: input.id },
      select: {
        id: true,
        empresaId: true,
        estado: true,
      },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (oferta.empresaId !== empresaId) {
      throw new ForbiddenException('No puedes modificar esta oferta');
    }

    await this.empresasService.assertEmpresaAprobada(empresaId);

    if (
      oferta.estado === EstadoOferta.CERRADA ||
      oferta.estado === EstadoOferta.EXPIRADA
    ) {
      throw new BadRequestException('No se puede editar esta oferta');
    }

    this.validateSalaryRange(input.salarioMin, input.salarioMax);
    const cierreEn = this.parseOptionalFutureDate(input.cierreEn);
    this.ensureNoDuplicateHabilidades(input.habilidadIds);
    await this.ensureHabilidadesExist(input.habilidadIds);

    const shouldResetModeration = this.hasContentChanges(input);
    const previousSnapshot = this.toOfertaAuditSnapshot(oferta);
    await this.prisma.$transaction(async (tx) => {
      await tx.ofertaLaboral.update({
        where: { id: input.id },
        data: {
          ...(input.titulo !== undefined
            ? { titulo: input.titulo.trim() }
            : {}),
          ...(input.descripcion !== undefined
            ? { descripcion: input.descripcion.trim() }
            : {}),
          ...(input.modalidad !== undefined
            ? { modalidad: input.modalidad }
            : {}),
          ...(input.tipoContrato !== undefined
            ? { tipoContrato: input.tipoContrato }
            : {}),
          ...(input.ciudad !== undefined
            ? { ciudad: input.ciudad?.trim() ?? null }
            : {}),
          ...(input.region !== undefined
            ? { region: input.region?.trim() ?? null }
            : {}),
          ...(input.pais !== undefined
            ? { pais: input.pais?.trim() ?? null }
            : {}),
          ...(input.salarioMin !== undefined
            ? { salarioMin: input.salarioMin }
            : {}),
          ...(input.salarioMax !== undefined
            ? { salarioMax: input.salarioMax }
            : {}),
          ...(input.cierreEn !== undefined ? { cierreEn } : {}),
          ...(shouldResetModeration
            ? {
                estado: EstadoOferta.PENDIENTE_REVISION,
                publicadoEn: null,
              }
            : {}),
        },
      });

      if (input.habilidadIds !== undefined) {
        await tx.habilidadOferta.deleteMany({
          where: { ofertaId: input.id },
        });

        if (input.habilidadIds.length > 0) {
          await tx.habilidadOferta.createMany({
            data: input.habilidadIds.map((habilidadId) => ({
              ofertaId: input.id,
              habilidadId,
              requerida: true,
            })),
          });
        }
      }
    });

    const updated = await this.getById(input.id, {
      id: empresaId,
      email: '',
      rol: RolUsuario.EMPRESA,
    });

    await this.auditoriaService.registrarSeguro({
      usuarioId: empresaId,
      accion: 'OFERTA_ACTUALIZADA',
      entidad: 'OfertaLaboral',
      entidadId: input.id,
      datosAnteriores: previousSnapshot,
      datosNuevos: this.toOfertaAuditSnapshot(updated),
    });

    return updated;
  }

  async cerrar(empresaId: string, id: string) {
    const oferta = await this.getOfertaOwnerData(id);

    if (oferta.empresaId !== empresaId) {
      throw new ForbiddenException('No puedes cerrar esta oferta');
    }

    // TODO: notificar cierre de oferta si corresponde.
    await this.prisma.ofertaLaboral.update({
      where: { id },
      data: {
        estado: EstadoOferta.CERRADA,
      },
    });

    const updated = await this.getById(id, {
      id: empresaId,
      email: '',
      rol: RolUsuario.EMPRESA,
    });

    await this.auditoriaService.registrarSeguro({
      usuarioId: empresaId,
      accion: 'OFERTA_CERRADA',
      entidad: 'OfertaLaboral',
      entidadId: id,
      datosAnteriores: this.toOfertaAuditSnapshot(oferta),
      datosNuevos: this.toOfertaAuditSnapshot(updated),
    });

    return updated;
  }

  async delete(empresaId: string, id: string) {
    const oferta = await this.getOfertaOwnerData(id);

    if (oferta.empresaId !== empresaId) {
      throw new ForbiddenException('No puedes eliminar esta oferta');
    }

    if (oferta._count.postulaciones > 0) {
      throw new BadRequestException(
        'No se puede eliminar una oferta con postulaciones',
      );
    }

    // TODO: auditar eliminacion de oferta laboral.
    await this.prisma.$transaction(async (tx) => {
      await tx.habilidadOferta.deleteMany({
        where: { ofertaId: id },
      });

      await tx.ofertaLaboral.delete({
        where: { id },
      });
    });

    return {
      message: 'Oferta eliminada correctamente',
    };
  }

  async adminList(input: AdminListOfertasInput) {
    const pagination = normalizePagination(input.page, input.limit);
    const where = this.buildAdminListWhere(input);

    // TODO: auditar visualizacion administrativa de ofertas.
    const [data, total] = await runPaginatedReadQueries(
      this.prisma.ofertaLaboral.findMany({
        where,
        select: privateOfertaSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ actualizadoEn: 'desc' }, { creadoEn: 'desc' }],
      }),
      this.prisma.ofertaLaboral.count({ where }),
    );

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async adminModerar(adminId: string, input: AdminModerarOfertaInput) {
    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id: input.id },
      select: {
        id: true,
        estado: true,
        titulo: true,
        empresaId: true,
      },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    if (
      oferta.estado !== EstadoOferta.PENDIENTE_REVISION &&
      oferta.estado !== EstadoOferta.RECHAZADA
    ) {
      throw new BadRequestException('La oferta no se puede moderar');
    }
    await this.prisma.ofertaLaboral.update({
      where: { id: input.id },
      data: {
        estado:
          input.decision === 'APROBAR'
            ? EstadoOferta.ACTIVA
            : EstadoOferta.RECHAZADA,
        publicadoEn: input.decision === 'APROBAR' ? new Date() : null,
      },
    });

    await this.safeNotify(() =>
      this.notificacionesService.notificarOfertaModerada({
        empresaUsuarioId: oferta.empresaId,
        ofertaId: oferta.id,
        tituloOferta: oferta.titulo,
        aprobada: input.decision === 'APROBAR',
      }),
    );

    const updated = await this.getById(input.id, {
      id: adminId,
      email: '',
      rol: RolUsuario.ADMINISTRADOR,
    });

    await this.auditoriaService.registrarSeguro({
      usuarioId: adminId,
      accion:
        input.decision === 'APROBAR' ? 'OFERTA_APROBADA' : 'OFERTA_RECHAZADA',
      entidad: 'OfertaLaboral',
      entidadId: input.id,
      datosAnteriores: this.toOfertaAuditSnapshot(oferta),
      datosNuevos: this.toOfertaAuditSnapshot(updated),
    });

    return updated;
  }

  private async getOfertaOrFail<T extends Prisma.OfertaLaboralSelect>(
    id: string,
    select: T,
  ) {
    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id },
      select,
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    return oferta;
  }

  private async getOfertaOwnerData(id: string) {
    const oferta = await this.prisma.ofertaLaboral.findUnique({
      where: { id },
      select: {
        id: true,
        empresaId: true,
        _count: {
          select: {
            postulaciones: true,
          },
        },
      },
    });

    if (!oferta) {
      throw new NotFoundException('Oferta no encontrada');
    }

    return oferta;
  }

  private isOfertaPublica(estado: EstadoOferta) {
    return estado === EstadoOferta.ACTIVA;
  }

  private validateSalaryRange(
    salarioMin: number | null | undefined,
    salarioMax: number | null | undefined,
  ) {
    if (
      salarioMin !== undefined &&
      salarioMax !== undefined &&
      salarioMin !== null &&
      salarioMax !== null &&
      salarioMin > salarioMax
    ) {
      throw new BadRequestException(
        'El salario minimo no puede ser mayor al salario maximo',
      );
    }
  }

  private parseOptionalFutureDate(value: string | Date | null | undefined) {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const parsed = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('La fecha de cierre no es valida');
    }

    if (parsed <= new Date()) {
      throw new BadRequestException('La fecha de cierre debe ser futura');
    }

    return parsed;
  }

  private ensureNoDuplicateHabilidades(habilidadIds?: string[]) {
    if (!habilidadIds) {
      return;
    }

    if (new Set(habilidadIds).size !== habilidadIds.length) {
      throw new BadRequestException('No se permiten habilidades duplicadas');
    }
  }

  private async ensureHabilidadesExist(habilidadIds?: string[]) {
    if (!habilidadIds || habilidadIds.length === 0) {
      return;
    }

    const habilidades = await this.prisma.habilidad.findMany({
      where: {
        id: {
          in: habilidadIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (habilidades.length !== habilidadIds.length) {
      throw new NotFoundException('Una o mas habilidades no existen');
    }
  }

  private hasContentChanges(input: UpdateOfertaInput) {
    return (
      input.titulo !== undefined ||
      input.descripcion !== undefined ||
      input.modalidad !== undefined ||
      input.tipoContrato !== undefined ||
      input.ciudad !== undefined ||
      input.region !== undefined ||
      input.pais !== undefined ||
      input.salarioMin !== undefined ||
      input.salarioMax !== undefined ||
      input.cierreEn !== undefined ||
      input.habilidadIds !== undefined
    );
  }

  private buildFeedWhere(
    input: FeedOfertasInput,
    viewer: AuthenticatedUser,
  ): Prisma.OfertaLaboralWhereInput {
    return {
      ...(viewer.rol === RolUsuario.ADMINISTRADOR
        ? {}
        : {
            estado: EstadoOferta.ACTIVA,
          }),
      ...this.buildSharedFeedFilters(input),
    };
  }

  private buildPublicFeedWhere(
    input: FeedOfertasInput,
  ): Prisma.OfertaLaboralWhereInput {
    return {
      estado: EstadoOferta.ACTIVA,
      ...this.buildSharedFeedFilters(input),
    };
  }

  private buildSharedFeedFilters(
    input: FeedOfertasInput,
  ): Prisma.OfertaLaboralWhereInput {
    const search = input.search?.trim();
    const searchFilters: Prisma.OfertaLaboralWhereInput[] = [];

    if (search) {
      searchFilters.push(
        {
          titulo: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          descripcion: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          empresa: {
            is: {
              nombreComercial: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      );
    }

    return {
      ...(searchFilters.length > 0 ? { OR: searchFilters } : {}),
      ...(input.modalidad ? { modalidad: input.modalidad } : {}),
      ...(input.tipoContrato ? { tipoContrato: input.tipoContrato } : {}),
      ...(input.ciudad
        ? {
            ciudad: {
              contains: input.ciudad.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.region
        ? {
            region: {
              contains: input.region.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.pais
        ? {
            pais: {
              contains: input.pais.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.salarioMin !== undefined
        ? {
            salarioMax: {
              gte: input.salarioMin,
            },
          }
        : {}),
      ...(input.salarioMax !== undefined
        ? {
            salarioMin: {
              lte: input.salarioMax,
            },
          }
        : {}),
      ...(input.habilidadIds && input.habilidadIds.length > 0
        ? {
            habilidades: {
              some: {
                habilidadId: {
                  in: input.habilidadIds,
                },
              },
            },
          }
        : {}),
    };
  }

  private buildMisOfertasWhere(
    empresaId: string,
    input: MisOfertasInput,
  ): Prisma.OfertaLaboralWhereInput {
    const search = input.search?.trim();

    return {
      empresaId,
      ...(input.estado ? { estado: input.estado } : {}),
      ...(search
        ? {
            OR: [
              {
                titulo: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                descripcion: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };
  }

  private buildAdminListWhere(
    input: AdminListOfertasInput,
  ): Prisma.OfertaLaboralWhereInput {
    const search = input.search?.trim();

    return {
      ...(input.estado ? { estado: input.estado } : {}),
      ...(input.empresaId ? { empresaId: input.empresaId } : {}),
      ...(input.modalidad ? { modalidad: input.modalidad } : {}),
      ...(input.tipoContrato ? { tipoContrato: input.tipoContrato } : {}),
      ...(input.ciudad
        ? {
            ciudad: {
              contains: input.ciudad.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.region
        ? {
            region: {
              contains: input.region.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                titulo: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                descripcion: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                empresa: {
                  is: {
                    nombreComercial: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };
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

  private toOfertaAuditSnapshot(oferta: {
    id: string;
    empresaId?: string;
    titulo?: string;
    modalidad?: Prisma.OfertaLaboralGetPayload<{
      select: { modalidad: true };
    }>['modalidad'];
    tipoContrato?: Prisma.OfertaLaboralGetPayload<{
      select: { tipoContrato: true };
    }>['tipoContrato'];
    estado?: EstadoOferta;
    cierreEn?: Date | null;
    publicadoEn?: Date | null;
    salarioMin?: Prisma.Decimal | number | null;
    salarioMax?: Prisma.Decimal | number | null;
    ciudad?: string | null;
    region?: string | null;
    pais?: string | null;
    habilidades?: Array<{
      habilidad?: {
        id: string;
        nombre: string;
      };
    }>;
    empresa?: {
      id: string;
    };
  }) {
    return {
      id: oferta.id,
      empresaId: oferta.empresaId ?? oferta.empresa?.id,
      titulo: oferta.titulo ?? null,
      modalidad: oferta.modalidad,
      tipoContrato: oferta.tipoContrato,
      estado: oferta.estado,
      cierreEn: oferta.cierreEn ?? null,
      publicadoEn: oferta.publicadoEn ?? null,
      salarioMin:
        oferta.salarioMin instanceof Prisma.Decimal
          ? oferta.salarioMin.toNumber()
          : (oferta.salarioMin ?? null),
      salarioMax:
        oferta.salarioMax instanceof Prisma.Decimal
          ? oferta.salarioMax.toNumber()
          : (oferta.salarioMax ?? null),
      ciudad: oferta.ciudad ?? null,
      region: oferta.region ?? null,
      pais: oferta.pais ?? null,
      habilidadIds:
        oferta.habilidades?.map((item) => item.habilidad?.id).filter(Boolean) ??
        [],
    };
  }
}
