import { BadRequestException, ForbiddenException } from '@nestjs/common';
import {
  EstadoReporte,
  RolUsuario,
  TipoReporte,
} from '@graduate-employment-management/database';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { ReportsJobService } from './services/reports-job.service';
import { ReportsStorageService } from './services/reports-storage.service';
import { ReportesService } from './reportes.service';

describe('ReportesService', () => {
  const prisma = {
    reporte: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    ofertaLaboral: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const reportsJobService = {
    processReport: jest.fn(),
  };

  const reportsStorageService = {
    resolveExistingReportPath: jest.fn(),
  };

  let service: ReportesService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ReportesService(
      prisma as never,
      reportsJobService as never,
      reportsStorageService as never,
    );
  });

  it('solicitar bloquea a EGRESADO para reportes de gestion', async () => {
    await expect(
      service.solicitar(
        {
          id: 'eg-1',
          email: 'eg@example.com',
          rol: RolUsuario.EGRESADO,
        },
        {
          tipo: TipoReporte.EMPLEABILIDAD,
        },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('solicitar permite ADMINISTRADOR para EMPLEABILIDAD', async () => {
    prisma.reporte.create.mockResolvedValue({ id: 'rep-1' });
    prisma.reporte.findUnique.mockResolvedValue({
      id: 'rep-1',
      usuarioId: 'admin-1',
      tipo: TipoReporte.EMPLEABILIDAD,
      estado: EstadoReporte.COMPLETADO,
      parametros: {},
      mensajeError: null,
      nombreArchivo: 'rep-1.pdf',
      creadoEn: new Date(),
      iniciadoEn: new Date(),
      completadoEn: new Date(),
      archivo: null,
    });

    const result = await service.solicitar(
      {
        id: 'admin-1',
        email: 'admin@example.com',
        rol: RolUsuario.ADMINISTRADOR,
      },
      {
        tipo: TipoReporte.EMPLEABILIDAD,
      },
    );

    expect(prisma.reporte.create).toHaveBeenCalled();
    expect(reportsJobService.processReport).toHaveBeenCalledWith('rep-1');
    expect(result.id).toBe('rep-1');
  });

  it('solicitar bloquea a EMPRESA si intenta reporte de oferta ajena', async () => {
    prisma.ofertaLaboral.findUnique.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      empresaId: 'otra-empresa',
    });

    await expect(
      service.solicitar(
        {
          id: 'emp-1',
          email: 'emp@example.com',
          rol: RolUsuario.EMPRESA,
        },
        {
          tipo: TipoReporte.POSTULACIONES_POR_OFERTA,
          parametros: {
            ofertaId: '11111111-1111-4111-8111-111111111111',
          },
        },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('misReportes retorna formato paginado estandar', async () => {
    prisma.$transaction.mockResolvedValueOnce([
      [
        {
          id: 'rep-1',
          usuarioId: 'user-1',
          tipo: TipoReporte.EMPLEABILIDAD,
          estado: EstadoReporte.COMPLETADO,
          parametros: {},
          mensajeError: null,
          nombreArchivo: 'rep-1.pdf',
          creadoEn: new Date(),
          iniciadoEn: new Date(),
          completadoEn: new Date(),
          archivo: null,
        },
      ],
      1,
    ]);

    const result = await service.misReportes('user-1', {
      page: 1,
      limit: 10,
    });

    expect(result.meta.total).toBe(1);
    expect(result.data[0].downloadUrl).toBe('/api/v1/reportes/rep-1/download');
  });

  it('getById lanza ForbiddenException si el reporte no pertenece al usuario', async () => {
    prisma.reporte.findUnique.mockResolvedValue({
      id: 'rep-1',
      usuarioId: 'otro',
      tipo: TipoReporte.EMPLEABILIDAD,
      estado: EstadoReporte.COMPLETADO,
      parametros: {},
      mensajeError: null,
      nombreArchivo: 'rep-1.pdf',
      creadoEn: new Date(),
      iniciadoEn: new Date(),
      completadoEn: new Date(),
      archivo: null,
    });

    await expect(
      service.getById(
        {
          id: 'user-1',
          email: 'user@example.com',
          rol: RolUsuario.EMPRESA,
        },
        'rep-1',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('reintentar lanza BadRequestException si el reporte no esta FALLIDO', async () => {
    prisma.reporte.findUnique.mockResolvedValue({
      id: 'rep-1',
      usuarioId: 'user-1',
      tipo: TipoReporte.EMPLEABILIDAD,
      estado: EstadoReporte.COMPLETADO,
      parametros: {},
      mensajeError: null,
      nombreArchivo: 'rep-1.pdf',
      creadoEn: new Date(),
      iniciadoEn: new Date(),
      completadoEn: new Date(),
      archivo: null,
    });

    await expect(
      service.reintentar(
        {
          id: 'user-1',
          email: 'user@example.com',
          rol: RolUsuario.ADMINISTRADOR,
        },
        'rep-1',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('download lanza BadRequestException si el reporte no esta COMPLETADO', async () => {
    prisma.reporte.findUnique.mockResolvedValue({
      id: 'rep-1',
      usuarioId: 'user-1',
      tipo: TipoReporte.EMPLEABILIDAD,
      estado: EstadoReporte.PROCESANDO,
      parametros: {},
      mensajeError: null,
      nombreArchivo: null,
      creadoEn: new Date(),
      iniciadoEn: new Date(),
      completadoEn: null,
      archivo: null,
    });

    await expect(
      service.download(
        {
          id: 'user-1',
          email: 'user@example.com',
          rol: RolUsuario.ADMINISTRADOR,
        },
        'rep-1',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('ReportsStorageService', () => {
  const tempDir = path.join(process.cwd(), 'tmp-reportes-tests');
  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'REPORTS_STORAGE_DIR') {
        return tempDir;
      }

      return undefined;
    }),
  };

  let service: ReportsStorageService;

  beforeEach(async () => {
    service = new ReportsStorageService(configService as never);
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('rechaza rutas fuera del storage dir', () => {
    expect(() => service.getReportPath('../evil.pdf')).toThrow(
      BadRequestException,
    );
  });
});

describe('PdfGeneratorService', () => {
  it('genera un Buffer no vacio', async () => {
    const service = new PdfGeneratorService();

    const buffer = await service.generateReportPdf({
      title: 'Reporte',
      generatedBy: 'admin@example.com',
      generatedAt: new Date(),
      sections: [
        {
          heading: 'Resumen',
          metrics: [{ label: 'Total', value: 1 }],
        },
      ],
    });

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.byteLength).toBeGreaterThan(0);
  });
});

describe('ReportsJobService', () => {
  const prisma = {
    reporte: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    archivo: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const pdfGeneratorService = {
    generateReportPdf: jest.fn(),
  };

  const reportsStorageService = {
    buildReportFilename: jest.fn(),
    deleteIfExists: jest.fn(),
    writePdf: jest.fn(),
  };

  const configService = {
    get: jest.fn(() => 'http://localhost:3001/api/v1/reportes'),
  };

  const notificacionesService = {
    crearInterna: jest.fn(),
  };

  let service: ReportsJobService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ReportsJobService(
      prisma as never,
      pdfGeneratorService,
      reportsStorageService as never,
      configService as never,
      notificacionesService as never,
    );
  });

  it('marca reporte como FALLIDO si ocurre error', async () => {
    prisma.reporte.findUnique.mockResolvedValue({
      id: 'rep-1',
      usuarioId: 'user-1',
      tipo: TipoReporte.EMPLEABILIDAD,
      estado: EstadoReporte.PENDIENTE,
      parametros: {},
      nombreArchivo: null,
      archivoId: null,
      mensajeError: null,
      usuario: {
        id: 'user-1',
        email: 'user@example.com',
        rol: RolUsuario.ADMINISTRADOR,
      },
      archivo: null,
    });
    pdfGeneratorService.generateReportPdf.mockRejectedValue(
      new Error('fallo pdf'),
    );

    await service.processReport('rep-1');

    const updateCalls = prisma.reporte.update.mock.calls as Array<
      [
        {
          where: { id: string };
          data: { estado: EstadoReporte };
        },
      ]
    >;

    expect(updateCalls[1]?.[0].where.id).toBe('rep-1');
    expect(updateCalls[1]?.[0].data.estado).toBe(EstadoReporte.FALLIDO);
  });
});
