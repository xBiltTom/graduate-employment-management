import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AuthService } from './../src/auth/auth.service';
import { GlobalExceptionFilter } from './../src/common/filters/global-exception.filter';
import { LoggingInterceptor } from './../src/common/interceptors/logging.interceptor';
import { PrismaService } from './../src/prisma/prisma.service';
import { createTrpcContext } from './../src/trpc/trpc.context';
import { TrpcRouter } from './../src/trpc/trpc.router';

const prismaMock = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  onModuleInit: jest.fn(),
  onModuleDestroy: jest.fn(),
  usuario: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  egresado: {
    findUnique: jest.fn(),
  },
  empresa: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();

    const configService = app.get(ConfigService);
    const authService = app.get(AuthService);
    const trpcRouter = app.get(TrpcRouter);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.use(cookieParser());
    app.use(helmet());
    app.enableCors({
      origin: (
        configService.get<string>('CORS_ORIGIN') ?? 'http://localhost:3000'
      )
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0 && origin !== '*'),
      credentials: true,
    });
    app.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: trpcRouter.appRouter,
        createContext: ({ req, res }) =>
          createTrpcContext({
            req,
            res,
            authService,
          }),
      }),
    );
    app.setGlobalPrefix('api/v1');

    await app.init();
  });

  it('/api/v1/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((response: request.Response) => {
        expect(response.body).toMatchObject({
          status: 'ok',
          transport: 'rest',
        });
        expect(typeof (response.body as { timestamp: unknown }).timestamp).toBe(
          'string',
        );
      });
  });

  it('/api/v1/auth/register (POST) existe', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .expect(400);
  });

  it('/api/v1/auth/login (POST) existe', () => {
    return request(app.getHttpServer()).post('/api/v1/auth/login').expect(400);
  });

  it('/api/v1/auth/me (GET) sin auth retorna 401', () => {
    return request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
  });

  it('/trpc/health.check (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/trpc/health.check')
      .expect(200);

    const body = response.body as {
      result: {
        data: {
          status: string;
          transport: string;
          timestamp: string;
        };
      };
    };

    expect(body.result.data).toMatchObject({
      status: 'ok',
      transport: 'trpc',
    });
    expect(typeof body.result.data.timestamp).toBe('string');
  });

  it('/trpc/auth.me (GET) reconoce usuario autenticado', async () => {
    const jwtService = app.get(JwtService);

    prismaMock.usuario.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'graduate@example.com',
      rol: 'EGRESADO',
      estado: 'ACTIVO',
      proveedorAuth: 'CREDENCIALES',
      passwordHash: 'hashed-password',
    });

    const accessToken = await jwtService.signAsync({
      sub: 'user-1',
      email: 'graduate@example.com',
      rol: 'EGRESADO',
    });

    const response = await request(app.getHttpServer())
      .get('/trpc/auth.me')
      .set('Cookie', [`access_token=${accessToken}`])
      .expect(200);

    const body = response.body as {
      result: {
        data: {
          id: string;
          email: string;
          rol: string;
        };
      };
    };

    expect(body.result.data).toEqual({
      id: 'user-1',
      email: 'graduate@example.com',
      rol: 'EGRESADO',
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
