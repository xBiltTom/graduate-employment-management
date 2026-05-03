import { BadRequestException, ForbiddenException } from '@nestjs/common';
import {
  EstadoOferta,
  ModalidadOferta,
  RolUsuario,
  TipoContrato,
} from '@graduate-employment-management/database';
import { OfertasService } from './ofertas.service';

describe('OfertasService', () => {
  const prisma = {
    ofertaLaboral: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    habilidad: {
      findMany: jest.fn(),
    },
    habilidadOferta: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const empresasService = {
    assertEmpresaAprobada: jest.fn(),
  };
  const notificacionesService = {
    notificarOfertaModerada: jest.fn(),
  };
  const auditoriaService = {
    registrarSeguro: jest.fn(),
  };

  let service: OfertasService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new OfertasService(
      prisma as never,
      empresasService as never,
      notificacionesService as never,
      auditoriaService as never,
    );
  });

  it('create llama a assertEmpresaAprobada', async () => {
    prisma.habilidad.findMany.mockResolvedValue([]);
    prisma.$transaction.mockImplementation(
      async (
        callback: (tx: {
          ofertaLaboral: { create: typeof prisma.ofertaLaboral.create };
          habilidadOferta: {
            createMany: typeof prisma.habilidadOferta.createMany;
          };
        }) => Promise<void>,
      ) =>
        callback({
          ofertaLaboral: { create: prisma.ofertaLaboral.create },
          habilidadOferta: { createMany: prisma.habilidadOferta.createMany },
        }),
    );
    prisma.ofertaLaboral.create.mockResolvedValue({ id: 'oferta-1' });
    prisma.ofertaLaboral.findUnique.mockResolvedValue({
      id: 'oferta-1',
      titulo: 'Backend',
      descripcion: 'Node',
      vacantes: 1,
      modalidad: ModalidadOferta.REMOTO,
      tipoContrato: TipoContrato.TIEMPO_COMPLETO,
      salarioMin: null,
      salarioMax: null,
      ciudad: null,
      region: null,
      pais: null,
      distrito: null,
      direccion: null,
      estado: EstadoOferta.PENDIENTE_REVISION,
      publicadoEn: null,
      cierreEn: null,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
      empresa: {
        id: 'empresa-1',
        nombreComercial: 'Acme',
        descripcion: null,
        sitioWeb: null,
        ciudad: null,
        region: null,
        pais: null,
        sector: null,
      },
      habilidades: [],
      _count: { postulaciones: 0 },
    });

    await service.create('empresa-1', {
      titulo: 'Backend',
      descripcion: 'Node',
      modalidad: ModalidadOferta.REMOTO,
      tipoContrato: TipoContrato.TIEMPO_COMPLETO,
    });

    expect(empresasService.assertEmpresaAprobada).toHaveBeenCalledWith(
      'empresa-1',
    );
  });

  it('create rechaza salarioMin > salarioMax', async () => {
    await expect(
      service.create('empresa-1', {
        titulo: 'Backend',
        descripcion: 'Node',
        modalidad: ModalidadOferta.REMOTO,
        tipoContrato: TipoContrato.TIEMPO_COMPLETO,
        salarioMin: 5000,
        salarioMax: 2000,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('create rechaza habilidades duplicadas', async () => {
    await expect(
      service.create('empresa-1', {
        titulo: 'Backend',
        descripcion: 'Node',
        modalidad: ModalidadOferta.REMOTO,
        tipoContrato: TipoContrato.TIEMPO_COMPLETO,
        habilidadIds: [
          '550e8400-e29b-41d4-a716-446655440000',
          '550e8400-e29b-41d4-a716-446655440000',
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('update lanza ForbiddenException si la oferta no pertenece a la empresa', async () => {
    prisma.ofertaLaboral.findUnique.mockResolvedValue({
      id: 'oferta-1',
      empresaId: 'empresa-2',
      estado: EstadoOferta.ACTIVA,
    });

    await expect(
      service.update('empresa-1', {
        id: 'oferta-1',
        titulo: 'Nuevo titulo',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('delete lanza BadRequestException si la oferta tiene postulaciones', async () => {
    prisma.ofertaLaboral.findUnique.mockResolvedValue({
      id: 'oferta-1',
      empresaId: 'empresa-1',
      _count: {
        postulaciones: 2,
      },
    });

    await expect(
      service.delete('empresa-1', 'oferta-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('cerrar cambia estado a CERRADA', async () => {
    prisma.ofertaLaboral.findUnique
      .mockResolvedValueOnce({
        id: 'oferta-1',
        empresaId: 'empresa-1',
        _count: {
          postulaciones: 0,
        },
      })
      .mockResolvedValueOnce({
        id: 'oferta-1',
        titulo: 'Backend',
        descripcion: 'Node',
        vacantes: 1,
        modalidad: ModalidadOferta.REMOTO,
        tipoContrato: TipoContrato.TIEMPO_COMPLETO,
        salarioMin: null,
        salarioMax: null,
        ciudad: null,
        region: null,
        pais: null,
        distrito: null,
        direccion: null,
        estado: EstadoOferta.CERRADA,
        publicadoEn: null,
        cierreEn: null,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
        empresa: {
          id: 'empresa-1',
          nombreComercial: 'Acme',
          descripcion: null,
          sitioWeb: null,
          ciudad: null,
          region: null,
          pais: null,
          sector: null,
        },
        habilidades: [],
        _count: { postulaciones: 0 },
      });
    prisma.ofertaLaboral.update.mockResolvedValue({});

    await service.cerrar('empresa-1', 'oferta-1');

    const [updateArgs] = prisma.ofertaLaboral.update.mock.calls[0] as [
      { data: { estado: EstadoOferta } },
    ];
    expect(updateArgs.data.estado).toBe(EstadoOferta.CERRADA);
  });

  it('adminModerar aprueba oferta pendiente y cambia estado a ACTIVA', async () => {
    prisma.ofertaLaboral.findUnique
      .mockResolvedValueOnce({
        id: 'oferta-1',
        estado: EstadoOferta.PENDIENTE_REVISION,
      })
      .mockResolvedValueOnce({
        id: 'oferta-1',
        titulo: 'Backend',
        descripcion: 'Node',
        vacantes: 1,
        modalidad: ModalidadOferta.REMOTO,
        tipoContrato: TipoContrato.TIEMPO_COMPLETO,
        salarioMin: null,
        salarioMax: null,
        ciudad: null,
        region: null,
        pais: null,
        distrito: null,
        direccion: null,
        estado: EstadoOferta.ACTIVA,
        publicadoEn: new Date(),
        cierreEn: null,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
        empresa: {
          id: 'empresa-1',
          nombreComercial: 'Acme',
          descripcion: null,
          sitioWeb: null,
          ciudad: null,
          region: null,
          pais: null,
          sector: null,
        },
        habilidades: [],
        _count: { postulaciones: 0 },
      });
    prisma.ofertaLaboral.update.mockResolvedValue({});

    await service.adminModerar('admin-1', {
      id: 'oferta-1',
      decision: 'APROBAR',
    });

    const [updateArgs] = prisma.ofertaLaboral.update.mock.calls[0] as [
      { data: { estado: EstadoOferta } },
    ];
    expect(updateArgs.data.estado).toBe(EstadoOferta.ACTIVA);
  });

  it('feed retorna formato paginado estandar', async () => {
    prisma.$transaction.mockResolvedValueOnce([[{ id: 'oferta-1' }], 1]);

    const result = await service.feed(
      {
        page: 1,
        limit: 10,
      },
      {
        id: 'egresado-1',
        email: 'egresado@example.com',
        rol: RolUsuario.EGRESADO,
      },
    );

    expect(result).toEqual({
      data: [{ id: 'oferta-1' }],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('getById bloquea a egresado si la oferta no es publica/activa', async () => {
    prisma.ofertaLaboral.findUnique.mockResolvedValue({
      id: 'oferta-1',
      estado: EstadoOferta.PENDIENTE_REVISION,
      empresa: {
        id: 'empresa-1',
      },
    });

    await expect(
      service.getById('oferta-1', {
        id: 'egresado-1',
        email: 'egresado@example.com',
        rol: RolUsuario.EGRESADO,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
