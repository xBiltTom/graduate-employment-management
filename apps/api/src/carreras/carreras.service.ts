import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@graduate-employment-management/database';
import {
  buildPaginationMeta,
  normalizePagination,
} from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import {
  CarreraByIdInput,
  CarreraCreateInput,
  CarrerasListInput,
  CarreraToggleActivaInput,
  CarreraUpdateInput,
} from './schemas/carreras.schemas';

@Injectable()
export class CarrerasService {
  constructor(private readonly prisma: PrismaService) {}

  async list(input: CarrerasListInput) {
    const pagination = normalizePagination(input.page, input.limit);
    const where = this.buildWhere(input);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.carrera.findMany({
        where,
        orderBy: {
          nombre: 'asc',
        },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.carrera.count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async getById(input: CarreraByIdInput) {
    const carrera = await this.prisma.carrera.findUnique({
      where: { id: input.id },
    });

    if (!carrera) {
      throw new NotFoundException('Carrera no encontrada');
    }

    return carrera;
  }

  async create(input: CarreraCreateInput) {
    const nombre = input.nombre.trim();
    await this.ensureUniqueNombre(nombre);

    return this.prisma.carrera.create({
      data: {
        nombre,
        descripcion: input.descripcion?.trim(),
        estaActiva: true,
      },
    });
  }

  async update(input: CarreraUpdateInput) {
    const carrera = await this.getById({ id: input.id });
    const nombre = input.nombre?.trim();

    if (nombre && nombre !== carrera.nombre) {
      await this.ensureUniqueNombre(nombre, input.id);
    }

    return this.prisma.carrera.update({
      where: { id: input.id },
      data: {
        ...(nombre ? { nombre } : {}),
        ...(input.descripcion !== undefined
          ? { descripcion: input.descripcion?.trim() ?? null }
          : {}),
      },
    });
  }

  async toggleActiva(input: CarreraToggleActivaInput) {
    const carrera = await this.getById({ id: input.id });

    return this.prisma.carrera.update({
      where: { id: input.id },
      data: {
        estaActiva: !carrera.estaActiva,
      },
    });
  }

  private buildWhere(input: CarrerasListInput): Prisma.CarreraWhereInput {
    return {
      ...(input.search
        ? {
            nombre: {
              contains: input.search.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.estaActiva !== undefined
        ? { estaActiva: input.estaActiva }
        : {}),
    };
  }

  private async ensureUniqueNombre(nombre: string, currentId?: string) {
    const existing = await this.prisma.carrera.findUnique({
      where: { nombre },
    });

    if (existing && existing.id !== currentId) {
      throw new ConflictException('Ya existe una carrera con ese nombre');
    }
  }
}
