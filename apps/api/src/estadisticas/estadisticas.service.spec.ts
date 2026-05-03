import { BadRequestException, ForbiddenException } from '@nestjs/common';
import {
  EstadoOferta,
  EstadoPostulacion,
} from '@graduate-employment-management/database';
import { EstadisticasService } from './estadisticas.service';

describe('EstadisticasService', () => {
  const prisma = {
    egresado: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    empresa: {
      count: jest.fn(),
      findUnique: jest.fn(),
    },
    ofertaLaboral: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    postulacion: {
      count: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
    habilidadEgresado: {
      findMany: jest.fn(),
    },
    habilidadOferta: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  let service: EstadisticasService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new EstadisticasService(prisma as never);
  });

  it('adminKPIs calcula tasas evitando division por cero', async () => {
    prisma.egresado.count.mockResolvedValueOnce(0);
    prisma.empresa.count.mockResolvedValueOnce(0);
    prisma.empresa.count.mockResolvedValueOnce(0);
    prisma.ofertaLaboral.count.mockResolvedValueOnce(0);
    prisma.postulacion.count.mockResolvedValueOnce(0);
    prisma.postulacion.count.mockResolvedValueOnce(0);
    prisma.postulacion.findMany.mockResolvedValueOnce([]);

    await expect(service.adminKPIs({})).resolves.toEqual({
      totalEgresados: 0,
      totalEmpresas: 0,
      empresasAprobadas: 0,
      ofertasActivas: 0,
      totalPostulaciones: 0,
      contrataciones: 0,
      tasaContratacion: 0,
      tasaEmpleabilidad: 0,
    });
  });

  it('adminPostulacionesPorEstado ordena por flujo correcto', async () => {
    prisma.postulacion.groupBy.mockResolvedValue([
      { estado: EstadoPostulacion.RECHAZADO, _count: { _all: 1 } },
      { estado: EstadoPostulacion.POSTULADO, _count: { _all: 2 } },
      { estado: EstadoPostulacion.CONTRATADO, _count: { _all: 3 } },
    ]);

    const result = await service.adminPostulacionesPorEstado({});

    expect(result).toEqual([
      { estado: EstadoPostulacion.POSTULADO, total: 2 },
      { estado: EstadoPostulacion.EN_REVISION, total: 0 },
      { estado: EstadoPostulacion.ENTREVISTA, total: 0 },
      { estado: EstadoPostulacion.CONTRATADO, total: 3 },
      { estado: EstadoPostulacion.RECHAZADO, total: 1 },
    ]);
  });

  it('adminEgresadosPorCarrera incluye grupo Sin carrera si aplica', async () => {
    prisma.egresado.findMany.mockResolvedValue([
      { carreraId: 'c1', carrera: { nombre: 'Sistemas' } },
      { carreraId: null, carrera: null },
    ]);

    const result = await service.adminEgresadosPorCarrera({});

    expect(result).toEqual([
      { carreraId: 'c1', carrera: 'Sistemas', total: 1 },
      { carreraId: null, carrera: 'Sin carrera', total: 1 },
    ]);
  });

  it('egresadoResumen calcula tasaRespuesta', async () => {
    prisma.egresado.findUnique.mockResolvedValue({ id: 'eg-1' });
    prisma.postulacion.groupBy.mockResolvedValue([
      { estado: EstadoPostulacion.POSTULADO, _count: { _all: 1 } },
      { estado: EstadoPostulacion.EN_REVISION, _count: { _all: 1 } },
      { estado: EstadoPostulacion.RECHAZADO, _count: { _all: 2 } },
    ]);
    prisma.habilidadEgresado.findMany.mockResolvedValue([]);

    const result = await service.egresadoResumen('eg-1');

    expect(result.tasaRespuesta).toBe(75);
    expect(result.totalPostulaciones).toBe(4);
  });

  it('egresadoRecomendacionesBasicas excluye ofertas ya postuladas', async () => {
    prisma.egresado.findUnique.mockResolvedValue({ id: 'eg-1' });
    prisma.habilidadEgresado.findMany.mockResolvedValue([
      { habilidadId: 'h1' },
      { habilidadId: 'h2' },
    ]);
    prisma.postulacion.findMany.mockResolvedValue([{ ofertaId: 'of-omitida' }]);
    prisma.ofertaLaboral.findMany.mockResolvedValue([
      {
        id: 'of-2',
        titulo: 'Backend',
        empresa: { nombreComercial: 'ACME' },
        habilidades: [{ habilidadId: 'h1' }, { habilidadId: 'h3' }],
      },
    ]);

    const result: Array<{
      ofertaId: string;
      titulo: string;
      empresa: string;
      coincidencias: number;
      totalHabilidadesOferta: number;
      porcentajeMatch: number;
    }> = await service.egresadoRecomendacionesBasicas('eg-1', {});

    const ofertaFindManyCalls = prisma.ofertaLaboral.findMany.mock
      .calls as Array<
      [
        {
          where?: {
            id?: {
              notIn?: string[];
            };
          };
        },
      ]
    >;
    const ofertaFindManyArgs = ofertaFindManyCalls[0]?.[0];

    expect(ofertaFindManyArgs?.where?.id?.notIn).toEqual(['of-omitida']);
    expect(result).toHaveLength(1);
    expect(result[0].ofertaId).toBe('of-2');
  });

  it('empresaResumen solo usa ofertas de la empresa', async () => {
    prisma.empresa.findUnique.mockResolvedValue({ id: 'emp-1' });
    prisma.ofertaLaboral.count.mockResolvedValueOnce(4);
    prisma.ofertaLaboral.count.mockResolvedValueOnce(2);
    prisma.postulacion.count.mockResolvedValueOnce(10);
    prisma.postulacion.count.mockResolvedValueOnce(3);
    prisma.postulacion.count.mockResolvedValueOnce(1);
    prisma.postulacion.findMany.mockResolvedValue([
      { egresadoId: 'eg-1' },
      { egresadoId: 'eg-2' },
    ]);

    const result: {
      totalOfertas: number;
      ofertasActivas: number;
      totalPostulaciones: number;
      postulantesUnicos: number;
      entrevistas: number;
      contratados: number;
      tasaConversion: number;
    } = await service.empresaResumen('emp-1', {});

    const countCalls = prisma.postulacion.count.mock.calls as Array<
      [
        {
          where?: {
            oferta?: {
              is?: {
                empresaId?: string;
              };
            };
          };
        },
      ]
    >;
    const countArgs = countCalls[0]?.[0];

    expect(countArgs?.where?.oferta?.is?.empresaId).toBe('emp-1');
    expect(result.totalOfertas).toBe(4);
    expect(result.postulantesUnicos).toBe(2);
  });

  it('empresaEmbudoPostulantes verifica propiedad de oferta si llega ofertaId', async () => {
    prisma.empresa.findUnique.mockResolvedValue({ id: 'emp-1' });
    prisma.ofertaLaboral.findUnique.mockResolvedValue({
      id: 'of-1',
      empresaId: 'otra-empresa',
    });

    await expect(
      service.empresaEmbudoPostulantes('emp-1', { ofertaId: 'of-1' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('empresaRendimientoOfertas retorna formato paginado', async () => {
    prisma.empresa.findUnique.mockResolvedValue({ id: 'emp-1' });
    prisma.$transaction.mockResolvedValue([
      [
        {
          id: 'of-1',
          titulo: 'Backend',
          estado: EstadoOferta.ACTIVA,
          postulaciones: [
            { estado: EstadoPostulacion.ENTREVISTA },
            { estado: EstadoPostulacion.CONTRATADO },
          ],
        },
      ],
      1,
    ]);

    const result = await service.empresaRendimientoOfertas('emp-1', {
      page: 1,
      limit: 10,
    });

    expect(result.meta).toEqual({
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    expect(result.data[0].tasaConversion).toBe(50);
  });

  it('fechaDesde mayor que fechaHasta lanza BadRequestException', async () => {
    await expect(
      service.adminKPIs({
        fechaDesde: new Date('2026-02-01'),
        fechaHasta: new Date('2026-01-01'),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
