# Local API Testing

## 1. Backend

```bash
cd apps/api
npm run start:dev
```

Backend expected:
`http://localhost:3001`

## 2. Frontend env

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_MODE=api
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_TRPC_URL=http://localhost:3001/trpc
```

Restart Next after changing env variables.

## 3. Frontend

```bash
cd apps/web
npm run dev
```

Frontend expected:
`http://localhost:3000`

## 4. Common issues

- If pages still show mock data, restart Next.
- If auth fails, check cookies and CORS.
- If role redirects fail, check `/api/v1/auth/me` response.
- If public offers are empty, check `estado = ACTIVA` in backend data.
- If company cannot create offer, check `estadoValidacion = APROBADA`.
- If report download fails, check `estado = COMPLETADO` and that the file exists in storage.
- If protected pages redirect unexpectedly, verify the browser is sending the HTTP-only auth cookie.
- If tRPC actions fail with validation errors, compare the frontend payload against backend Zod schemas.
