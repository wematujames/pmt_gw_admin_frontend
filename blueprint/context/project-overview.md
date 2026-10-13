# Nerasika Admin (v1) - Project Overview

<!-- blueprint:source-hash 56a91667caa180206a650303caeff55c31f3b0a8f3938dc20b0afe6e21433179 -->

> Internal admin console for NeraSol Ghana's Nerasika payment gateway, locked to the frozen v1 backend API.

## Problem

Gateway operations staff need one place to watch collections and disbursements,
investigate transactions and direct debit mandates, onboard and configure
merchants, and control staff access. This repo is the v1 frontend for that, and
it must keep working against a v1 backend that no longer changes.

## Users

- **NeraSol operations and admin staff** - the only users. Each is a platform user
  whose abilities come from permissions granted in the Users module.
- Merchants do not use this app.

## Usage model

- Internal, staff-only tool handling payment data and staff permissions.
- **2FA in v1 is authenticator (TOTP) only.** `POST /platform/auth/login` returns `{ multiFAEnabled: false, token }` or `{ multiFAEnabled: true, loginToken }`; `POST /platform/auth/login2fa { loginToken, verificationCode }` returns `{ token }`. There is no SMS OTP route.
- **Permission grants replace the full list.** `PUT /platform/permissions/grant` overwrites the user's permissions with the array sent.
- **v1 API is frozen.** No route, payload, or response-shape changes. Admin routes
  are `/platform/...` on the v1 backend (`../nera_pmt_gw`, branch `v1.0.0`,
  `/api/v1`). Route changes from the v2 admin frontend are never ported here.

## Features

Items 1-10 shipped before the Blueprint was adopted. 11 is next; 12-18 fix defects from the 2026-10-13 full audit (finding IDs in `blueprint/context/findings.md`). 12 is done; 15 was dropped.

1. **Login with 2FA** - email/password, then an authenticator-app code when 2FA is enabled.
2. **Password recovery and email verification** - forgot/reset password, verify email link.
3. **Auth guard and default password change** - `withAuth` gates protected routes and forces a first-login password change.
4. **Admin shell** - grouped dark side menu, header greeting, avatar menu, responsive sidebar.
5. **Financial dashboard** - overall totals, collection/disbursement stats and graphs, network breakdown.
6. **Transactions report** - paginated, filterable table, detail view, CSV export.
7. **Direct debit mandates report** - paginated, filterable table, detail view.
8. **Merchant management** - list, filter, create, configure, activate/deactivate.
9. **Platform user management** - list, filter, create, activate/deactivate, grant permissions.
10. **Account self-service** - profile, email, phone, password, enable authenticator 2FA.
11. **Inactivity auto-logout** (next) - log out after a period of no activity using the existing `useInactivityTimeout` hook.
12. **Fix 2FA login for v1** (done) - honor `{ multiFAEnabled, loginToken }`, verify via authenticator code, remove SMS 2FA screens (F-01, F-05).
13. **Single query cache** - one QueryClient so logout signs out and account updates refresh `current-user` (F-02, F-07).
14. **Safe permission updates** - permissions editor starts from the user's current permissions; saving can't wipe them (F-03).
16. **Email verification resend** - replace the broken resend form with a flow v1 supports (F-06).
17. **Font setup cleanup** - apply Montserrat via the antd theme or remove the unused font setup; the app currently renders in the system font (F-08).
18. **Cleanup and small UI fixes** - dead code, unused deps, minor UI bugs (F-09 to F-13).
19. **Use antd App for messages and notifications** - replace the custom message/notification contexts with antd `App.useApp()` so toasts follow the theme.

## Data model

The backend owns all data; the frontend stores only the auth token in
`localStorage` (key from `NEXT_PUBLIC_API_AUTH_TOKEN`). Shapes below are the
fields the UI reads today. They are fixed by the frozen v1 API.

**Response envelope:** lists return `{ data: T[], meta: { total } }` and accept
`_page`, `_limit`, plus filters (empty values stripped). Single items return
`{ data: T }`. Errors carry `response.data.message`.

### Transaction (`/platform/transactions`)

- `_id`, `type`, `status`, `statusReason`, `amount`, `phone`, `network`, `processor`,
  `processorTerminalRef`, `desc`, `createdAt`
- `merchant` -> Merchant (`merchantId`)
- Filters: `_id`, `merchant`, `phone`, `processorTerminalRef`, `status`, `type`, date range
- Export: `GET /platform/transactions/export` returns CSV

### DirectDebitMandate (`/platform/directdebit/mandates`)

- `_id`, `active`, `statusReason`, `amount`, `frequency`, `phone`, `network`,
  `processor`, `processorTerminalRef`, `merchantRef`, `desc`, `expiryDate`,
  `nextPaymentDate`, `createdAt`
- `merchant` -> Merchant (`merchantId`)

### Merchant (`/platform/merchants`)

- `_id`, `merchantId`, `name`, `phone`, `email`, `phoneVerified`, `emailVerified`,
  `active`, `statusReason`, `createdAt`, `createdBy` -> PlatformUser (`email`)
- `config` -> MerchantConfig (one per merchant)
- Status change: `PUT /platform/merchants/:id { active }`

### MerchantConfig (`/platform/merchantconfigs/:id`)

- `channels.{mtn,telecel,airtelTigo}.{allowed, processor}`
- `disbursement.{allowed, limit}`, `directDebit.{allowed, limit}`
- `reversal.allowed`, `statusCheck.allowed`, `cancelDirectDebit.allowed`, `updateDDAmount.allowed`

### PlatformUser (`/platform/users`, current user at `/platform/auth/user`)

- `_id`, `email`, `phone`, `emailVerified`, `phoneVerified`, `role`, `active`,
  `isPasswordReset` (false forces `/change-default-password`), `createdAt`
- `person.{title, fName, lName}`, `createdBy` -> PlatformUser
- Permissions: list `GET /platform/permissions`, grant `PUT /platform/permissions/grant { user, permissions[] }`

### Summary (`/platform/summary/...`)

- `transactionsoverall`, `collectiontransactionstats`, `disbursementtransactionstats`
  (counts and amounts for today and in total, plus per-network stats)

## Tech stack

- **Next.js 14 App Router, `output: "export"`** - static site; every page is a client component, no server code.
- **React 18 + TypeScript (strict)** - `@/*` maps to `src/*`.
- **Ant Design 6** - UI kit, themed in `src/themes/default.ts`; `@ant-design/plots` for charts.
- **Tailwind CSS 4** - layout utilities alongside antd.
- **TanStack Query 5** - server state; one root `QueryClient` (`src/app/providers.tsx`) with global mutation success/error messages.
- **axios** - shared client `src/actions/utils/nerasikaAxios.ts` (base URL, `x-app: admin`, bearer token).
- **dayjs** - dates; **json-2-csv / js-file-download** - exports.
- **npm** - package manager; `npm run verify` (typecheck + build) in GitHub Actions.

## Monetization

Not applicable. Internal operations tool.

## UI/UX

Dense, desktop-first console in NeraSol navy `#142868`. Dark grouped side menu,
white rounded cards on a grey background, small antd tables with a navy header,
`ModuleHeader` atop each module. On mobile the sidebar becomes a full-screen menu.

- `/` - redirects to `/dashboard/financial`
- `/auth/login` (+ 2FA step), `/auth/forgot-password`, `/auth/reset-password`, `/auth/verification/email`
- `/change-default-password` - authenticated, outside the shell
- `/dashboard/financial`
- `/transactions` (`/transactions/overview` is a stub page, not in the menu or plan)
- `/direct-debit/mandates`
- `/merchants`
- `/users`
- `/user/manage` - own account settings

## Deployment

- Static export: `npm run build:dev` / `npm run build:local` run `next build` and move `out/` to `html/`, served by a web server.
- Env vars: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_AUTH_TOKEN`, read by Next.js from the root `.env.local`. The `ENVIRONMENT=...` prefix in the scripts is unused.
- No server, database, workers, or health check on the frontend side.

## Open questions

> Resolve these in `project-plan.md`, then re-run `/overview`.

- How do dev and production builds get different API URLs, given `ENVIRONMENT` is unused?
- Are `ecosytem.config.js` (PM2 + `next start`), `start`, and `build:prod` legacy now that deployment is static export?
- `/transactions/overview` exists as a stub but is in neither plan. Drop it, or add it to the build plan?
- `project-plan.md` section 3 still says 2FA uses "SMS OTP or authenticator app" and build-plan item 1 says the same. v1 is authenticator-only and item 12 removes the SMS screens. Update both lines.
- `project-plan.md` section 3 "Next" lists only auto-logout; items 12-18 are in the build plan only.
