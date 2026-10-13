# Build Plan

The ordered feature list. Run `/feature` to spec the next unchecked item, or
`/feature 12` to pick one. Keep completed items checked and append new features
as the project grows. Do not renumber completed features; their archived specs
refer to those IDs.

Items 1-10 shipped before the Blueprint was adopted (2026-10-13) and have no
archived specs.

## Your features

- [x] 1. **Login with 2FA** - email/password login, then SMS OTP or authenticator verification
- [x] 2. **Password recovery and email verification** - forgot password, reset password, verify email link
- [x] 3. **Auth guard and default password change** - `withAuth` protects routes and forces a password change on first login
- [x] 4. **Admin shell** - protected layout with grouped side menu, header greeting, avatar menu, responsive sidebar
- [x] 5. **Financial dashboard** - overall totals, collection and disbursement stats and graphs, network breakdown
- [x] 6. **Transactions report** - paginated table, filters, detail view, CSV export
- [x] 7. **Direct debit mandates report** - paginated table, filters, detail view
- [x] 8. **Merchant management** - list, filter, create, configure, activate/deactivate merchants
- [x] 9. **Platform user management** - list, filter, create, activate/deactivate users, grant permissions
- [x] 10. **Account self-service** - update profile, email, phone, password; enable authenticator 2FA
- [ ] 11. **Inactivity auto-logout** - log the user out after a period of no activity (wire up the existing `useInactivityTimeout`)

Items 12-18 come from the full audit on 2026-10-13. Finding IDs refer to
`blueprint/context/findings.md`. Item 15 was dropped after F-04 proved invalid; its ID is not reused.

- [x] 12. **Fix 2FA login for v1** - handle the v1 `{ multiFAEnabled, loginToken }` response and go straight to authenticator verification; remove the SMS 2FA screens v1 can't serve (F-01, F-05). Fixed 2026-10-13 outside the feature loop; no archived spec
- [ ] 13. **Single query cache** - one QueryClient so logout actually signs out and profile/email/phone updates refresh the current user (F-02, F-07)
- [ ] 14. **Safe permission updates** - start the permissions editor from the user's current permissions so saving can't revoke them all (F-03)
- [ ] 16. **Email verification resend** - replace the broken resend form with a flow v1 supports (F-06)
- [ ] 17. **Font setup cleanup** - the app renders in the system font; either apply Montserrat through the antd theme or remove the unused cursive font and commented CSS (F-08)
- [ ] 18. **Cleanup and small UI fixes** - remove dead code and unused deps, fix forgot-password error toast, AirtelTigo status, password mismatch message, and sign-in redirect on change-default-password (F-09 to F-13)
