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
  FILES_STORAGE_DIR: z.string().trim().min(1).default('storage/files'),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(10),
  REPORTS_STORAGE_DIR: z.string().trim().min(1).default('storage/reports'),
  REPORTS_BASE_URL: z
    .string()
    .url()
    .default('http://localhost:3001/api/v1/reportes'),
  SMTP_HOST: z.string().trim().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().trim().min(1).optional(),
  SMTP_PASSWORD: z.string().trim().min(1).optional(),
  SMTP_FROM: z.string().trim().min(1).optional(),
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

  validateCorsOrigin(data.CORS_ORIGIN);
  validateUploadSize(data.MAX_UPLOAD_SIZE_MB);

  if (data.NODE_ENV === 'production') {
    validateProductionSecret('JWT_ACCESS_SECRET', data.JWT_ACCESS_SECRET);
    validateProductionSecret('JWT_REFRESH_SECRET', data.JWT_REFRESH_SECRET);
  }

  return data;
}

function validateProductionSecret(name: string, value: string) {
  const trimmed = value.trim();

  if (trimmed.length < 32) {
    throw new Error(
      `Error en variables de entorno: ${name} debe tener al menos 32 caracteres en produccion`,
    );
  }

  if (trimmed.includes('change-me') || trimmed.startsWith('dev-')) {
    throw new Error(
      `Error en variables de entorno: ${name} no puede usar un secreto por defecto en produccion`,
    );
  }
}

function validateCorsOrigin(value: string) {
  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (origins.some((origin) => origin === '*')) {
    throw new Error(
      'Error en variables de entorno: CORS_ORIGIN no puede incluir "*" cuando la API usa credentials',
    );
  }

  for (const origin of origins) {
    try {
      new URL(origin);
    } catch {
      throw new Error(
        `Error en variables de entorno: CORS_ORIGIN contiene un origen invalido (${origin})`,
      );
    }
  }
}

function validateUploadSize(value: number) {
  if (value < 1 || value > 50) {
    throw new Error(
      'Error en variables de entorno: MAX_UPLOAD_SIZE_MB debe estar entre 1 y 50',
    );
  }
}
