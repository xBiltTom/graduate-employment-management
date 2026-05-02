import { ConflictException } from '@nestjs/common';
import { SectoresService } from './sectores.service';

describe('SectoresService', () => {
  const prisma = {
    sector: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  let service: SectoresService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SectoresService(prisma as never);
  });

  it('create lanza ConflictException si el nombre ya existe', async () => {
    prisma.sector.findUnique.mockResolvedValue({
      id: '1',
      nombre: 'Tecnología',
    });

    await expect(
      service.create({
        nombre: 'Tecnología',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('list retorna formato paginado', async () => {
    prisma.$transaction.mockResolvedValue([
      [{ id: '1', nombre: 'Tecnología', estaActivo: true }],
      1,
    ]);

    const result = await service.list({
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      data: [{ id: '1', nombre: 'Tecnología', estaActivo: true }],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('toggleActivo invierte estado', async () => {
    prisma.sector.findUnique.mockResolvedValue({
      id: '1',
      nombre: 'Tecnología',
      estaActivo: true,
    });
    prisma.sector.update.mockResolvedValue({
      id: '1',
      nombre: 'Tecnología',
      estaActivo: false,
    });

    const result = await service.toggleActivo({ id: '1' });

    expect(prisma.sector.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { estaActivo: false },
    });
    expect(result.estaActivo).toBe(false);
  });
});
