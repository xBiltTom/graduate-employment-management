import { Global, Module } from '@nestjs/common';
import { CarrerasModule } from '../carreras/carreras.module';
import { EmpresasModule } from '../empresas/empresas.module';
import { EgresadosModule } from '../egresados/egresados.module';
import { HabilidadesModule } from '../habilidades/habilidades.module';
import { SectoresModule } from '../sectores/sectores.module';
import { TrpcRouter } from './trpc.router';
import { TrpcService } from './trpc.service';

@Global()
@Module({
  imports: [
    CarrerasModule,
    SectoresModule,
    HabilidadesModule,
    EmpresasModule,
    EgresadosModule,
  ],
  providers: [TrpcService, TrpcRouter],
  exports: [TrpcService, TrpcRouter],
})
export class TrpcModule {}
