# Frontend API integration plan

## Current mode
- Default mode: mock

## Data source switching
- `NEXT_PUBLIC_API_MODE=mock`
- `NEXT_PUBLIC_API_MODE=api`

## Recommended order
1. Auth
2. Public offers
3. Graduate profile
4. Graduate applications
5. Company offers
6. Company applicants
7. Admin validations
8. Reports
9. Notifications
10. Files

## Service replacement strategy
- Replace mock service method by method.
- Keep UI stable.
- Add loading/error states module by module.
- Do not connect all modules at once.

## Integration decision
- Use tRPC for authenticated business flows.
- Use REST for auth endpoints, report downloads and file uploads/downloads.
- Keep mock mode as safe default without `.env`.

## Pending backend confirmations
- Shared export strategy for `AppRouter`
- Final production URLs
- Exact rollout order after auth

## Auth integration status
- Login: conectado
- Register graduate: conectado
- Register company: conectado
- Logout: conectado
- Current session: conectado

## Notes
- Cookies HTTP-only handled by browser.
- No tokens stored in localStorage/sessionStorage.

## Public offers integration status
- List/feed: conectado
- Detail: conectado
- Public stats: mock fallback
- Mode: works in mock and api

## Public offers integration

Backend now exposes:
- ofertas.publicFeed
- ofertas.publicGetById

These are public tRPC procedures and do not require session.

Frontend publicService uses:
- ofertas.publicFeed for list/landing
- ofertas.publicGetById for detail

## Pending
- Public stats endpoint not available
- AppRouter typing still pending

## Graduate integration status
- Home: conectado
- Offers feed autenticado: conectado
- Offer detail autenticado: conectado
- Apply to offer: conectado
- My applications: conectado
- Profile read: conectado
- Profile update: conectado parcialmente a campos soportados por `updateMiPerfil`
- Notifications list: conectado
- Mark notification as read: conectado
- Mark all as read: pendiente intencionalmente
- Mode: works in mock and api

## Graduate integration notes
- Graduate visual components now receive data by props from route pages.
- Route pages resolve async data through `graduateService`.
- API mode uses tRPC with backend mappers.
- Mock mode keeps the same service interface.
- Unauthenticated graduate routes show controlled empty/error state with login action.

## Company integration status
- Home: conectado
- Company profile read: conectado
- Company profile update: conectado parcialmente a campos soportados por `empresas.updateMiPerfil`
- Validation status: conectado
- My offers: conectado
- Offer detail: conectado
- Create offer: conectado con campos soportados por `ofertas.create`
- Close offer: conectado
- Applicants by offer: conectado
- Applicant detail: conectado
- Change application status: conectado
- Application history: conectado
- Mode: works in mock and api

## Company integration notes
- Company visual components now receive data by props from route pages.
- Route pages resolve async data through `companyService`.
- API mode uses tRPC with company-specific mappers for profile, offers and applicants.
- Mock mode keeps the same service interface, including profile update, offer creation/closure and application status changes.
- Unauthenticated company routes show controlled empty/error state with login action.

## Admin integration status
- Dashboard: conectado
- Graduates list: conectado
- Graduate detail: conectado
- Companies list: conectado
- Company detail: conectado
- Company validation: conectado
- Offers moderation list: conectado
- Offer moderation actions: conectado
- Skills list: conectado
- Skills create/update/delete: conectado
- Reports history: conectado
- Report request/retry/download: conectado parcialmente según disponibilidad del backend
- Settings page access control: conectado
- Mode: works in mock and api

## Admin integration notes
- Admin visual components now receive data by props from route pages.
- Route pages resolve async data through `adminService` and show `AdminStatusNotice` on controlled auth/error states.
- API mode uses tRPC plus REST download for reports, with admin-specific mappers for graduates, companies, offers, skills and reports.
- Mock mode keeps the same async service interface, including validation, moderation, skills CRUD and report actions.
- Dashboard KPIs are derived from existing list/count procedures instead of a dedicated aggregate endpoint.
- Reports UI keeps visual selectors, but only `POSTULACIONES_POR_OFERTA` requests an explicit backend parameter in the current UI.

## Reports integration
- Backend tRPC:
  - `reportes.misReportes`
  - `reportes.solicitar`
  - `reportes.getById`
  - `reportes.reintentar`
- Backend REST:
  - `GET /api/v1/reportes/:id/download`
- Frontend:
  - list/request/retry/getById via tRPC
  - final download via REST `downloadUrl`
- Limitations:
  - Download only when `estado = COMPLETADO` and `downloadUrl` exists.
  - Report file must exist in backend storage.
  - Browser must send HTTP-only auth cookie to backend download endpoint.

## Route protection and session
- Route protection is handled server-side in Next layouts.
- The frontend calls `GET /api/v1/auth/me` forwarding HTTP-only cookies.
- No tokens are stored in `localStorage` or `sessionStorage`.
- In mock mode, guards are bypassed to keep visual development available.
- In api mode, role-based redirects are enforced.
- Protected groups:
  - `/egresado` -> `EGRESADO`
  - `/empresa` -> `EMPRESA`
  - `/admin` -> `ADMINISTRADOR`
- Auth group:
  - `/login` and `/registro` redirect authenticated users to their default role route.

## Limitations
- No real logo upload yet.
- No real CV download yet.
- Offer creation does not send unsupported UI fields such as `vacantes` or `direccion`.
- Skills still require `habilidadIds`; text skills are not connected until catalog selection is implemented.
- Admin correction-request actions remain visual only because there is no confirmed backend contract.
- Graduate admin detail still uses fallback arrays for archivos/historial administrativo because that contract is not exposed in current backend responses.

## Validation
- `npm --prefix apps/web run lint`: ok
- `npm --prefix apps/web run build`: ok
