import { ConflictException } from '@nestjs/common';
import { CarrerasService } from './carreras.service';

describe('CarrerasService', () => {
  const prisma = {
    carrera: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  let service: CarrerasService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CarrerasService(prisma as never);
  });

  it('create lanza ConflictException si el nombre ya existe', async () => {
    prisma.carrera.findUnique.mockResolvedValue({
      id: '1',
      nombre: 'Ingeniería',
    });

    await expect(
      service.create({
        nombre: 'Ingeniería',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('list retorna formato paginado', async () => {
    prisma.$transaction.mockResolvedValue([
      [{ id: '1', nombre: 'Ingeniería', estaActiva: true }],
      1,
    ]);

    const result = await service.list({
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      data: [{ id: '1', nombre: 'Ingeniería', estaActiva: true }],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('toggleActiva invierte estado', async () => {
    prisma.carrera.findUnique.mockResolvedValue({
      id: '1',
      nombre: 'Ingeniería',
      estaActiva: true,
    });
    prisma.carrera.update.mockResolvedValue({
      id: '1',
      nombre: 'Ingeniería',
      estaActiva: false,
    });

    const result = await service.toggleActiva({ id: '1' });

    expect(prisma.carrera.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { estaActiva: false },
    });
    expect(result.estaActiva).toBe(false);
  });
});
