import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { GlobalExceptionFilter } from './../src/common/filters/global-exception.filter';
import { LoggingInterceptor } from './../src/common/interceptors/logging.interceptor';
import { PrismaService } from './../src/prisma/prisma.service';
import { createTrpcContext } from './../src/trpc/trpc.context';
import { TrpcRouter } from './../src/trpc/trpc.router';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();

    const configService = app.get(ConfigService);
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
        createContext: createTrpcContext,
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

  afterEach(async () => {
    await app.close();
  });
});
