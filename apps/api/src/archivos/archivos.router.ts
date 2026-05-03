import { Injectable } from '@nestjs/common';
import { requireUser } from '../trpc/trpc-auth.util';
import { TrpcService } from '../trpc/trpc.service';
import { ArchivosService } from './archivos.service';
import {
  getArchivoByIdSchema,
  misArchivosSchema,
} from './schemas/archivos.schemas';

@Injectable()
export class ArchivosRouter {
  readonly router: ReturnType<TrpcService['router']>;

  constructor(
    private readonly trpc: TrpcService,
    private readonly archivosService: ArchivosService,
  ) {
    this.router = this.trpc.router({
      getById: this.trpc.protectedProcedure
        .input(getArchivoByIdSchema)
        .query(({ ctx, input }) => {
          const user = requireUser(ctx);
          return this.archivosService.getById(user, input);
        }),
      misArchivos: this.trpc.protectedProcedure
        .input(misArchivosSchema.optional().default({}))
        .query(({ ctx, input }) => {
          const user = requireUser(ctx);
          return this.archivosService.misArchivos(user, input);
        }),
    });
  }
}
