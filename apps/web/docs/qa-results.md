# QA Results

## Date
- 2026-05-10

## Environment
- API mode: static review + local build validation; live API manual execution pending
- Backend: expected at `http://localhost:3001`, not reachable during this run
- Frontend: `apps/web`
- Database: not inspected directly in this run

## Summary
- Passed: build/lint, mock compatibility review, contract review for auth/graduate/company/admin/reportes
- Failed: backend live connectivity not available during this run
- Pending: end-to-end manual QA in browser against seeded users and real DB

## Findings

### Finding 1
- Area: Graduate notifications
- Route: `/egresado/notificaciones`
- Severity: medium
- Description: `Marcar todas como leídas` only changed local UI state and did not call the real backend procedure.
- Cause: frontend action remained in mock-style local state despite backend exposing `notificaciones.marcarTodasLeidas`.
- Fix: connected the action through `graduateApiService.markAllNotificationsAsRead()` and added a compatible mock implementation.
- Status: fixed

### Finding 2
- Area: Graduate notifications
- Route: `/egresado/notificaciones`
- Severity: medium
- Description: `Eliminar` simulated persistence by removing the item only in local state even though no backend contract exists for deletion.
- Cause: visual-only action behaved like a real integration.
- Fix: replaced local deletion with a controlled informational toast so the UI no longer implies backend persistence.
- Status: fixed

### Finding 3
- Area: Graduate mock mode
- Route: `/egresado/ofertas/[id]`, `/egresado/postulaciones`, `/egresado/notificaciones`
- Severity: medium
- Description: mock apply/read actions did not persist changes across later reads.
- Cause: mock service returned derived objects without mutating the shared mock collections.
- Fix: updated `graduateMockService` to persist applications and notification read state, plus added `markAllNotificationsAsRead()`.
- Status: fixed

### Finding 4
- Area: Company validation mapping
- Route: `/empresa/inicio`, `/empresa/perfil`, admin company views
- Severity: medium
- Description: unknown or missing validation state was mapped as `APROBADA`, which could falsely indicate that a company is approved.
- Cause: optimistic fallback in `mapCompanyValidationStatus()`.
- Fix: changed the fallback to `PENDIENTE`.
- Status: fixed

## Manual test matrix

| Area | Test | Result | Notes |
|---|---|---|---|
| Public | Landing mock mode | PENDING | Manual browser check required |
| Public | Landing API mode | PENDING | Backend unavailable in this run |
| Auth | Login graduate | PENDING | Requires real seeded user |
| Auth | Logout | PENDING | Requires live session |
| Role protection | Redirect unauthenticated user | PENDING | Requires browser verification |
| Graduate | Notifications load | PENDING | Contract reviewed; live verification pending |
| Graduate | Mark all notifications as read | PASS | Frontend now calls real backend procedure |
| Graduate | Apply to offer updates mock data | PASS | Mock service now persists created applications |
| Company | Validation status mapping | PASS | Fallback corrected to `PENDIENTE` |
| Admin | Reports integration | PASS | Previously aligned in Fase 13.1 |
| Build | `npm run lint` | PASS | Executed in `apps/web` |
| Build | `npm run build` | PASS | Executed in `apps/web` |

## Pending follow-up
- Execute the full checklist in `manual-qa-checklist.md` with backend running.
- Verify seeded credentials for `ADMINISTRADOR`, `EGRESADO`, `EMPRESA` pendiente y aprobada.
- Confirm browser cookie/CORS behavior for login, protected routes and report download.
