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
  SectorByIdInput,
  SectorCreateInput,
  SectoresListInput,
  SectorToggleActivoInput,
  SectorUpdateInput,
} from './schemas/sectores.schemas';

@Injectable()
export class SectoresService {
  constructor(private readonly prisma: PrismaService) {}

  async list(input: SectoresListInput) {
    const pagination = normalizePagination(input.page, input.limit);
    const where = this.buildWhere(input);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.sector.findMany({
        where,
        orderBy: {
          nombre: 'asc',
        },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.sector.count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta(total, pagination.page, pagination.limit),
    };
  }

  async getById(input: SectorByIdInput) {
    const sector = await this.prisma.sector.findUnique({
      where: { id: input.id },
    });

    if (!sector) {
      throw new NotFoundException('Sector no encontrado');
    }

    return sector;
  }

  async create(input: SectorCreateInput) {
    const nombre = input.nombre.trim();
    await this.ensureUniqueNombre(nombre);

    return this.prisma.sector.create({
      data: {
        nombre,
        descripcion: input.descripcion?.trim(),
        estaActivo: true,
      },
    });
  }

  async update(input: SectorUpdateInput) {
    const sector = await this.getById({ id: input.id });
    const nombre = input.nombre?.trim();

    if (nombre && nombre !== sector.nombre) {
      await this.ensureUniqueNombre(nombre, input.id);
    }

    return this.prisma.sector.update({
      where: { id: input.id },
      data: {
        ...(nombre ? { nombre } : {}),
        ...(input.descripcion !== undefined
          ? { descripcion: input.descripcion?.trim() ?? null }
          : {}),
      },
    });
  }

  async toggleActivo(input: SectorToggleActivoInput) {
    const sector = await this.getById({ id: input.id });

    return this.prisma.sector.update({
      where: { id: input.id },
      data: {
        estaActivo: !sector.estaActivo,
      },
    });
  }

  private buildWhere(input: SectoresListInput): Prisma.SectorWhereInput {
    return {
      ...(input.search
        ? {
            nombre: {
              contains: input.search.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(input.estaActivo !== undefined
        ? { estaActivo: input.estaActivo }
        : {}),
    };
  }

  private async ensureUniqueNombre(nombre: string, currentId?: string) {
    const existing = await this.prisma.sector.findUnique({
      where: { nombre },
    });

    if (existing && existing.id !== currentId) {
      throw new ConflictException('Ya existe un sector con ese nombre');
    }
  }
}
