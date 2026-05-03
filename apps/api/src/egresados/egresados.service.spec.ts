import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  NivelHabilidad,
  RolUsuario,
} from '@graduate-employment-management/database';
import { EgresadosService } from './egresados.service';

describe('EgresadosService', () => {
  const prisma = {
    egresado: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    carrera: {
      findUnique: jest.fn(),
    },
    formacionEgresado: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    experienciaEgresado: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    habilidad: {
      findMany: jest.fn(),
    },
    habilidadEgresado: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  let service: EgresadosService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new EgresadosService(prisma as never);
  });

  it('getMiPerfil lanza NotFoundException si no existe perfil', async () => {
    prisma.egresado.findUnique.mockResolvedValue(null);

    await expect(service.getMiPerfil('user-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updateMiPerfil verifica existencia de carrera si se envía carreraId', async () => {
    prisma.egresado.findUnique
      .mockResolvedValueOnce({ id: 'user-1' })
      .mockResolvedValueOnce(null);

    await expect(
      service.updateMiPerfil('user-1', {
        carreraId: '550e8400-e29b-41d4-a716-446655440000',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updateFormacion lanza ForbiddenException si la formación no pertenece al egresado', async () => {
    prisma.formacionEgresado.findUnique.mockResolvedValue({
      id: 'form-1',
      egresadoId: 'other-user',
      fechaInicio: null,
      fechaFin: null,
      esActual: false,
    });

    await expect(
      service.updateFormacion('user-1', {
        id: 'form-1',
        institucion: 'UNI',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('updateExperiencia lanza ForbiddenException si la experiencia no pertenece al egresado', async () => {
    prisma.experienciaEgresado.findUnique.mockResolvedValue({
      id: 'exp-1',
      egresadoId: 'other-user',
      fechaInicio: null,
      fechaFin: null,
      esActual: false,
    });

    await expect(
      service.updateExperiencia('user-1', {
        id: 'exp-1',
        empresa: 'Acme',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('syncHabilidades rechaza IDs duplicados', async () => {
    prisma.egresado.findUnique.mockResolvedValue({ id: 'user-1' });

    await expect(
      service.syncHabilidades('user-1', {
        habilidades: [
          {
            habilidadId: '550e8400-e29b-41d4-a716-446655440000',
            nivel: NivelHabilidad.AVANZADO,
          },
          {
            habilidadId: '550e8400-e29b-41d4-a716-446655440000',
            nivel: NivelHabilidad.EXPERTO,
          },
        ],
      }),
    ).rejects.toThrow('No se permiten habilidades duplicadas');
  });

  it('buscar retorna formato paginado estándar', async () => {
    prisma.$transaction.mockResolvedValueOnce([
      [{ id: 'user-1', nombres: 'Ana' }],
      1,
    ]);

    const result = await service.buscar(
      {
        page: 1,
        limit: 10,
      },
      {
        id: 'admin-1',
        email: 'admin@example.com',
        rol: RolUsuario.ADMINISTRADOR,
      },
    );

    expect(result).toEqual({
      data: [{ id: 'user-1', nombres: 'Ana' }],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  it('getById para EMPRESA no retorna dni', async () => {
    prisma.egresado.findUnique.mockResolvedValue({
      id: 'user-1',
      nombres: 'Ana',
      apellidos: 'Pérez',
      presentacion: 'Frontend developer',
      ciudad: 'Lima',
      region: 'Lima',
      pais: 'Peru',
      anioEgreso: 2024,
      carrera: null,
      formaciones: [],
      experiencias: [],
      habilidades: [],
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });

    const result = await service.getById(
      { id: 'user-1' },
      {
        id: 'empresa-1',
        email: 'empresa@example.com',
        rol: RolUsuario.EMPRESA,
      },
    );

    expect(result).not.toHaveProperty('dni');
  });
});
