# Production Checklist

## Seguridad

- [ ] JWT secrets fuertes
- [ ] CORS restringido
- [ ] HTTPS
- [ ] Cookies secure
- [ ] Rate limiting validado
- [ ] Logs sin datos sensibles

## Base de datos

- [ ] Migraciones aplicadas
- [ ] Backups
- [ ] Indices revisados
- [ ] Pooling

## Storage

- [ ] Migrar local storage a S3/R2/Supabase Storage
- [ ] URLs firmadas
- [ ] Antivirus/escaneo de archivos si aplica

## Jobs

- [ ] Migrar reportes a BullMQ/Redis
- [ ] Worker separado

## Observabilidad

- [ ] Logs estructurados
- [ ] Error tracking
- [ ] Metricas

## Testing

- [ ] Unit tests
- [ ] E2E tests
- [ ] Smoke tests

## Documentacion

- [ ] Variables env
- [ ] API docs
- [ ] README actualizado
