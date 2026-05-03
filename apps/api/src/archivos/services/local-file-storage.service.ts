import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CategoriaArchivo } from '@graduate-employment-management/database';
import { createHash, randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { FileStorageService, StoredFileResult } from './file-storage.service';

const extensionByMime: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

@Injectable()
export class LocalFileStorageService extends FileStorageService {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async save(input: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    category: CategoriaArchivo;
    ownerId: string;
  }): Promise<StoredFileResult> {
    await this.ensureStorageDir();

    const key = this.buildKey(input.category, input.ownerId, input.mimeType);
    const targetPath = this.getSafePath(key);

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, input.buffer);

    return {
      key,
      path: targetPath,
      size: input.buffer.byteLength,
    };
  }

  async resolvePath(key: string): Promise<string> {
    const targetPath = this.getSafePath(key);

    try {
      await fs.access(targetPath);
    } catch {
      throw new NotFoundException('Archivo no encontrado');
    }

    return targetPath;
  }

  async delete(key: string): Promise<void> {
    const targetPath = this.getSafePath(key);

    try {
      await fs.unlink(targetPath);
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    const targetPath = this.getSafePath(key);

    try {
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }

  buildSafeKeyForTest(
    category: CategoriaArchivo,
    ownerId: string,
    mimeType: string,
  ) {
    return this.buildKey(category, ownerId, mimeType);
  }

  getSafePathForTest(key: string) {
    return this.getSafePath(key);
  }

  private async ensureStorageDir() {
    await fs.mkdir(this.getStorageDir(), { recursive: true });
  }

  private buildKey(
    category: CategoriaArchivo,
    ownerId: string,
    mimeType: string,
  ) {
    const extension = extensionByMime[mimeType];

    if (!extension) {
      throw new BadRequestException('Tipo de archivo no soportado');
    }

    const safeCategory = category.toLowerCase();
    const ownerHash = createHash('sha1')
      .update(ownerId)
      .digest('hex')
      .slice(0, 12);

    return `${safeCategory}/${ownerHash}-${randomUUID()}${extension}`;
  }

  private getSafePath(key: string) {
    this.validateKey(key);

    const storageDir = this.getStorageDir();
    const targetPath = path.resolve(storageDir, key);

    if (!targetPath.startsWith(storageDir)) {
      throw new BadRequestException('Ruta de archivo invalida');
    }

    return targetPath;
  }

  private validateKey(key: string) {
    if (!key || key.includes('..') || path.isAbsolute(key)) {
      throw new BadRequestException('Key de archivo invalida');
    }

    const normalized = key.replace(/\\/g, '/');

    if (!/^[a-z0-9/_-]+\.[a-z0-9]+$/i.test(normalized)) {
      throw new BadRequestException('Key de archivo invalida');
    }
  }

  private getStorageDir() {
    const configured =
      this.configService.get<string>('FILES_STORAGE_DIR') ?? 'storage/files';

    return path.resolve(process.cwd(), configured);
  }
}
