import { NotFoundException } from '@nestjs/common';
import { RolUsuario } from '@graduate-employment-management/database';
import { AuditoriaService } from './auditoria.service';

describe('AuditoriaService', () => {
  const prisma = {
    auditoria: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  let service: AuditoriaService;

  const adminUser = {
    id: 'admin-1',
    email: 'admin@example.com',
    rol: RolUsuario.ADMINISTRADOR,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AuditoriaService(prisma as never);
  });

  it('registrar sanea claves sensibles', async () => {
    prisma.auditoria.create.mockResolvedValue(undefined);

    await service.registrar({
      usuarioId: 'admin-1',
      accion: 'USUARIO_LOGIN',
      entidad: 'Usuario',
      datosNuevos: {
        password: 'secret',
        accessToken: 'token-123',
        perfil: {
          proveedorId: 'oauth-123',
        },
      },
    });

    const [call] = prisma.auditoria.create.mock.calls as [
      [
        {
          data: {
            datosNuevos: Record<string, unknown>;
          };
        },
      ],
    ];

    expect(call[0].data.datosNuevos).toEqual({
      password: '[REDACTED]',
      accessToken: '[REDACTED]',
      perfil: {
        proveedorId: '[REDACTED]',
      },
    });
  });

  it('registrarSeguro no lanza error si Prisma falla', async () => {
    prisma.auditoria.create.mockRejectedValue(new Error('db down'));

    await expect(
      service.registrarSeguro({
        accion: 'OFERTA_CREAR',
        entidad: 'OfertaLaboral',
      }),
    ).resolves.toBeUndefined();
  });

  it('listar retorna formato paginado', async () => {
    prisma.$transaction.mockResolvedValue([
      [
        {
          id: 'audit-1',
          usuarioId: 'admin-1',
          accion: 'EMPRESA_VALIDADA',
          entidad: 'Empresa',
          entidadId: 'empresa-1',
          datosAnteriores: { estadoValidacion: 'PENDIENTE' },
          datosNuevos: { estadoValidacion: 'APROBADA' },
          ip: null,
          userAgent: null,
          creadoEn: new Date(),
          usuario: adminUser,
        },
      ],
      1,
    ]);

    const result = await service.listar(adminUser, { page: 1, limit: 10 });

    expect(result.meta.total).toBe(1);
    expect(result.data[0]?.accion).toBe('EMPRESA_VALIDADA');
  });

  it('getById lanza NotFoundException si no existe', async () => {
    prisma.auditoria.findUnique.mockResolvedValue(null);

    await expect(service.getById(adminUser, 'audit-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('listar aplica filtros', async () => {
    prisma.$transaction.mockResolvedValue([[], 0]);

    await service.listar(adminUser, {
      usuarioId: 'admin-1',
      accion: 'VALIDAR',
      entidad: 'Empresa',
      entidadId: 'empresa-1',
      fechaDesde: new Date('2026-01-01T00:00:00.000Z'),
      fechaHasta: new Date('2026-01-31T23:59:59.999Z'),
    });

    const [findManyArgs] = prisma.auditoria.findMany.mock.calls as [
      [
        {
          where: {
            usuarioId: string;
            entidadId: string;
            accion: { contains: string };
            entidad: { contains: string };
          };
        },
      ],
    ];

    expect(findManyArgs[0].where).toEqual(
      expect.objectContaining({
        usuarioId: 'admin-1',
        entidadId: 'empresa-1',
      }),
    );
  });

  it('getById retorna datos saneados', async () => {
    prisma.auditoria.findUnique.mockResolvedValue({
      id: 'audit-1',
      usuarioId: 'admin-1',
      accion: 'EGRESADO_VER',
      entidad: 'Egresado',
      entidadId: 'eg-1',
      datosAnteriores: {
        dni: '12345678',
        token: 'abc',
      },
      datosNuevos: null,
      ip: '127.0.0.1',
      userAgent: 'jest',
      creadoEn: new Date(),
      usuario: adminUser,
    });

    const result = await service.getById(adminUser, 'audit-1');

    expect(result.datosAnteriores).toEqual({
      dni: '***5678',
      token: '[REDACTED]',
    });
  });
});
