import {
  CanalNotificacion,
  TipoNotificacion,
} from '@graduate-employment-management/database';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';

describe('NotificacionesService', () => {
  const prisma = {
    notificacion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      create: jest.fn(),
    },
    usuario: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mailService = {
    sendTransactionalEmail: jest.fn(),
  };

  let service: NotificacionesService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new NotificacionesService(prisma as never, mailService as never);
  });

  it('misNotificaciones retorna formato paginado estandar', async () => {
    prisma.$transaction.mockResolvedValueOnce([[{ id: 'notif-1' }], 1]);

    const result = await service.misNotificaciones('user-1', {
      page: 1,
      limit: 10,
    });

    expect(result).toEqual({
      data: [{ id: 'notif-1' }],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('noLeidasCount retorna conteo', async () => {
    prisma.notificacion.count.mockResolvedValue(3);

    await expect(service.noLeidasCount('user-1')).resolves.toEqual({
      count: 3,
    });
  });

  it('getById lanza NotFoundException si no existe', async () => {
    prisma.notificacion.findUnique.mockResolvedValue(null);

    await expect(service.getById('user-1', 'notif-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('getById lanza ForbiddenException si pertenece a otro usuario', async () => {
    prisma.notificacion.findUnique.mockResolvedValue({
      id: 'notif-1',
      usuarioId: 'other-user',
    });

    await expect(service.getById('user-1', 'notif-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('marcarLeida actualiza solo notificacion propia', async () => {
    prisma.notificacion.findUnique.mockResolvedValue({
      id: 'notif-1',
      usuarioId: 'user-1',
      leida: false,
    });
    prisma.notificacion.update.mockResolvedValue({
      id: 'notif-1',
      usuarioId: 'user-1',
      leida: true,
    });

    const result = await service.marcarLeida('user-1', 'notif-1');

    expect(prisma.notificacion.update).toHaveBeenCalled();
    expect(result.leida).toBe(true);
  });

  it('marcarTodasLeidas actualiza todas las del usuario', async () => {
    prisma.notificacion.updateMany.mockResolvedValue({
      count: 4,
    });

    await expect(service.marcarTodasLeidas('user-1')).resolves.toEqual({
      updated: 4,
    });
  });

  it('adminCrearSistema verifica que el usuario destino exista', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    await expect(
      service.adminCrearSistema({
        usuarioId: 'user-2',
        titulo: 'Aviso',
        contenido: 'Contenido',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('crearInterna crea notificacion con canal INTERNA y leida=false', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
    });
    prisma.notificacion.create.mockResolvedValue({
      id: 'notif-1',
      canal: CanalNotificacion.INTERNA,
      leida: false,
    });

    const result = await service.crearInterna({
      usuarioId: 'user-1',
      tipo: TipoNotificacion.SISTEMA,
      titulo: 'Sistema',
      contenido: 'Hola',
    });

    const [createArgs] = prisma.notificacion.create.mock.calls[0] as [
      { data: { canal: CanalNotificacion; leida: boolean } },
    ];

    expect(createArgs.data.canal).toBe(CanalNotificacion.INTERNA);
    expect(createArgs.data.leida).toBe(false);
    expect(result.canal).toBe(CanalNotificacion.INTERNA);
  });

  it('metodos de dominio crean notificaciones con el tipo correcto', async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
    });
    prisma.notificacion.create.mockResolvedValue({});

    await service.notificarEmpresaValidada({
      empresaUsuarioId: 'user-1',
      aprobada: true,
    });
    await service.notificarOfertaModerada({
      empresaUsuarioId: 'user-1',
      ofertaId: 'oferta-1',
      tituloOferta: 'Backend',
      aprobada: true,
    });
    await service.notificarNuevaPostulacion({
      empresaUsuarioId: 'user-1',
      ofertaId: 'oferta-1',
      postulacionId: 'post-1',
      tituloOferta: 'Backend',
      nombreEgresado: 'Ana Perez',
    });
    await service.notificarCambioEstadoPostulacion({
      egresadoUsuarioId: 'user-1',
      postulacionId: 'post-1',
      ofertaId: 'oferta-1',
      tituloOferta: 'Backend',
      nuevoEstado: 'ENTREVISTA',
    });

    const createCalls = prisma.notificacion.create.mock.calls as Array<
      [{ data: { tipo: TipoNotificacion } }]
    >;

    expect(createCalls[0][0].data.tipo).toBe(TipoNotificacion.EMPRESA_VALIDADA);
    expect(createCalls[1][0].data.tipo).toBe(TipoNotificacion.NUEVA_OFERTA);
    expect(createCalls[2][0].data.tipo).toBe(
      TipoNotificacion.POSTULACION_CREADA,
    );
    expect(createCalls[3][0].data.tipo).toBe(
      TipoNotificacion.ESTADO_POSTULACION_CAMBIADO,
    );
  });
});
