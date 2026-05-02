import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerida'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  THROTTLE_TTL: z.coerce.number().int().positive().default(60),
  THROTTLE_LIMIT: z.coerce.number().int().positive().default(100),
  JWT_ACCESS_SECRET: z.string().default('dev-access-secret-change-me'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('dev-refresh-secret-change-me'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().default(''),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): AppEnv {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');

    throw new Error(`Error en variables de entorno: ${errors}`);
  }

  const data = parsed.data;

  if (data.NODE_ENV === 'production') {
    if (data.JWT_ACCESS_SECRET.length < 32) {
      throw new Error(
        'Error en variables de entorno: JWT_ACCESS_SECRET debe tener al menos 32 caracteres en producción',
      );
    }

    if (data.JWT_REFRESH_SECRET.length < 32) {
      throw new Error(
        'Error en variables de entorno: JWT_REFRESH_SECRET debe tener al menos 32 caracteres en producción',
      );
    }
  }

  return data;
}
