import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoUsuario,
  EstadoValidacionEmpresa,
  Prisma,
  RolUsuario,
} from '@graduate-employment-management/database';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AuditoriaService } from '../auditoria/auditoria.service';
import {
  buildPaginationMeta,
  normalizePagination,
} from '../common/utils/pagination.util';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  GetEmpresaByIdInput,
  ListarEmpresasInput,
  UpdateMiPerfilEmpresaInput,
  ValidarEmpresaInput,
} from './schemas/empresas.schemas';

const safeUsuarioSelect = {
  id: true,
  email: true,
  rol: true,
  estado: true,
  avatarUrl: true,
  creadoEn: true,
  actualizadoEn: true,
} satisfies Prisma.UsuarioSelect;

const sectorSelect = {
  id: true,
  nombre: true,
  descripcion: true,
  estaActivo: true,
} satisfies Prisma.SectorSelect;

const validadorSelect = {
  id: true,
  email: true,
  rol: true,
  estado: true,
} satisfies Prisma.UsuarioSelect;

const publicEmpresaSelect = {
  id: true,
  nombreComercial: true,
  descripcion: true,
  sitioWeb: true,
  ciudad: true,
  region: true,
  pais: true,
  sector: {
    select: sectorSelect,
  },
} satisfies Prisma.EmpresaSelect;

const privateEmpresaSelect = {
  id: true,
  nombreComercial: true,
  razonSocial: true,
  ruc: true,
  descripcion: true,
  sitioWeb: true,
  direccion: true,
  ciudad: true,
  region: true,
  pais: true,
  estadoValidacion: true,
  validadoEn: true,
  motivoRechazo: true,
  creadoEn: true,
  actualizadoEn: true,
  sector: {
    select: sectorSelect,
  },
  usuario: {
    select: safeUsuarioSelect,
  },
  validadoPor: {
    select: validadorSelect,
  },
} satisfies Prisma.EmpresaSelect;

@Injectable()
export class EmpresasService {
  private readonly logger = new Logger(EmpresasService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificacionesService: NotificacionesService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async getMiPerfil(userId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: userId },
      select: privateEmpresaSelect,
    });

    if (!empresa) {
      throw new NotFoundException('Perfil de empresa no encontrado');
    }

    return empresa;
  }

  async updateMiPerfil(userId: string, input: UpdateMiPerfilEmpresaInput) {
    const previous = await this.ensureEmpresaExists(userId);

    if (input.sectorId) {
      await this.ensureSectorExists(input.sectorId);
    }

    const sitioWeb = this.normalizeSitioWeb(input.sitioWeb);
    await this.prisma.empresa.update({
      where: { id: userId },
      data: {
        ...(input.nombreComercial !== undefined
          ? { nombreComercial: input.nombreComercial.trim() }
          : {}),
        ...(input.descripcion !== undefined
          ? { descripcion: input.descripcion?.trim() ?? null }
          : {}),
        ...(input.sitioWeb !== undefined ? { sitioWeb } : {}),
        ...(input.direccion !== undefined
          ? { direccion: input.direccion?.trim() ?? null }
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
        ...(input.sectorId !== undefined ? { sectorId: input.sectorId } : {}),
      },
    });

    const updated = await this.getMiPerfil(userId);

    await this.auditoriaService.registrarSeguro({
      usuarioId: userId,
      accion: 'EMPRESA_PERFIL_ACTUALIZADO',
      entidad: 'Empresa',
      entidadId: userId,
      datosAnteriores: this.toEmpresaAuditSnapshot(previous),
      datosNuevos: this.toEmpresaAuditSnapshot(updated),
    });

    return updated;
  }

  async getById(input: GetEmpresaByIdInput, viewer: AuthenticatedUser) {
    if (viewer.rol === RolUsuario.ADMINISTRADOR) {
      const empresa = await this.prisma.empresa.findUnique({
        where: { id: input.id },
        select: privateEmpresaSelect,
      });

      if (!empresa) {
        throw new NotFoundException('Empresa no encontrada');
      }

      // TODO: auditar visualizacion de empresa por administrador.
      return empresa;
    }

    const empresa = await this.prisma.empresa.findUnique({
      where: { id: input.id },
      select: publicEmpresaSelect,
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return empresa;
  }

  async listar(input: ListarEmpresasInput) {
    const pagination = normalizePagination(input.page, input.limit);
    const where = this.buildListWhere(input);

    // TODO: auditar consulta de listado administrativo de empresas.
    const [data, total] = await this.prisma.$transaction([
      this.prisma.empresa.findMany({
        where,
        select: privateEmpresaSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ actualizadoEn: 'desc' }, { creadoEn: 'desc' }],
      }),
      this.prisma.empresa.count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async validar(adminId: string, input: ValidarEmpresaInput) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: input.empresaId },
      select: {
        id: true,
        estadoValidacion: true,
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (empresa.estadoValidacion !== EstadoValidacionEmpresa.PENDIENTE) {
      throw new BadRequestException('La empresa ya fue procesada');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.empresa.update({
        where: { id: input.empresaId },
        data: {
          estadoValidacion: input.decision,
          validadoPorId: adminId,
          validadoEn: new Date(),
          motivoRechazo:
            input.decision === EstadoValidacionEmpresa.RECHAZADA
              ? (input.motivoRechazo?.trim() ?? null)
              : null,
        },
      });

      await tx.usuario.update({
        where: { id: input.empresaId },
        data: {
          estado:
            input.decision === EstadoValidacionEmpresa.APROBADA
              ? EstadoUsuario.ACTIVO
              : EstadoUsuario.SUSPENDIDO,
        },
      });
    });

    await this.safeNotify(() =>
      this.notificacionesService.notificarEmpresaValidada({
        empresaUsuarioId: input.empresaId,
        aprobada: input.decision === EstadoValidacionEmpresa.APROBADA,
        motivoRechazo: input.motivoRechazo ?? null,
      }),
    );

    const updated = await this.getMiPerfil(input.empresaId);

    await this.auditoriaService.registrarSeguro({
      usuarioId: adminId,
      accion:
        input.decision === EstadoValidacionEmpresa.APROBADA
          ? 'EMPRESA_VALIDADA'
          : 'EMPRESA_RECHAZADA',
      entidad: 'Empresa',
      entidadId: input.empresaId,
      datosAnteriores: {
        estadoValidacion: empresa.estadoValidacion,
      },
      datosNuevos: {
        estadoValidacion: updated.estadoValidacion,
        motivoRechazo: updated.motivoRechazo,
        validadoPorId: adminId,
      },
    });

    return updated;
  }

  async getEstadoValidacion(userId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: userId },
      select: {
        estadoValidacion: true,
        motivoRechazo: true,
      },
    });

    if (!empresa) {
      throw new NotFoundException('Perfil de empresa no encontrado');
    }

    return {
      estadoValidacion: empresa.estadoValidacion,
      puedePublicarOfertas:
        empresa.estadoValidacion === EstadoValidacionEmpresa.APROBADA,
      ...(this.buildEstadoMensaje(
        empresa.estadoValidacion,
        empresa.motivoRechazo,
      )
        ? {
            mensaje: this.buildEstadoMensaje(
              empresa.estadoValidacion,
              empresa.motivoRechazo,
            ),
          }
        : {}),
    };
  }

  async assertEmpresaAprobada(empresaId: string): Promise<void> {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      select: {
        id: true,
        estadoValidacion: true,
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (empresa.estadoValidacion !== EstadoValidacionEmpresa.APROBADA) {
      throw new ForbiddenException('La empresa no se encuentra aprobada');
    }
  }

  private async ensureEmpresaExists(userId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombreComercial: true,
        descripcion: true,
        sitioWeb: true,
        direccion: true,
        ciudad: true,
        region: true,
        pais: true,
        sectorId: true,
        estadoValidacion: true,
      },
    });

    if (!empresa) {
      throw new NotFoundException('Perfil de empresa no encontrado');
    }

    return empresa;
  }

  private async ensureSectorExists(sectorId: string) {
    const sector = await this.prisma.sector.findUnique({
      where: { id: sectorId },
      select: {
        id: true,
        estaActivo: true,
      },
    });

    if (!sector) {
      throw new NotFoundException('Sector no encontrado');
    }

    if (!sector.estaActivo) {
      throw new BadRequestException('El sector seleccionado no esta activo');
    }
  }

  private normalizeSitioWeb(value: string | null | undefined) {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    const candidate = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    try {
      const url = new URL(candidate);
      return url.toString();
    } catch {
      throw new BadRequestException('El sitio web no tiene un formato valido');
    }
  }

  private buildEstadoMensaje(
    estado: EstadoValidacionEmpresa,
    motivoRechazo: string | null,
  ) {
    if (estado === EstadoValidacionEmpresa.APROBADA) {
      return 'Tu empresa fue aprobada y ya puede publicar ofertas.';
    }

    if (estado === EstadoValidacionEmpresa.RECHAZADA) {
      return motivoRechazo
        ? `Tu empresa fue rechazada: ${motivoRechazo}`
        : 'Tu empresa fue rechazada.';
    }

    return 'Tu empresa aun se encuentra pendiente de validacion.';
  }

  private buildListWhere(input: ListarEmpresasInput): Prisma.EmpresaWhereInput {
    const search = input.search?.trim();

    return {
      ...(search
        ? {
            OR: [
              {
                nombreComercial: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                razonSocial: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                ruc: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                usuario: {
                  is: {
                    email: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            ],
          }
        : {}),
      ...(input.estadoValidacion
        ? { estadoValidacion: input.estadoValidacion }
        : {}),
      ...(input.sectorId ? { sectorId: input.sectorId } : {}),
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

  private toEmpresaAuditSnapshot(empresa: {
    id: string;
    nombreComercial?: string | null;
    descripcion?: string | null;
    sitioWeb?: string | null;
    direccion?: string | null;
    ciudad?: string | null;
    region?: string | null;
    pais?: string | null;
    sectorId?: string | null;
    estadoValidacion?: EstadoValidacionEmpresa;
    motivoRechazo?: string | null;
  }) {
    return {
      id: empresa.id,
      nombreComercial: empresa.nombreComercial ?? null,
      descripcion: empresa.descripcion ?? null,
      sitioWeb: empresa.sitioWeb ?? null,
      direccion: empresa.direccion ?? null,
      ciudad: empresa.ciudad ?? null,
      region: empresa.region ?? null,
      pais: empresa.pais ?? null,
      sectorId: empresa.sectorId ?? null,
      estadoValidacion: empresa.estadoValidacion,
      motivoRechazo: empresa.motivoRechazo ?? null,
    };
  }
}
