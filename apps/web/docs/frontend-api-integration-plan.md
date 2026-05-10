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

## Limitations
- No real logo upload yet.
- No real CV download yet.
- Offer creation does not send unsupported UI fields such as `vacantes` or `direccion`.
- Skills still require `habilidadIds`; text skills are not connected until catalog selection is implemented.

## Validation
- `npm --prefix apps/web run lint`: ok
- `npm --prefix apps/web run build`: ok
