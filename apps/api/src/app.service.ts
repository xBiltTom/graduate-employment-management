import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello() {
    const totalUsuarios = await this.prisma.usuario.count();

    return {
      message: 'API funcionando',
      totalUsuarios,
    };
  }
}