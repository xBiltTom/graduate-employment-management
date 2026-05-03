import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CategoriaArchivo,
  Prisma,
  RolUsuario,
  TipoEntidadArchivo,
} from '@graduate-employment-management/database';
import { ConfigService } from '@nestjs/config';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { PrismaService } from '../prisma/prisma.service';
import {
  GetArchivoByIdInput,
  MisArchivosInput,
} from './schemas/archivos.schemas';
import {
  FileStorageService,
  StoredFileResult,
} from './services/file-storage.service';

type UploadableFile = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
};

const archivoSelect = {
  id: true,
  url: true,
  key: true,
  nombreArchivo: true,
  mimeType: true,
  tamanio: true,
  categoria: true,
  tipoEntidad: true,
  entidadId: true,
  proveedorAlmacenamiento: true,
  creadoEn: true,
} satisfies Prisma.ArchivoSelect;

@Injectable()
export class ArchivosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async uploadCv(user: AuthenticatedUser, file: UploadableFile | undefined) {
    if (user.rol !== RolUsuario.EGRESADO) {
      throw new ForbiddenException('Solo un egresado puede subir su CV');
    }

    await this.ensureEgresadoExists(user.id);
    this.validateIncomingFile(file, {
      allowedMimeTypes: ['application/pdf'],
      maxBytes: this.getMaxBytes(5),
    });
    const validFile = this.ensureFilePresent(file);

    const created = await this.replaceExistingForEntity({
      file: validFile,
      user,
      categoria: CategoriaArchivo.CV,
      tipoEntidad: TipoEntidadArchivo.EGRESADO,
      entidadId: user.id,
    });

    await this.auditoriaService.registrarSeguro({
      usuarioId: user.id,
      accion: 'CV_SUBIDO',
      entidad: 'Archivo',
      entidadId: created.id,
      datosNuevos: {
        categoria: CategoriaArchivo.CV,
        mimeType: created.mimeType,
        tamanio: created.tamanio,
      },
    });

    return created;
  }

  async uploadLogo(user: AuthenticatedUser, file: UploadableFile | undefined) {
    if (user.rol !== RolUsuario.EMPRESA) {
      throw new ForbiddenException(
        'Solo una empresa puede subir su logo institucional',
      );
    }

    await this.ensureEmpresaExists(user.id);
    this.validateIncomingFile(file, {
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      maxBytes: this.getMaxBytes(2),
    });
    const validFile = this.ensureFilePresent(file);

    const created = await this.replaceExistingForEntity({
      file: validFile,
      user,
      categoria: CategoriaArchivo.LOGO,
      tipoEntidad: TipoEntidadArchivo.EMPRESA,
      entidadId: user.id,
    });

    await this.auditoriaService.registrarSeguro({
      usuarioId: user.id,
      accion: 'LOGO_SUBIDO',
      entidad: 'Archivo',
      entidadId: created.id,
      datosNuevos: {
        categoria: CategoriaArchivo.LOGO,
        mimeType: created.mimeType,
        tamanio: created.tamanio,
      },
    });

    return created;
  }

  async getById(user: AuthenticatedUser, input: GetArchivoByIdInput | string) {
    const id = typeof input === 'string' ? input : input.id;
    const archivo = await this.findArchivoOrFail(id);

    this.assertCanAccess(user, archivo);

    return this.toSafeArchivoView(archivo);
  }

  async misArchivos(user: AuthenticatedUser, input: MisArchivosInput) {
    const where = this.buildMisArchivosWhere(user, input);

    const data = await this.prisma.archivo.findMany({
      where,
      select: archivoSelect,
      orderBy: {
        creadoEn: 'desc',
      },
    });

    return data.map((archivo) => this.toSafeArchivoView(archivo));
  }

  async download(user: AuthenticatedUser, id: string) {
    const archivo = await this.findArchivoOrFail(id);

    if (archivo.categoria === CategoriaArchivo.REPORTE) {
      throw new BadRequestException(
        'Usa el flujo de reportes para descargar archivos de reporte',
      );
    }

    this.assertCanAccess(user, archivo);
    const storageKey = this.getStorageKeyOrFail(archivo.key);

    const filePath = await this.fileStorageService.resolvePath(storageKey);

    return {
      path: filePath,
      filename: archivo.nombreArchivo,
      mimeType: archivo.mimeType,
    };
  }

  async delete(user: AuthenticatedUser, id: string) {
    const archivo = await this.findArchivoOrFail(id);

    this.assertCanDelete(user, archivo);

    if (archivo.categoria === CategoriaArchivo.REPORTE) {
      throw new BadRequestException(
        'Los archivos de reportes no se eliminan desde este endpoint',
      );
    }

    const storageKey = this.getStorageKeyOrFail(archivo.key);

    await this.fileStorageService.delete(storageKey);
    await this.prisma.archivo.delete({
      where: {
        id,
      },
    });

    await this.auditoriaService.registrarSeguro({
      usuarioId: user.id,
      accion: 'ARCHIVO_ELIMINADO',
      entidad: 'Archivo',
      entidadId: archivo.id,
      datosAnteriores: {
        categoria: archivo.categoria,
        tipoEntidad: archivo.tipoEntidad,
        entidadId: archivo.entidadId,
        mimeType: archivo.mimeType,
        tamanio: archivo.tamanio,
      },
    });

    return {
      message: 'Archivo eliminado correctamente',
    };
  }

  assertCanAccess(
    user: AuthenticatedUser,
    archivo: Prisma.ArchivoGetPayload<{ select: typeof archivoSelect }>,
  ) {
    if (user.rol === RolUsuario.ADMINISTRADOR) {
      return;
    }

    if (archivo.tipoEntidad === TipoEntidadArchivo.REPORTE) {
      throw new BadRequestException(
        'Usa el flujo de reportes para acceder a este archivo',
      );
    }

    if (
      user.rol === RolUsuario.EGRESADO &&
      archivo.tipoEntidad === TipoEntidadArchivo.EGRESADO &&
      archivo.entidadId === user.id
    ) {
      return;
    }

    if (
      user.rol === RolUsuario.EMPRESA &&
      archivo.tipoEntidad === TipoEntidadArchivo.EMPRESA &&
      archivo.entidadId === user.id
    ) {
      return;
    }

    if (
      archivo.tipoEntidad === TipoEntidadArchivo.USUARIO &&
      archivo.entidadId === user.id
    ) {
      return;
    }

    throw new ForbiddenException('No tienes acceso a este archivo');
  }

  assertCanDelete(
    user: AuthenticatedUser,
    archivo: Prisma.ArchivoGetPayload<{ select: typeof archivoSelect }>,
  ) {
    this.assertCanAccess(user, archivo);
  }

  private async replaceExistingForEntity(input: {
    file: UploadableFile;
    user: AuthenticatedUser;
    categoria: CategoriaArchivo;
    tipoEntidad: TipoEntidadArchivo;
    entidadId: string;
  }) {
    const existing = await this.prisma.archivo.findMany({
      where: {
        categoria: input.categoria,
        tipoEntidad: input.tipoEntidad,
        entidadId: input.entidadId,
      },
      select: archivoSelect,
    });

    const stored = await this.fileStorageService.save({
      buffer: input.file.buffer,
      originalName: input.file.originalname,
      mimeType: input.file.mimetype,
      category: input.categoria,
      ownerId: input.user.id,
    });

    try {
      for (const archivo of existing) {
        if (!archivo.key) {
          continue;
        }

        await this.fileStorageService.delete(archivo.key);
      }

      if (existing.length > 0) {
        await this.prisma.archivo.deleteMany({
          where: {
            id: {
              in: existing.map((archivo) => archivo.id),
            },
          },
        });
      }

      const created = await this.prisma.archivo.create({
        data: this.buildArchivoCreateData({
          file: input.file,
          stored,
          categoria: input.categoria,
          tipoEntidad: input.tipoEntidad,
          entidadId: input.entidadId,
        }),
        select: archivoSelect,
      });

      return this.toSafeArchivoView(created);
    } catch (error) {
      await this.fileStorageService.delete(stored.key);
      throw error;
    }
  }

  private buildArchivoCreateData(input: {
    file: UploadableFile;
    stored: StoredFileResult;
    categoria: CategoriaArchivo;
    tipoEntidad: TipoEntidadArchivo;
    entidadId: string;
  }): Prisma.ArchivoCreateInput {
    return {
      url: this.buildDownloadUrlPlaceholder(),
      key: input.stored.key,
      nombreArchivo: this.sanitizeOriginalName(input.file.originalname),
      mimeType: input.file.mimetype,
      tamanio: input.file.size,
      categoria: input.categoria,
      tipoEntidad: input.tipoEntidad,
      entidadId: input.entidadId,
      proveedorAlmacenamiento: 'LOCAL',
    };
  }

  private validateIncomingFile(
    file: UploadableFile | undefined,
    options: {
      allowedMimeTypes: string[];
      maxBytes: number;
    },
  ) {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    if (!file.buffer || file.size <= 0) {
      throw new BadRequestException('Archivo vacio o invalido');
    }

    if (!options.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de archivo no permitido');
    }

    if (file.size > options.maxBytes) {
      throw new BadRequestException('El archivo excede el tamano permitido');
    }

    const extension = this.getExtension(file.originalname);

    const extensionByMime: Record<string, string[]> = {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    };

    if (!extensionByMime[file.mimetype]?.includes(extension)) {
      throw new BadRequestException(
        'La extension del archivo no coincide con el MIME permitido',
      );
    }
  }

  private buildMisArchivosWhere(
    user: AuthenticatedUser,
    input: MisArchivosInput,
  ): Prisma.ArchivoWhereInput {
    if (user.rol === RolUsuario.ADMINISTRADOR) {
      return {
        tipoEntidad: TipoEntidadArchivo.USUARIO,
        entidadId: user.id,
        ...(input.categoria ? { categoria: input.categoria } : {}),
      };
    }

    if (user.rol === RolUsuario.EGRESADO) {
      return {
        tipoEntidad: TipoEntidadArchivo.EGRESADO,
        entidadId: user.id,
        ...(input.categoria ? { categoria: input.categoria } : {}),
      };
    }

    return {
      tipoEntidad: TipoEntidadArchivo.EMPRESA,
      entidadId: user.id,
      ...(input.categoria ? { categoria: input.categoria } : {}),
    };
  }

  private async ensureEgresadoExists(egresadoId: string) {
    const egresado = await this.prisma.egresado.findUnique({
      where: { id: egresadoId },
      select: { id: true },
    });

    if (!egresado) {
      throw new NotFoundException('Perfil de egresado no encontrado');
    }
  }

  private async ensureEmpresaExists(empresaId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      select: { id: true },
    });

    if (!empresa) {
      throw new NotFoundException('Perfil de empresa no encontrado');
    }
  }

  private async findArchivoOrFail(id: string) {
    const archivo = await this.prisma.archivo.findUnique({
      where: { id },
      select: archivoSelect,
    });

    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }

    return archivo;
  }

  private toSafeArchivoView(
    archivo: Prisma.ArchivoGetPayload<{ select: typeof archivoSelect }>,
  ) {
    return {
      id: archivo.id,
      nombreArchivo: archivo.nombreArchivo,
      mimeType: archivo.mimeType,
      tamanio: archivo.tamanio,
      categoria: archivo.categoria,
      tipoEntidad: archivo.tipoEntidad,
      entidadId: archivo.entidadId,
      proveedorAlmacenamiento: archivo.proveedorAlmacenamiento,
      creadoEn: archivo.creadoEn,
      downloadUrl:
        archivo.categoria === CategoriaArchivo.REPORTE
          ? null
          : `/api/v1/archivos/${archivo.id}/download`,
    };
  }

  private sanitizeOriginalName(originalName: string) {
    const trimmed = originalName.trim();
    const base = trimmed.length > 0 ? trimmed : 'archivo';

    const sanitized = [...base]
      .map((character) =>
        this.isInvalidFilenameCharacter(character) ? '_' : character,
      )
      .join('');

    return sanitized.slice(0, 180);
  }

  private getExtension(filename: string) {
    return this.sanitizeOriginalName(filename)
      .toLowerCase()
      .slice(this.sanitizeOriginalName(filename).lastIndexOf('.'));
  }

  private getMaxBytes(fallbackMb: number) {
    const configured =
      this.configService.get<number>('MAX_UPLOAD_SIZE_MB') ?? fallbackMb;

    return configured * 1024 * 1024;
  }

  private getStorageKeyOrFail(key: string | null) {
    if (!key) {
      throw new NotFoundException('Archivo sin referencia de almacenamiento');
    }

    return key;
  }

  private ensureFilePresent(file: UploadableFile | undefined) {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }

    return file;
  }

  private isInvalidFilenameCharacter(character: string) {
    const invalidCharacters = new Set([
      '<',
      '>',
      ':',
      '"',
      '/',
      '\\',
      '|',
      '?',
      '*',
    ]);
    const codePoint = character.charCodeAt(0);

    return invalidCharacters.has(character) || codePoint < 32;
  }

  private buildDownloadUrlPlaceholder() {
    return 'LOCAL_PENDING_DOWNLOAD_URL';
  }
}
