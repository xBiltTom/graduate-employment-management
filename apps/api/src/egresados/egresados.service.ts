import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, RolUsuario } from '@graduate-employment-management/database';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import {
  buildPaginationMeta,
  normalizePagination,
} from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddExperienciaInput,
  AddFormacionInput,
  BuscarEgresadosInput,
  GetEgresadoByIdInput,
  SyncHabilidadesInput,
  UpdateExperienciaInput,
  UpdateFormacionInput,
  UpdateMiPerfilInput,
} from './schemas/egresados.schemas';

const safeUsuarioSelect = {
  id: true,
  email: true,
  rol: true,
  estado: true,
  avatarUrl: true,
  creadoEn: true,
  actualizadoEn: true,
} satisfies Prisma.UsuarioSelect;

const carreraSelect = {
  id: true,
  nombre: true,
  descripcion: true,
  estaActiva: true,
} satisfies Prisma.CarreraSelect;

const formacionSelect = {
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
} satisfies Prisma.FormacionEgresadoSelect;

const experienciaSelect = {
  id: true,
  empresa: true,
  cargo: true,
  descripcion: true,
  fechaInicio: true,
  fechaFin: true,
  esActual: true,
  creadoEn: true,
  actualizadoEn: true,
} satisfies Prisma.ExperienciaEgresadoSelect;

const habilidadesSelect = {
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
} satisfies Prisma.HabilidadEgresadoSelect;

const fullEgresadoSelect = {
  id: true,
  nombres: true,
  apellidos: true,
  dni: true,
  fechaNacimiento: true,
  telefono: true,
  direccion: true,
  pais: true,
  region: true,
  ciudad: true,
  distrito: true,
  presentacion: true,
  anioEgreso: true,
  creadoEn: true,
  actualizadoEn: true,
  usuario: {
    select: safeUsuarioSelect,
  },
  carrera: {
    select: carreraSelect,
  },
  formaciones: {
    select: formacionSelect,
    orderBy: {
      creadoEn: 'desc',
    },
  },
  experiencias: {
    select: experienciaSelect,
    orderBy: {
      creadoEn: 'desc',
    },
  },
  habilidades: {
    select: habilidadesSelect,
    orderBy: {
      creadoEn: 'desc',
    },
  },
} satisfies Prisma.EgresadoSelect;

const publicEgresadoSelect = {
  id: true,
  nombres: true,
  apellidos: true,
  presentacion: true,
  pais: true,
  region: true,
  ciudad: true,
  distrito: true,
  anioEgreso: true,
  actualizadoEn: true,
  creadoEn: true,
  carrera: {
    select: carreraSelect,
  },
  formaciones: {
    select: formacionSelect,
    orderBy: {
      creadoEn: 'desc',
    },
  },
  experiencias: {
    select: experienciaSelect,
    orderBy: {
      creadoEn: 'desc',
    },
  },
  habilidades: {
    select: habilidadesSelect,
    orderBy: {
      creadoEn: 'desc',
    },
  },
} satisfies Prisma.EgresadoSelect;

const adminBuscarSelect = {
  id: true,
  nombres: true,
  apellidos: true,
  telefono: true,
  ciudad: true,
  region: true,
  pais: true,
  anioEgreso: true,
  actualizadoEn: true,
  creadoEn: true,
  usuario: {
    select: {
      id: true,
      email: true,
      rol: true,
      estado: true,
    },
  },
  carrera: {
    select: {
      id: true,
      nombre: true,
    },
  },
  habilidades: {
    select: habilidadesSelect,
  },
} satisfies Prisma.EgresadoSelect;

const empresaBuscarSelect = {
  id: true,
  nombres: true,
  apellidos: true,
  presentacion: true,
  ciudad: true,
  region: true,
  pais: true,
  anioEgreso: true,
  actualizadoEn: true,
  creadoEn: true,
  carrera: {
    select: {
      id: true,
      nombre: true,
    },
  },
  habilidades: {
    select: habilidadesSelect,
  },
} satisfies Prisma.EgresadoSelect;

@Injectable()
export class EgresadosService {
  constructor(private readonly prisma: PrismaService) {}

  async getMiPerfil(userId: string) {
    const egresado = await this.prisma.egresado.findUnique({
      where: { id: userId },
      select: fullEgresadoSelect,
    });

    if (!egresado) {
      throw new NotFoundException('Perfil de egresado no encontrado');
    }

    return egresado;
  }

  async updateMiPerfil(userId: string, input: UpdateMiPerfilInput) {
    await this.ensureEgresadoExists(userId);

    if (input.carreraId) {
      await this.ensureCarreraExists(input.carreraId);
    }

    if (input.anioEgreso !== undefined && input.anioEgreso !== null) {
      this.validateAnioEgreso(input.anioEgreso);
    }

    const fechaNacimiento = this.parseOptionalDate(input.fechaNacimiento);

    // TODO: auditar cambios de perfil del egresado.
    await this.prisma.egresado.update({
      where: { id: userId },
      data: {
        ...(input.presentacion !== undefined
          ? { presentacion: input.presentacion?.trim() ?? null }
          : {}),
        ...(input.telefono !== undefined
          ? { telefono: input.telefono?.trim() ?? null }
          : {}),
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
        ...(input.carreraId !== undefined
          ? { carreraId: input.carreraId }
          : {}),
        ...(input.anioEgreso !== undefined
          ? { anioEgreso: input.anioEgreso }
          : {}),
        ...(input.fechaNacimiento !== undefined ? { fechaNacimiento } : {}),
      },
    });

    return this.getMiPerfil(userId);
  }

  async addFormacion(userId: string, input: AddFormacionInput) {
    await this.ensureEgresadoExists(userId);
    const normalized = this.normalizeFormacionDates(input);

    return this.prisma.formacionEgresado.create({
      data: {
        egresadoId: userId,
        institucion: input.institucion.trim(),
        grado: input.grado?.trim() ?? null,
        campo: input.campo?.trim() ?? null,
        fechaInicio: normalized.fechaInicio,
        fechaFin: normalized.fechaFin,
        esActual: normalized.esActual,
        descripcion: input.descripcion?.trim() ?? null,
      },
      select: formacionSelect,
    });
  }

  async updateFormacion(userId: string, input: UpdateFormacionInput) {
    const formacion = await this.prisma.formacionEgresado.findUnique({
      where: { id: input.id },
    });

    if (!formacion) {
      throw new NotFoundException('Formación no encontrada');
    }

    if (formacion.egresadoId !== userId) {
      throw new ForbiddenException('No puedes modificar esta formación');
    }

    const normalized = this.normalizeFormacionDates({
      fechaInicio:
        input.fechaInicio !== undefined
          ? input.fechaInicio
          : formacion.fechaInicio,
      fechaFin:
        input.fechaFin !== undefined ? input.fechaFin : formacion.fechaFin,
      esActual: input.esActual ?? formacion.esActual,
    });

    return this.prisma.formacionEgresado.update({
      where: { id: input.id },
      data: {
        ...(input.institucion ? { institucion: input.institucion.trim() } : {}),
        ...(input.grado !== undefined
          ? { grado: input.grado?.trim() ?? null }
          : {}),
        ...(input.campo !== undefined
          ? { campo: input.campo?.trim() ?? null }
          : {}),
        ...(input.descripcion !== undefined
          ? { descripcion: input.descripcion?.trim() ?? null }
          : {}),
        ...(input.fechaInicio !== undefined
          ? { fechaInicio: normalized.fechaInicio }
          : {}),
        ...(input.fechaFin !== undefined
          ? { fechaFin: normalized.fechaFin }
          : {}),
        ...(input.esActual !== undefined
          ? { esActual: normalized.esActual }
          : {}),
      },
      select: formacionSelect,
    });
  }

  async deleteFormacion(userId: string, id: string) {
    const formacion = await this.prisma.formacionEgresado.findUnique({
      where: { id },
    });

    if (!formacion) {
      throw new NotFoundException('Formación no encontrada');
    }

    if (formacion.egresadoId !== userId) {
      throw new ForbiddenException('No puedes eliminar esta formación');
    }

    await this.prisma.formacionEgresado.delete({
      where: { id },
    });

    return {
      message: 'Formación eliminada correctamente',
    };
  }

  async addExperiencia(userId: string, input: AddExperienciaInput) {
    await this.ensureEgresadoExists(userId);
    const normalized = this.normalizeExperienciaDates(input);

    return this.prisma.experienciaEgresado.create({
      data: {
        egresadoId: userId,
        empresa: input.empresa.trim(),
        cargo: input.cargo.trim(),
        descripcion: input.descripcion?.trim() ?? null,
        fechaInicio: normalized.fechaInicio,
        fechaFin: normalized.fechaFin,
        esActual: normalized.esActual,
      },
      select: experienciaSelect,
    });
  }

  async updateExperiencia(userId: string, input: UpdateExperienciaInput) {
    const experiencia = await this.prisma.experienciaEgresado.findUnique({
      where: { id: input.id },
    });

    if (!experiencia) {
      throw new NotFoundException('Experiencia no encontrada');
    }

    if (experiencia.egresadoId !== userId) {
      throw new ForbiddenException('No puedes modificar esta experiencia');
    }

    const normalized = this.normalizeExperienciaDates({
      fechaInicio:
        input.fechaInicio !== undefined
          ? input.fechaInicio
          : experiencia.fechaInicio,
      fechaFin:
        input.fechaFin !== undefined ? input.fechaFin : experiencia.fechaFin,
      esActual: input.esActual ?? experiencia.esActual,
    });

    return this.prisma.experienciaEgresado.update({
      where: { id: input.id },
      data: {
        ...(input.empresa ? { empresa: input.empresa.trim() } : {}),
        ...(input.cargo ? { cargo: input.cargo.trim() } : {}),
        ...(input.descripcion !== undefined
          ? { descripcion: input.descripcion?.trim() ?? null }
          : {}),
        ...(input.fechaInicio !== undefined
          ? { fechaInicio: normalized.fechaInicio }
          : {}),
        ...(input.fechaFin !== undefined
          ? { fechaFin: normalized.fechaFin }
          : {}),
        ...(input.esActual !== undefined
          ? { esActual: normalized.esActual }
          : {}),
      },
      select: experienciaSelect,
    });
  }

  async deleteExperiencia(userId: string, id: string) {
    const experiencia = await this.prisma.experienciaEgresado.findUnique({
      where: { id },
    });

    if (!experiencia) {
      throw new NotFoundException('Experiencia no encontrada');
    }

    if (experiencia.egresadoId !== userId) {
      throw new ForbiddenException('No puedes eliminar esta experiencia');
    }

    await this.prisma.experienciaEgresado.delete({
      where: { id },
    });

    return {
      message: 'Experiencia eliminada correctamente',
    };
  }

  async syncHabilidades(userId: string, input: SyncHabilidadesInput) {
    await this.ensureEgresadoExists(userId);

    const habilidadIds = input.habilidades.map((item) => item.habilidadId);
    const uniqueIds = new Set(habilidadIds);

    if (uniqueIds.size !== habilidadIds.length) {
      throw new ConflictException('No se permiten habilidades duplicadas');
    }

    const existingHabilidades = await this.prisma.habilidad.findMany({
      where: {
        id: {
          in: habilidadIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingHabilidades.length !== habilidadIds.length) {
      throw new NotFoundException('Una o más habilidades no existen');
    }

    // TODO: auditar sincronización de habilidades del egresado.
    await this.prisma.$transaction(async (tx) => {
      await tx.habilidadEgresado.deleteMany({
        where: { egresadoId: userId },
      });

      if (input.habilidades.length > 0) {
        await tx.habilidadEgresado.createMany({
          data: input.habilidades.map((item) => ({
            egresadoId: userId,
            habilidadId: item.habilidadId,
            nivel: item.nivel,
          })),
        });
      }
    });

    const habilidades = await this.prisma.habilidadEgresado.findMany({
      where: { egresadoId: userId },
      select: habilidadesSelect,
      orderBy: {
        creadoEn: 'desc',
      },
    });

    return {
      habilidades,
    };
  }

  async getById(input: GetEgresadoByIdInput, viewer: AuthenticatedUser) {
    if (viewer.rol === RolUsuario.ADMINISTRADOR) {
      const egresado = await this.prisma.egresado.findUnique({
        where: { id: input.id },
        select: fullEgresadoSelect,
      });

      if (!egresado) {
        throw new NotFoundException('Egresado no encontrado');
      }

      return egresado;
    }

    if (viewer.rol === RolUsuario.EGRESADO && viewer.id === input.id) {
      return this.getMiPerfil(viewer.id);
    }

    const egresado = await this.prisma.egresado.findUnique({
      where: { id: input.id },
      select: publicEgresadoSelect,
    });

    if (!egresado) {
      throw new NotFoundException('Egresado no encontrado');
    }

    // TODO: auditar visualización de perfil de egresado por empresa.
    return egresado;
  }

  async buscar(input: BuscarEgresadosInput, viewer: AuthenticatedUser) {
    const pagination = normalizePagination(input.page, input.limit);
    const where = this.buildBuscarWhere(input, viewer);
    const select =
      viewer.rol === RolUsuario.ADMINISTRADOR
        ? adminBuscarSelect
        : empresaBuscarSelect;

    // TODO: auditar búsquedas de egresados realizadas por empresa.
    const [data, total] = await this.prisma.$transaction([
      this.prisma.egresado.findMany({
        where,
        select,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [
          { actualizadoEn: 'desc' },
          { creadoEn: 'desc' },
          { nombres: 'asc' },
          { apellidos: 'asc' },
        ],
      }),
      this.prisma.egresado.count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  private async ensureEgresadoExists(userId: string) {
    const egresado = await this.prisma.egresado.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!egresado) {
      throw new NotFoundException('Perfil de egresado no encontrado');
    }
  }

  private async ensureCarreraExists(carreraId: string) {
    const carrera = await this.prisma.carrera.findUnique({
      where: { id: carreraId },
      select: { id: true },
    });

    if (!carrera) {
      throw new NotFoundException('Carrera no encontrada');
    }
  }

  private validateAnioEgreso(anioEgreso: number) {
    const currentYear = new Date().getFullYear();

    if (anioEgreso < 1950 || anioEgreso > currentYear + 10) {
      throw new BadRequestException('El año de egreso está fuera de rango');
    }
  }

  private normalizeFormacionDates(input: {
    fechaInicio?: string | Date | null;
    fechaFin?: string | Date | null;
    esActual?: boolean;
  }) {
    const fechaInicio = this.parseOptionalDate(input.fechaInicio);
    const fechaFin = this.parseOptionalDate(input.fechaFin);
    const esActual = input.esActual ?? false;

    if (esActual && fechaFin) {
      throw new BadRequestException(
        'La fecha de fin debe ser null cuando la formación es actual',
      );
    }

    if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la fecha de inicio',
      );
    }

    return {
      fechaInicio,
      fechaFin: esActual ? null : fechaFin,
      esActual,
    };
  }

  private normalizeExperienciaDates(input: {
    fechaInicio?: string | Date | null;
    fechaFin?: string | Date | null;
    esActual?: boolean;
  }) {
    const fechaInicio = this.parseOptionalDate(input.fechaInicio);
    const fechaFin = this.parseOptionalDate(input.fechaFin);
    const esActual = input.esActual ?? false;

    if (esActual && fechaFin) {
      throw new BadRequestException(
        'La fecha de fin debe ser null cuando la experiencia es actual',
      );
    }

    if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la fecha de inicio',
      );
    }

    return {
      fechaInicio,
      fechaFin: esActual ? null : fechaFin,
      esActual,
    };
  }

  private parseOptionalDate(value: string | Date | null | undefined) {
    if (value === undefined) {
      return undefined;
    }

    if (value === null) {
      return null;
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new BadRequestException('La fecha enviada no es válida');
      }

      return value;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException('La fecha enviada no es válida');
    }

    return parsed;
  }

  private buildBuscarWhere(
    input: BuscarEgresadosInput,
    viewer: AuthenticatedUser,
  ): Prisma.EgresadoWhereInput {
    const orSearch: Prisma.EgresadoWhereInput[] = [];

    if (input.search) {
      const search = input.search.trim();

      orSearch.push(
        {
          nombres: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          apellidos: {
            contains: search,
            mode: 'insensitive',
          },
        },
      );

      if (viewer.rol === RolUsuario.ADMINISTRADOR) {
        orSearch.push({
          usuario: {
            is: {
              email: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        });
      }
    }

    return {
      ...(orSearch.length > 0 ? { OR: orSearch } : {}),
      ...(input.carreraId ? { carreraId: input.carreraId } : {}),
      ...(input.anioEgreso !== undefined
        ? { anioEgreso: input.anioEgreso }
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
}
