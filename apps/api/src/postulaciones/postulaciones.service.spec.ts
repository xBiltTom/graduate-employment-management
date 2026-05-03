import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoOferta,
  EstadoPostulacion,
  RolUsuario,
} from '@graduate-employment-management/database';
import { PostulacionesService } from './postulaciones.service';

describe('PostulacionesService', () => {
  const prisma = {
    egresado: {
      findUnique: jest.fn(),
    },
    ofertaLaboral: {
      findUnique: jest.fn(),
    },
    postulacion: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    historialEstadoPostulacion: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  const notificacionesService = {
    notificarNuevaPostulacion: jest.fn(),
    notificarCambioEstadoPostulacion: jest.fn(),
  };

  let service: PostulacionesService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new PostulacionesService(
      prisma as never,
      notificacionesService as never,
    );
  });

  it('postular rechaza oferta inexistente', async () => {
    prisma.egresado.findUnique.mockResolvedValue({ id: 'egresado-1' });
    prisma.ofertaLaboral.findUnique.mockResolvedValue(null);

    await expect(
      service.postular('egresado-1', { ofertaId: 'oferta-1' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('postular rechaza oferta no activa', async () => {
    prisma.egresado.findUnique.mockResolvedValue({ id: 'egresado-1' });
    prisma.ofertaLaboral.findUnique.mockResolvedValue({
      id: 'oferta-1',
      estado: EstadoOferta.PENDIENTE_REVISION,
      cierreEn: null,
    });

    await expect(
      service.postular('egresado-1', { ofertaId: 'oferta-1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('postular rechaza postulacion duplicada', async () => {
    prisma.egresado.findUnique.mockResolvedValue({ id: 'egresado-1' });
    prisma.ofertaLaboral.findUnique.mockResolvedValue({
      id: 'oferta-1',
      estado: EstadoOferta.ACTIVA,
      cierreEn: null,
    });
    prisma.postulacion.findUnique.mockResolvedValue({ id: 'post-1' });

    await expect(
      service.postular('egresado-1', { ofertaId: 'oferta-1' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('postular crea postulacion e historial inicial en transaccion', async () => {
    prisma.egresado.findUnique.mockResolvedValue({ id: 'egresado-1' });
    prisma.ofertaLaboral.findUnique.mockResolvedValue({
      id: 'oferta-1',
      estado: EstadoOferta.ACTIVA,
      cierreEn: null,
    });
    prisma.postulacion.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'post-1',
        egresadoId: 'egresado-1',
        oferta: {
          empresaId: 'empresa-1',
        },
      })
      .mockResolvedValueOnce({
        id: 'post-1',
        estado: EstadoPostulacion.POSTULADO,
        comentario: null,
        postuladoEn: new Date(),
        creadoEn: new Date(),
        actualizadoEn: new Date(),
        oferta: {
          id: 'oferta-1',
          titulo: 'Backend',
          modalidad: 'REMOTO',
          tipoContrato: 'TIEMPO_COMPLETO',
          ciudad: null,
          region: null,
          pais: null,
          estado: EstadoOferta.ACTIVA,
          publicadoEn: null,
          cierreEn: null,
          empresa: {
            id: 'empresa-1',
            nombreComercial: 'Acme',
            ciudad: null,
            region: null,
            pais: null,
          },
        },
        egresado: {
          id: 'egresado-1',
          nombres: 'Ana',
          apellidos: 'Perez',
          presentacion: null,
          ciudad: null,
          region: null,
          pais: null,
          anioEgreso: 2024,
          carrera: null,
          habilidades: [],
          formaciones: [],
          experiencias: [],
        },
        historial: [],
      });
    prisma.$transaction.mockImplementation(
      async (
        callback: (tx: {
          postulacion: { create: typeof prisma.postulacion.create };
          historialEstadoPostulacion: {
            create: typeof prisma.historialEstadoPostulacion.create;
          };
        }) => Promise<void>,
      ) =>
        callback({
          postulacion: { create: prisma.postulacion.create },
          historialEstadoPostulacion: {
            create: prisma.historialEstadoPostulacion.create,
          },
        }),
    );
    prisma.postulacion.create.mockResolvedValue({ id: 'post-1' });

    await service.postular('egresado-1', { ofertaId: 'oferta-1' });

    expect(prisma.postulacion.create).toHaveBeenCalled();
    const historialCreateCalls = prisma.historialEstadoPostulacion.create.mock
      .calls as Array<
      [
        {
          data: {
            estadoAnterior: EstadoPostulacion | null;
            estadoNuevo: EstadoPostulacion;
            cambiadoPorId: string;
          };
        },
      ]
    >;
    const createHistorialArgs = historialCreateCalls[0][0];

    expect(createHistorialArgs.data.estadoAnterior).toBeNull();
    expect(createHistorialArgs.data.estadoNuevo).toBe(
      EstadoPostulacion.POSTULADO,
    );
    expect(createHistorialArgs.data.cambiadoPorId).toBe('egresado-1');
  });

  it('misPostulaciones retorna formato paginado estandar', async () => {
    prisma.$transaction.mockResolvedValueOnce([[{ id: 'post-1' }], 1]);

    const result = await service.misPostulaciones('egresado-1', {
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      data: [{ id: 'post-1' }],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('postulantesPorOferta lanza ForbiddenException si la oferta no pertenece a la empresa', async () => {
    prisma.ofertaLaboral.findUnique.mockResolvedValue({
      id: 'oferta-1',
      empresaId: 'empresa-2',
    });

    await expect(
      service.postulantesPorOferta('empresa-1', { ofertaId: 'oferta-1' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('cambiarEstado rechaza transicion invalida', async () => {
    prisma.postulacion.findUnique.mockResolvedValue({
      id: 'post-1',
      estado: EstadoPostulacion.POSTULADO,
      oferta: {
        empresaId: 'empresa-1',
      },
    });

    await expect(
      service.cambiarEstado(
        {
          id: 'empresa-1',
          email: 'empresa@example.com',
          rol: RolUsuario.EMPRESA,
        },
        {
          postulacionId: 'post-1',
          nuevoEstado: EstadoPostulacion.CONTRATADO,
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('cambiarEstado crea historial con estado anterior y nuevo', async () => {
    prisma.postulacion.findUnique
      .mockResolvedValueOnce({
        id: 'post-1',
        estado: EstadoPostulacion.EN_REVISION,
        oferta: {
          empresaId: 'empresa-1',
        },
      })
      .mockResolvedValueOnce({
        id: 'post-1',
        egresadoId: 'egresado-1',
        oferta: {
          empresaId: 'empresa-1',
        },
      })
      .mockResolvedValueOnce({
        id: 'post-1',
        estado: EstadoPostulacion.ENTREVISTA,
        comentario: null,
        postuladoEn: new Date(),
        creadoEn: new Date(),
        actualizadoEn: new Date(),
        oferta: {
          id: 'oferta-1',
          titulo: 'Backend',
          modalidad: 'REMOTO',
          tipoContrato: 'TIEMPO_COMPLETO',
          ciudad: null,
          region: null,
          pais: null,
          estado: EstadoOferta.ACTIVA,
          publicadoEn: null,
          cierreEn: null,
          empresa: {
            id: 'empresa-1',
            nombreComercial: 'Acme',
            ciudad: null,
            region: null,
            pais: null,
          },
        },
        egresado: {
          id: 'egresado-1',
          nombres: 'Ana',
          apellidos: 'Perez',
          presentacion: null,
          ciudad: null,
          region: null,
          pais: null,
          anioEgreso: 2024,
          carrera: null,
          habilidades: [],
          formaciones: [],
          experiencias: [],
        },
        historial: [],
      });
    prisma.$transaction.mockImplementation(
      async (
        callback: (tx: {
          postulacion: { update: typeof prisma.postulacion.update };
          historialEstadoPostulacion: {
            create: typeof prisma.historialEstadoPostulacion.create;
          };
        }) => Promise<void>,
      ) =>
        callback({
          postulacion: { update: prisma.postulacion.update },
          historialEstadoPostulacion: {
            create: prisma.historialEstadoPostulacion.create,
          },
        }),
    );

    await service.cambiarEstado(
      {
        id: 'empresa-1',
        email: 'empresa@example.com',
        rol: RolUsuario.EMPRESA,
      },
      {
        postulacionId: 'post-1',
        nuevoEstado: EstadoPostulacion.ENTREVISTA,
      },
    );

    const historialCreateCalls = prisma.historialEstadoPostulacion.create.mock
      .calls as Array<
      [
        {
          data: {
            estadoAnterior: EstadoPostulacion;
            estadoNuevo: EstadoPostulacion;
          };
        },
      ]
    >;
    const createHistorialArgs = historialCreateCalls[0][0];

    expect(createHistorialArgs.data.estadoAnterior).toBe(
      EstadoPostulacion.EN_REVISION,
    );
    expect(createHistorialArgs.data.estadoNuevo).toBe(
      EstadoPostulacion.ENTREVISTA,
    );
  });

  it('getById bloquea a egresado que intenta ver postulacion ajena', async () => {
    prisma.postulacion.findUnique.mockResolvedValue({
      id: 'post-1',
      egresadoId: 'otro-egresado',
      oferta: {
        empresaId: 'empresa-1',
      },
    });

    await expect(
      service.getById('post-1', {
        id: 'egresado-1',
        email: 'egresado@example.com',
        rol: RolUsuario.EGRESADO,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('getById bloquea a empresa que intenta ver postulacion de oferta ajena', async () => {
    prisma.postulacion.findUnique.mockResolvedValue({
      id: 'post-1',
      egresadoId: 'egresado-1',
      oferta: {
        empresaId: 'empresa-otra',
      },
    });

    await expect(
      service.getById('post-1', {
        id: 'empresa-1',
        email: 'empresa@example.com',
        rol: RolUsuario.EMPRESA,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('historial respeta permisos de acceso', async () => {
    prisma.postulacion.findUnique.mockResolvedValue({
      id: 'post-1',
      egresadoId: 'otro-egresado',
      oferta: {
        empresaId: 'empresa-1',
      },
    });

    await expect(
      service.historial('post-1', {
        id: 'egresado-1',
        email: 'egresado@example.com',
        rol: RolUsuario.EGRESADO,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
