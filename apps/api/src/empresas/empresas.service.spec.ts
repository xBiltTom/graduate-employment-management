import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoValidacionEmpresa,
  RolUsuario,
} from '@graduate-employment-management/database';
import { EmpresasService } from './empresas.service';

describe('EmpresasService', () => {
  const prisma = {
    empresa: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    sector: {
      findUnique: jest.fn(),
    },
    usuario: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const notificacionesService = {
    notificarEmpresaValidada: jest.fn(),
  };
  const auditoriaService = {
    registrarSeguro: jest.fn(),
  };

  let service: EmpresasService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new EmpresasService(
      prisma as never,
      notificacionesService as never,
      auditoriaService as never,
    );
  });

  it('getMiPerfil lanza NotFoundException si no existe empresa', async () => {
    prisma.empresa.findUnique.mockResolvedValue(null);

    await expect(service.getMiPerfil('empresa-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updateMiPerfil verifica existencia de sector si se envia sectorId', async () => {
    prisma.empresa.findUnique
      .mockResolvedValueOnce({ id: 'empresa-1' })
      .mockResolvedValueOnce(null);

    await expect(
      service.updateMiPerfil('empresa-1', {
        sectorId: '550e8400-e29b-41d4-a716-446655440000',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updateMiPerfil no permite cambiar ruc, razonSocial ni estadoValidacion', async () => {
    prisma.empresa.findUnique
      .mockResolvedValueOnce({ id: 'empresa-1' })
      .mockResolvedValueOnce({
        id: 'empresa-1',
        nombreComercial: 'Acme',
      });
    prisma.empresa.update.mockResolvedValue({ id: 'empresa-1' });

    await service.updateMiPerfil('empresa-1', {
      nombreComercial: 'Acme Renovada',
      ruc: '20111111111',
      razonSocial: 'Acme SAC',
      estadoValidacion: EstadoValidacionEmpresa.APROBADA,
    });

    const [updateArgs] = prisma.empresa.update.mock.calls[0] as [
      { data: Record<string, unknown> },
    ];

    expect(updateArgs.data).not.toHaveProperty('ruc');
    expect(updateArgs.data).not.toHaveProperty('razonSocial');
    expect(updateArgs.data).not.toHaveProperty('estadoValidacion');
  });

  it('listar retorna formato paginado estandar', async () => {
    prisma.$transaction.mockResolvedValueOnce([[{ id: 'empresa-1' }], 1]);

    const result = await service.listar({
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      data: [{ id: 'empresa-1' }],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('validar aprueba empresa pendiente y actualiza validadoPorId', async () => {
    prisma.empresa.findUnique
      .mockResolvedValueOnce({
        id: 'empresa-1',
        estadoValidacion: EstadoValidacionEmpresa.PENDIENTE,
      })
      .mockResolvedValueOnce({
        id: 'empresa-1',
        estadoValidacion: EstadoValidacionEmpresa.APROBADA,
      });
    prisma.$transaction.mockImplementation(
      (
        callback: (tx: {
          empresa: { update: typeof prisma.empresa.update };
          usuario: { update: typeof prisma.usuario.update };
        }) => Promise<unknown>,
      ) =>
        callback({
          empresa: { update: prisma.empresa.update },
          usuario: { update: prisma.usuario.update },
        }),
    );

    await service.validar('admin-1', {
      empresaId: 'empresa-1',
      decision: EstadoValidacionEmpresa.APROBADA,
    });

    const [updateArgs] = prisma.empresa.update.mock.calls[0] as [
      {
        data: {
          validadoPorId: string;
          estadoValidacion: EstadoValidacionEmpresa;
        };
      },
    ];

    expect(updateArgs.data.validadoPorId).toBe('admin-1');
    expect(updateArgs.data.estadoValidacion).toBe(
      EstadoValidacionEmpresa.APROBADA,
    );
  });

  it('validar lanza BadRequestException si la empresa ya fue procesada', async () => {
    prisma.empresa.findUnique.mockResolvedValue({
      id: 'empresa-1',
      estadoValidacion: EstadoValidacionEmpresa.RECHAZADA,
    });

    await expect(
      service.validar('admin-1', {
        empresaId: 'empresa-1',
        decision: EstadoValidacionEmpresa.APROBADA,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('getById para EGRESADO no retorna campos internos de validacion', async () => {
    prisma.empresa.findUnique.mockResolvedValue({
      id: 'empresa-1',
      nombreComercial: 'Acme',
      descripcion: 'Tech',
      sitioWeb: 'https://acme.test',
      ciudad: 'Lima',
      region: 'Lima',
      pais: 'Peru',
      sector: null,
    });

    const result = await service.getById(
      { id: 'empresa-1' },
      {
        id: 'egresado-1',
        email: 'egresado@example.com',
        rol: RolUsuario.EGRESADO,
      },
    );

    expect(result).not.toHaveProperty('estadoValidacion');
    expect(result).not.toHaveProperty('motivoRechazo');
    expect(result).not.toHaveProperty('ruc');
  });

  it('assertEmpresaAprobada lanza ForbiddenException si la empresa esta pendiente', async () => {
    prisma.empresa.findUnique.mockResolvedValue({
      id: 'empresa-1',
      estadoValidacion: EstadoValidacionEmpresa.PENDIENTE,
    });

    await expect(
      service.assertEmpresaAprobada('empresa-1'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
