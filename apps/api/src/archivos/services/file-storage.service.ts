import { CategoriaArchivo } from '@graduate-employment-management/database';

export interface StoredFileResult {
  key: string;
  path?: string;
  size: number;
}

export abstract class FileStorageService {
  abstract save(input: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    category: CategoriaArchivo;
    ownerId: string;
  }): Promise<StoredFileResult>;

  abstract resolvePath(key: string): Promise<string>;

  abstract delete(key: string): Promise<void>;

  abstract exists(key: string): Promise<boolean>;
}
