import { BadRequestException, ConflictException } from '@nestjs/common';
import { TipoHabilidad } from '@graduate-employment-management/database';
import { HabilidadesService } from './habilidades.service';

describe('HabilidadesService', () => {
  const prisma = {
    habilidad: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    habilidadEgresado: {
      count: jest.fn(),
    },
    habilidadOferta: {
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  let service: HabilidadesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HabilidadesService(prisma as never);
  });

  it('create lanza ConflictException si el nombre ya existe', async () => {
    prisma.habilidad.findUnique.mockResolvedValue({
      id: '1',
      nombre: 'TypeScript',
    });

    await expect(
      service.create({
        nombre: 'TypeScript',
        tipo: TipoHabilidad.TECNICA,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('delete lanza BadRequestException si la habilidad tiene asociaciones', async () => {
    prisma.habilidad.findUnique.mockResolvedValue({
      id: '1',
      nombre: 'TypeScript',
      tipo: TipoHabilidad.TECNICA,
      categoria: 'Frontend',
    });
    prisma.$transaction.mockResolvedValue([1, 0]);

    await expect(service.delete({ id: '1' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('list filtra por tipo', async () => {
    prisma.habilidad.findMany.mockResolvedValue([
      {
        id: '1',
        nombre: 'TypeScript',
        tipo: TipoHabilidad.TECNICA,
        categoria: 'Frontend',
      },
    ]);

    const result = await service.list({
      tipo: TipoHabilidad.TECNICA,
    });

    const calls = prisma.habilidad.findMany.mock.calls as Array<
      [
        {
          where: {
            tipo?: TipoHabilidad;
          };
        },
      ]
    >;
    const firstCallArgument = calls[0][0];

    expect(firstCallArgument.where.tipo).toBe(TipoHabilidad.TECNICA);
    expect(result).toHaveLength(1);
  });
});
