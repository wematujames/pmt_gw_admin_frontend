# Project Plan

## 1. Problem - What problem are we solving?

Nerasika is NeraSol Ghana's payment gateway. Its operations staff need one place
to watch money moving through the platform (collections and disbursements),
investigate individual transactions and direct debit mandates, onboard and
manage merchants, and control which staff can do what.

This repository is the **v1 admin frontend**. It is locked to the frozen v1
backend (`../nera_pmt_gw`, branch `v1.0.0`, mounted at `/api/v1`, admin routes
under `/platform/...`). v1 work never changes API routes or response shapes;
route differences seen in the v2 admin frontend must not be ported here.

## 2. Users - Who is this for?

Internal NeraSol operations and admin staff only. Merchants do not use this app.
Access is per user and governed by platform permissions granted from the Users
module.

## 3. Features - What does the MVP need?

Already shipped:

- Email/password login with second factor (SMS OTP or authenticator app)
- Forgot password, reset password, email verification
- Forced change of the default password on first login
- Financial dashboard: overall totals, collection and disbursement stats, network breakdown
- Transactions report: paginated table, filters, detail view, CSV export
- Direct debit mandates report: paginated table, filters, detail view
- Merchants: list, filter, create, configure, activate/deactivate
- Platform users: list, filter, create, activate/deactivate, grant permissions
- Account self-service: profile, email, phone, password, enable 2FA

Next:

- Automatic logout after a period of inactivity

## 4. Data - What are we storing?

Nothing locally beyond the session. The frontend reads and writes through the v1
REST API; the backend owns all data (transactions, mandates, merchants, merchant
configs, platform users, permissions, summaries). The auth token is kept in
`localStorage` under the key named by `NEXT_PUBLIC_API_AUTH_TOKEN`.

## 5. Tech - What stack are we using?

- Next.js 14 (App Router) with `output: "export"` (static site, all pages client components)
- React 18, TypeScript (strict)
- Ant Design 6 (UI kit, custom theme in `src/themes/default.ts`) plus `@ant-design/plots` for charts
- Tailwind CSS 4 for layout utilities alongside antd
- TanStack Query 5 for server state; axios client in `src/actions/utils/nerasikaAxios.ts`
- dayjs for dates; json-2-csv / js-file-download for exports
- npm (`package-lock.json`); `yarn.lock` was removed 2026-10-13

## 6. Monetize - How will this make money?

Not applicable. Internal operations tool for the gateway business.

## 7. UI/UX - How should this look and feel?

A dense, desktop-first admin console in NeraSol navy (`#142868`): dark side menu
grouped by area, white content cards on a light grey background, small antd
tables with a navy header, and a `ModuleHeader` at the top of each module. Must
remain usable on mobile (sidebar collapses to a full-screen menu).

## 8. Deployment - Where and how will this ship?

Static export. `npm run build:dev` or `npm run build:local` runs `next build` and moves `out/` to `html/`, which a web server serves as
static files.

- Env vars: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_AUTH_TOKEN`
- Next.js reads them from the root `.env.local` (git-ignored). The scripts set `ENVIRONMENT=env/...`, but nothing reads that variable

> TODO (confirm): how do dev vs production builds get different API URLs today? Swapping `.env.local` by hand?

> TODO (confirm): `ecosytem.config.js` (PM2 + `next start`) and the `start` / `build:prod` scripts look legacy given static export. Keep or remove?

## 9. Usage model and constraints (optional)

- Internal, staff-only tool for a payment gateway; handles financial data and staff permissions
- v1 backend API is frozen: no route or contract changes
