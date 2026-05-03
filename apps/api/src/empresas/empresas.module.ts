import { Module } from '@nestjs/common';
import { EmpresasRouter } from './empresas.router';
import { EmpresasService } from './empresas.service';

@Module({
  providers: [EmpresasService, EmpresasRouter],
  exports: [EmpresasService, EmpresasRouter],
})
export class EmpresasModule {}
