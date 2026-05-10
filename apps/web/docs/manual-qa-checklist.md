# Manual QA Checklist

## Environment
- Backend URL:
- Frontend URL:
- API mode:
- Database:
- Seed/users used:

## Test users
- Admin:
- Graduate:
- Company pending:
- Company approved:

## Public
- [ ] Landing loads in mock
- [ ] Landing loads in api
- [ ] Public offers list loads in api without session
- [ ] Public offer detail loads active offer without session
- [ ] Non-active offer is not public

## Auth
- [ ] Login graduate
- [ ] Login company
- [ ] Login admin
- [ ] Logout
- [ ] Register graduate
- [ ] Register company

## Role protection
- [ ] Unauthenticated user redirected from /egresado
- [ ] Unauthenticated user redirected from /empresa
- [ ] Unauthenticated user redirected from /admin
- [ ] Graduate cannot access company/admin
- [ ] Company cannot access graduate/admin
- [ ] Admin cannot access graduate/company
- [ ] Authenticated user redirected away from /login

## Graduate
- [ ] Home loads
- [ ] Offers load
- [ ] Offer detail loads
- [ ] Apply to offer
- [ ] Applications update after applying
- [ ] Profile loads
- [ ] Profile update works if supported
- [ ] Notifications load
- [ ] Mark notification as read

## Company
- [ ] Home loads
- [ ] Profile loads
- [ ] Validation status loads
- [ ] My offers load
- [ ] Create offer
- [ ] Offer detail loads
- [ ] Close offer
- [ ] Applicants by offer load
- [ ] Change applicant status
- [ ] Applicant detail loads

## Admin
- [ ] Dashboard loads
- [ ] Graduates list loads
- [ ] Graduate detail loads
- [ ] Companies list loads
- [ ] Company detail loads
- [ ] Validate company
- [ ] Offers list loads
- [ ] Moderate offer
- [ ] Skills list loads
- [ ] Create skill
- [ ] Update skill
- [ ] Delete skill only with confirmation
- [ ] Reports list loads
- [ ] Request report
- [ ] Retry failed report
- [ ] Download completed report

## Errors
- [ ] Backend down shows controlled error
- [ ] Expired session redirects or shows controlled state
- [ ] Invalid id does not crash app
- [ ] Unauthorized role does not show stack trace

## Build
- [ ] npm run lint
- [ ] npm run build
