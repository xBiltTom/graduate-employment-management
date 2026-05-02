import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@graduate-employment-management/database';
import { PrismaService } from '../prisma/prisma.service';
import {
  HabilidadByIdInput,
  HabilidadCreateInput,
  HabilidadDeleteInput,
  HabilidadesListInput,
  HabilidadUpdateInput,
} from './schemas/habilidades.schemas';

@Injectable()
export class HabilidadesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(input: HabilidadesListInput) {
    const where = this.buildWhere(input);

    return this.prisma.habilidad.findMany({
      where,
      orderBy: [
        {
          tipo: 'asc',
        },
        {
          categoria: 'asc',
        },
        {
          nombre: 'asc',
        },
      ],
    });
  }

  async getById(input: HabilidadByIdInput) {
    const habilidad = await this.prisma.habilidad.findUnique({
      where: { id: input.id },
    });

    if (!habilidad) {
      throw new NotFoundException('Habilidad no encontrada');
    }

    return habilidad;
  }

  async create(input: HabilidadCreateInput) {
    const nombre = input.nombre.trim();
    await this.ensureUniqueNombre(nombre);

    return this.prisma.habilidad.create({
      data: {
        nombre,
        tipo: input.tipo,
        categoria: input.categoria?.trim(),
      },
    });
  }

  async update(input: HabilidadUpdateInput) {
    const habilidad = await this.getById({ id: input.id });
    const nombre = input.nombre?.trim();

    if (nombre && nombre !== habilidad.nombre) {
      await this.ensureUniqueNombre(nombre, input.id);
    }

    return this.prisma.habilidad.update({
      where: { id: input.id },
      data: {
        ...(nombre ? { nombre } : {}),
        ...(input.tipo ? { tipo: input.tipo } : {}),
        ...(input.categoria !== undefined
          ? { categoria: input.categoria?.trim() ?? null }
          : {}),
      },
    });
  }

  async delete(input: HabilidadDeleteInput) {
    await this.getById({ id: input.id });

    const [egresadosCount, ofertasCount] = await this.prisma.$transaction([
      this.prisma.habilidadEgresado.count({
        where: { habilidadId: input.id },
      }),
      this.prisma.habilidadOferta.count({
        where: { habilidadId: input.id },
      }),
    ]);

    if (egresadosCount > 0 || ofertasCount > 0) {
      throw new BadRequestException(
        'No se puede eliminar una habilidad asociada a egresados u ofertas',
      );
    }

    await this.prisma.habilidad.delete({
      where: { id: input.id },
    });

    return {
      message: 'Habilidad eliminada correctamente',
    };
  }

  private buildWhere(input: HabilidadesListInput): Prisma.HabilidadWhereInput {
    return {
      ...(input.search
        ? {
            nombre: {
              contains: input.search.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.tipo ? { tipo: input.tipo } : {}),
      ...(input.categoria
        ? {
            categoria: {
              equals: input.categoria.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
    };
  }

  private async ensureUniqueNombre(nombre: string, currentId?: string) {
    const existing = await this.prisma.habilidad.findUnique({
      where: { nombre },
    });

    if (existing && existing.id !== currentId) {
      throw new ConflictException('Ya existe una habilidad con ese nombre');
    }
  }
}
