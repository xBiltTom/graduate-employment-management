import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CarrerasModule } from './carreras/carreras.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { validateEnv } from './config/env.validation';
import { EstadisticasModule } from './estadisticas/estadisticas.module';
import { EmpresasModule } from './empresas/empresas.module';
import { EgresadosModule } from './egresados/egresados.module';
import { HabilidadesModule } from './habilidades/habilidades.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { OfertasModule } from './ofertas/ofertas.module';
import { PostulacionesModule } from './postulaciones/postulaciones.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportesModule } from './reportes/reportes.module';
import { SectoresModule } from './sectores/sectores.module';
import { TrpcModule } from './trpc/trpc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL') ?? 60,
          limit: configService.get<number>('THROTTLE_LIMIT') ?? 100,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    CarrerasModule,
    SectoresModule,
    HabilidadesModule,
    NotificacionesModule,
    EmpresasModule,
    EstadisticasModule,
    EgresadosModule,
    OfertasModule,
    PostulacionesModule,
    ReportesModule,
    TrpcModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
