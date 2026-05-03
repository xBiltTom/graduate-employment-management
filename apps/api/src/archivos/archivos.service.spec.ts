import { BadRequestException, ForbiddenException } from '@nestjs/common';
import {
  CategoriaArchivo,
  RolUsuario,
  TipoEntidadArchivo,
} from '@graduate-employment-management/database';
import { ConfigService } from '@nestjs/config';
import { ArchivosService } from './archivos.service';
import { LocalFileStorageService } from './services/local-file-storage.service';

describe('ArchivosService', () => {
  const prisma = {
    egresado: {
      findUnique: jest.fn(),
    },
    empresa: {
      findUnique: jest.fn(),
    },
    archivo: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const fileStorageService = {
    save: jest.fn(),
    resolvePath: jest.fn(),
    delete: jest.fn(),
    exists: jest.fn(),
  };

  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'MAX_UPLOAD_SIZE_MB') {
        return 10;
      }

      return undefined;
    }),
  };

  let service: ArchivosService;

  const pdfFile = {
    buffer: Buffer.from('pdf'),
    originalname: 'cv.pdf',
    mimetype: 'application/pdf',
    size: 100,
  };

  const pngFile = {
    buffer: Buffer.from('png'),
    originalname: 'logo.png',
    mimetype: 'image/png',
    size: 100,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ArchivosService(
      prisma as never,
      fileStorageService,
      configService as never,
    );
  });

  it('uploadCv rechaza rol distinto de EGRESADO', async () => {
    await expect(
      service.uploadCv(
        {
          id: 'user-1',
          email: 'empresa@example.com',
          rol: RolUsuario.EMPRESA,
        },
        pdfFile,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('uploadCv rechaza MIME distinto de PDF', async () => {
    prisma.egresado.findUnique.mockResolvedValue({ id: 'user-1' });

    await expect(
      service.uploadCv(
        {
          id: 'user-1',
          email: 'eg@example.com',
          rol: RolUsuario.EGRESADO,
        },
        {
          ...pdfFile,
          originalname: 'cv.png',
          mimetype: 'image/png',
        },
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('uploadLogo rechaza rol distinto de EMPRESA', async () => {
    await expect(
      service.uploadLogo(
        {
          id: 'user-1',
          email: 'eg@example.com',
          rol: RolUsuario.EGRESADO,
        },
        pngFile,
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('uploadLogo acepta PNG/JPEG/WEBP', async () => {
    prisma.empresa.findUnique.mockResolvedValue({ id: 'emp-1' });
    prisma.archivo.findMany.mockResolvedValue([]);
    fileStorageService.save.mockResolvedValue({
      key: 'logo/test.png',
      size: 100,
    });
    prisma.archivo.create.mockResolvedValue({
      id: 'file-1',
      key: 'logo/test.png',
      nombreArchivo: 'logo.png',
      mimeType: 'image/png',
      tamanio: 100,
      categoria: CategoriaArchivo.LOGO,
      tipoEntidad: TipoEntidadArchivo.EMPRESA,
      entidadId: 'emp-1',
      proveedorAlmacenamiento: 'LOCAL',
      creadoEn: new Date(),
      url: 'LOCAL_PENDING_DOWNLOAD_URL',
    });

    const result = await service.uploadLogo(
      {
        id: 'emp-1',
        email: 'empresa@example.com',
        rol: RolUsuario.EMPRESA,
      },
      pngFile,
    );

    expect(fileStorageService.save).toHaveBeenCalled();
    expect(result.categoria).toBe(CategoriaArchivo.LOGO);
  });

  it('getById lanza ForbiddenException si el archivo no pertenece al usuario', async () => {
    prisma.archivo.findUnique.mockResolvedValue({
      id: 'file-1',
      key: 'cv/test.pdf',
      nombreArchivo: 'cv.pdf',
      mimeType: 'application/pdf',
      tamanio: 100,
      categoria: CategoriaArchivo.CV,
      tipoEntidad: TipoEntidadArchivo.EGRESADO,
      entidadId: 'otro',
      proveedorAlmacenamiento: 'LOCAL',
      creadoEn: new Date(),
      url: 'LOCAL_PENDING_DOWNLOAD_URL',
    });

    await expect(
      service.getById(
        {
          id: 'eg-1',
          email: 'eg@example.com',
          rol: RolUsuario.EGRESADO,
        },
        '11111111-1111-4111-8111-111111111111',
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('delete bloquea archivos con categoria REPORTE', async () => {
    prisma.archivo.findUnique.mockResolvedValue({
      id: 'file-1',
      key: 'report/test.pdf',
      nombreArchivo: 'report.pdf',
      mimeType: 'application/pdf',
      tamanio: 100,
      categoria: CategoriaArchivo.REPORTE,
      tipoEntidad: TipoEntidadArchivo.REPORTE,
      entidadId: 'rep-1',
      proveedorAlmacenamiento: 'LOCAL',
      creadoEn: new Date(),
      url: 'LOCAL_PENDING_DOWNLOAD_URL',
    });

    await expect(
      service.delete(
        {
          id: 'admin-1',
          email: 'admin@example.com',
          rol: RolUsuario.ADMINISTRADOR,
        },
        '11111111-1111-4111-8111-111111111111',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('misArchivos solo retorna archivos asociados al usuario', async () => {
    prisma.archivo.findMany.mockResolvedValue([
      {
        id: 'file-1',
        key: 'cv/test.pdf',
        nombreArchivo: 'cv.pdf',
        mimeType: 'application/pdf',
        tamanio: 100,
        categoria: CategoriaArchivo.CV,
        tipoEntidad: TipoEntidadArchivo.EGRESADO,
        entidadId: 'eg-1',
        proveedorAlmacenamiento: 'LOCAL',
        creadoEn: new Date(),
        url: 'LOCAL_PENDING_DOWNLOAD_URL',
      },
    ]);

    const result = await service.misArchivos(
      {
        id: 'eg-1',
        email: 'eg@example.com',
        rol: RolUsuario.EGRESADO,
      },
      {},
    );

    const firstCall = prisma.archivo.findMany.mock.calls[0] as
      | [{ where: { tipoEntidad: TipoEntidadArchivo; entidadId: string } }]
      | undefined;

    expect(firstCall).toBeDefined();
    expect(firstCall?.[0].where.tipoEntidad).toBe(TipoEntidadArchivo.EGRESADO);
    expect(firstCall?.[0].where.entidadId).toBe('eg-1');
    expect(result).toHaveLength(1);
  });

  it('download no retorna path fisico en metadata', async () => {
    prisma.archivo.findUnique.mockResolvedValue({
      id: 'file-1',
      key: 'cv/test.pdf',
      nombreArchivo: 'cv.pdf',
      mimeType: 'application/pdf',
      tamanio: 100,
      categoria: CategoriaArchivo.CV,
      tipoEntidad: TipoEntidadArchivo.EGRESADO,
      entidadId: 'eg-1',
      proveedorAlmacenamiento: 'LOCAL',
      creadoEn: new Date(),
      url: 'LOCAL_PENDING_DOWNLOAD_URL',
    });
    fileStorageService.resolvePath.mockResolvedValue(
      'C:\\secret\\cv\\test.pdf',
    );

    const result = await service.getById(
      {
        id: 'eg-1',
        email: 'eg@example.com',
        rol: RolUsuario.EGRESADO,
      },
      '11111111-1111-4111-8111-111111111111',
    );

    expect(result).not.toHaveProperty('path');
    expect(result.downloadUrl).toBe('/api/v1/archivos/file-1/download');
  });
});

describe('LocalFileStorageService', () => {
  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'FILES_STORAGE_DIR') {
        return 'storage/files-test';
      }

      return undefined;
    }),
  };

  let service: LocalFileStorageService;

  beforeEach(() => {
    service = new LocalFileStorageService(configService as ConfigService);
  });

  it('rechaza keys con path traversal', () => {
    expect(() => service.getSafePathForTest('../evil.pdf')).toThrow(
      BadRequestException,
    );
  });

  it('genera key segura', () => {
    const key = service.buildSafeKeyForTest(
      CategoriaArchivo.CV,
      'eg-1',
      'application/pdf',
    );

    expect(key.startsWith('cv/')).toBe(true);
    expect(key.endsWith('.pdf')).toBe(true);
    expect(key.includes('..')).toBe(false);
  });
});
