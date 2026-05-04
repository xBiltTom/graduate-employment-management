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
