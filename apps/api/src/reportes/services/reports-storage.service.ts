import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TipoReporte } from '@graduate-employment-management/database';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class ReportsStorageService {
  constructor(private readonly configService: ConfigService) {}

  async ensureStorageDir() {
    await fs.mkdir(this.getStorageDir(), { recursive: true });
  }

  buildReportFilename(reporteId: string, tipo: TipoReporte) {
    const safeTipo = tipo.toLowerCase().replace(/_/g, '-');
    return `${safeTipo}-${reporteId}.pdf`;
  }

  getReportPath(filename: string) {
    const safeFilename = path.basename(filename);

    if (safeFilename !== filename) {
      throw new BadRequestException('Nombre de archivo invalido');
    }

    const targetPath = path.resolve(this.getStorageDir(), safeFilename);
    const storageDir = this.getStorageDir();

    if (!targetPath.startsWith(storageDir)) {
      throw new BadRequestException('Ruta de reporte invalida');
    }

    return targetPath;
  }

  async writePdf(filename: string, buffer: Buffer) {
    await this.ensureStorageDir();
    const filePath = this.getReportPath(filename);
    await fs.writeFile(filePath, buffer);

    return {
      path: filePath,
      size: buffer.byteLength,
    };
  }

  async resolveExistingReportPath(filename: string) {
    const filePath = this.getReportPath(filename);

    try {
      await fs.access(filePath);
    } catch {
      throw new NotFoundException('Archivo de reporte no encontrado');
    }

    return filePath;
  }

  async deleteIfExists(filename: string) {
    const filePath = this.getReportPath(filename);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  private getStorageDir() {
    const configured =
      this.configService.get<string>('REPORTS_STORAGE_DIR') ??
      'storage/reports';

    return path.resolve(process.cwd(), configured);
  }
}
