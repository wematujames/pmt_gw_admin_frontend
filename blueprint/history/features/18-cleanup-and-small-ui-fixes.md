# Feature: Cleanup and small UI fixes

**From build-plan:** feature 18
**Build attempt:** 1
**Status:** verified
**Branch:** feature/cleanup-and-small-ui-fixes (branched from `v1`, the maintained v1 line)

## Goal

Close audit findings F-09 to F-13. Remove dead and shadowed code and the two
export-only dependencies. Fix four small UI bugs: forgot-password errors shown
as success, AirtelTigo always shown as Disabled, a silent password mismatch,
and a change-default-password page that never sends signed-out visitors to login.

## In scope

- **F-09 dead code:** delete `src/hooks/useLogout.jsx`, `src/hooks/useValidatePwd.tsx`,
  `src/hooks/useDebounce.tsx`, `src/utils/exportData.tsx`, `src/app/_error.tsx`
  (empty), and `src/app/500.tsx` (not a route in the App Router). Remove
  `getCollectionStatics` and `getDibursementStatics` from `src/actions/summary.ts`,
  `getTransaction` from `src/actions/transactions.ts`, and `getPlatformUser` from
  `src/actions/users.ts`. Remove the unused `loading`/`setLoading` state from
  `MerchantDetails.tsx`, `DDebitMandateDetails.tsx`, `TransactionDetails.tsx`, and
  `UserDetails.tsx`. Uninstall `json-2-csv` and `js-file-download` with npm so
  `package.json` and `package-lock.json` both update.
- **F-10:** in `src/app/auth/forgot-password/page.tsx`, `onError` calls
  `openMessage("error", ...)`.
- **F-11:** in `src/app/(protected)/merchants/utils.tsx`, read
  `merchant.config?.channels?.airtelTigo?.allowed` (the v1 model key).
- **F-12:** in `src/app/(protected)/user/manage/components/UpdatePassword.tsx`,
  give `confirmNewPassword` `dependencies={["newPassword"]}` and the same
  mismatch validator as `change-default-password/page.tsx:107-118`, with the same
  message: "The new passwords do not match!". Delete the silent
  `if (... !== ...) return;` guard in `onFinish`, since the form no longer
  submits when the passwords differ.
- **F-13:** in `src/app/(must-auth)/change-default-password/layout.tsx`, also
  `router.replace("/auth/login")` when `!loading && !user`. Keep the spinner up
  while `loading || !user` so the form does not flash before the redirect. Fix
  the stale comment that mentions `/auth/login`.
- Fill in the `Resolution:` line for F-09 to F-13 in `blueprint/context/findings.md`
  and mark them `fixed`.

## Out of scope

- F-14 (duplicate Reload buttons) and feature 19 (antd `App` messages).
- The live CSV export (`exportTransactions` in `src/actions/transactions.ts`). It
  does not use the removed dependencies and stays as it is.
- Any API route change (v1 routes are frozen), and any change to `withAuth` or
  other auth guards.
- Restyling, refactoring, or renaming code beyond the lines listed above.

## Build loop

`workflow.stepReview` is `feature`: build all steps, then present one review packet.
`workflow.checkpointCommits` is `disabled`, so make no commits. `/complete` creates
the feature commit.

## Build steps

- [x] 1. **Remove dead code and unused deps (F-09).** Delete the files and
  exports listed in scope, drop the unused modal `loading` state, and remove any
  imports left unused (for example `React` if nothing else in the file uses it).
  Run `npm uninstall json-2-csv js-file-download`. Before deleting each item,
  re-run a repo-wide search to confirm it still has no references.
  **Done when:** searches for each removed name return no hits in `src/`, the two
  packages are gone from `package.json` and `package-lock.json`,
  `npx tsc --noEmit` and `npm run lint` pass, and Logout still resolves to
  `useLogout.ts`, which redirects to `/auth/login`.
- [x] 2. **Forgot-password error toast and AirtelTigo status (F-10, F-11).** Apply
  the two one-line fixes.
  **Done when:** a failed forgot-password request (for example an unknown email)
  shows an error-style toast with the server message, a success still shows the
  success toast, and a merchant whose `config.channels.airtelTigo.allowed` is
  `true` shows "AirtelTigo Txns: Enabled" in Merchant details. Typecheck passes.
- [x] 3. **Password mismatch message (F-12).** Add the `dependencies` rule and the
  validator, and remove the silent guard.
  **Done when:** on User > Manage > Password, different new and confirm values
  show "The new passwords do not match!" under Confirm New Password and send no
  request. Changing New Password re-validates the confirm field. When the values
  match, the existing request, success toast, and logout still run. Typecheck passes.
- [x] 4. **Change-default-password redirect (F-13).** Add the signed-out redirect
  and the spinner condition.
  **Done when:** signed out (no token), `/change-default-password` lands on
  `/auth/login` without rendering the form. A signed-in user who has not reset
  their password still sees the form, and one who has reset it is still sent to
  `/`. Typecheck passes.
- [x] 5. **Bookkeeping and final gate.** Update F-09 to F-13 in `findings.md`.
  **Done when:** each of the five findings is `fixed` and has a dated
  `Resolution:` line, and `npm run verify` and `npm run lint` pass.

## Files / areas

- `src/hooks/useLogout.jsx`, `src/hooks/useValidatePwd.tsx`, `src/hooks/useDebounce.tsx`,
  `src/utils/exportData.tsx`, `src/app/_error.tsx`, `src/app/500.tsx` (delete)
- `src/actions/summary.ts`, `src/actions/transactions.ts`, `src/actions/users.ts`
- `src/app/(protected)/merchants/MerchantDetails.tsx`,
  `src/app/(protected)/direct-debit/mandates/DDebitMandateDetails.tsx`,
  `src/app/(protected)/transactions/TransactionDetails.tsx`,
  `src/app/(protected)/users/UserDetails.tsx`
- `src/app/auth/forgot-password/page.tsx`
- `src/app/(protected)/merchants/utils.tsx`
- `src/app/(protected)/user/manage/components/UpdatePassword.tsx`
- `src/app/(must-auth)/change-default-password/layout.tsx`
- `package.json`, `package-lock.json`
- `blueprint/context/findings.md`

## Data / contracts

- No API, route, or stored-data changes. The only key change is a client-side
  read: `merchant.config.channels.airtelTigo` (v1 model `models/MerchantConfig.js:94`,
  already used by ConfigureMerchant).
- `useUser()` returns `{ user, loading }`. Without a token, `loadUser` fails
  (`retry: false`), so `loading` is false and `user` is undefined. That is the
  signed-out condition for F-13, the same signal `withAuth` uses before its
  `/auth/login` redirect.

## Testing

No unit or browser test runner is configured. Use `npm run verify` (typecheck,
then `next build`) and `npm run lint`. Behavior checks for steps 2-4 are manual,
via `/check` against the dev server: a forgot-password error, the AirtelTigo
display (needs a merchant with AirtelTigo enabled), a password mismatch, and the
signed-out visit to `/change-default-password`. Do not claim any of these were
seen unless they were actually run.

Baseline: on 2026-10-13 `npm run verify` passed on `v1` at `0c79b4a`.

## Notes for the AI

- Deleting `useLogout.jsx` removes the shadowing. Every `@/hooks/useLogout`
  import must still resolve to `useLogout.ts`.
- `src/app/500.tsx` is a plain component in the App Router, not a route.
  `not-found.tsx` stays.
- Keep the edits minimal and match the surrounding style. The F-12 validator
  should copy the change-default-password rule rather than move it into a shared helper.
- Don't change `origin/HEAD` or git config to work around the `main`/`v1` base
  difference.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":7331,"specSha256":"b4ce0a242edc7662506fd2e511ce4d6b59b16f8e20811829d69ab5194371b7dc","branch":"refs/heads/feature/cleanup-and-small-ui-fixes","head":"e16f6e55e23f6f261570b7d1a1b412c34df242d5","baseRef":"refs/heads/v1","baseCommit":"0c79b4aff6f458454d58e7eca6db1848ada97193","sourceTree":"7d670e264e8cbbeca8af5ac77bb056b1dbb42e73","landing":"local-merge","absentOptional":[]} -->

## Findings

### 18/F-08 [P3] closed - Montserrat is never applied; body loads an unused cursive font

**File:** src/fonts/fonts.ts:13
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - corrected. In the browser `<body>` computes to Cedarville Cursive, but antd's Layout and Card set the system font, so every visible text checked (module headers, "Total Records", greeting, footer, auth copy) renders in the system font. Users never see the cursive face. Downgraded from P2.
**Why it matters:** `export const montserrat = Cedarville_Cursive(...)` is applied to `<body>` and the Montserrat rules in `globals.css` are commented out (lines 3-118). The app downloads a font it never shows, and Montserrat, which the code clearly intends, is never used.
**Suggested fix:** Decide whether the app should use Montserrat. If yes, load it with `next/font` and pass it to antd through the `fontFamily` theme token (the body class alone is overridden by antd). If no, delete `fonts.ts` and the commented CSS. Either way drop the unused `inter` and `roboto_mono` exports.
**Resolution:** 2026-10-13 feature 17 - Inter is loaded with `next/font` (`--font-inter`), applied to `<body>` and to antd's `fontFamily` token; the cursive font, unused Inter/Roboto Mono exports, the Montserrat `@import`, and the commented CSS were removed. Awaiting `/audit` re-review. Closed 2026-10-13 by /audit independent current (e16f6e5): `fonts.ts` exports only Inter via `next/font` with `--font-inter`; `layout.tsx` applies it to `<body>` and `themes/default.ts` passes it to antd `fontFamily`; no Cedarville/Montserrat/Roboto Mono references remain; build passes.

### 18/F-09 [P3] closed - Dead and shadowed code

**File:** src/hooks/useLogout.jsx:1
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - no references outside the definitions. In the browser, Logout called `GET /platform/auth/logout` without crashing, confirming the `.ts` hook is the one resolved.
**Why it matters:** These are unused, and some are broken if ever imported. `useLogout.jsx` imports a non-existent `logout` and routes to `/auth/sign-in`; it is only shadowed by `useLogout.ts` through resolution order. Also unused: `getCollectionStatics` and `getDibursementStatics` (their v1 routes are commented out), `getTransaction`, `getPlatformUser`, `useValidatePwd`, `useDebounce`, `utils/exportData.tsx` (the only user of `json-2-csv` and `js-file-download`), the empty `app/_error.tsx`, `app/500.tsx` (not a route in the App Router), and the unused `loading` state in the four detail modals.
**Suggested fix:** Delete them and remove the two export dependencies. Requirement lost: none.
**Resolution:** 2026-10-13 feature 18 - deleted `useLogout.jsx`, `useValidatePwd.tsx`, `useDebounce.tsx`, `utils/exportData.tsx`, `app/_error.tsx`, `app/500.tsx`, the unused `getCollectionStatics`, `getDibursementStatics`, `getTransaction`, and `getPlatformUser` actions, and the unused `loading` state in the four detail modals; uninstalled `json-2-csv` and `js-file-download`. Awaiting `/audit` re-review. Closed 2026-10-13 by /audit independent current (e16f6e5): repo search finds no references to any removed name or package in `src/` or `package.json`; `src/hooks` holds only `useLogout.ts`; lockfile drops only the two packages and their transitive deps (`deeks`, `doc-path`); tsc, lint, and `npm run verify` pass.

### 18/F-10 [P3] closed - Forgot-password errors show as a success toast

**File:** src/app/auth/forgot-password/page.tsx:25
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - reproduced in the browser: a 401 "Not authorized" showed with the success style.
**Why it matters:** `onError` calls `openMessage("success", ...)`, so an unknown email or server error looks like a success.
**Suggested fix:** Use `"error"`.
**Resolution:** 2026-10-13 feature 18 - `onError` now uses `openMessage("error", ...)`. Awaiting `/audit` re-review. Closed 2026-10-13 by /audit independent current (e16f6e5): `forgot-password/page.tsx:25` `onError` uses `openMessage("error", ...)`; success path unchanged.

### 18/F-11 [P3] closed - Merchant details always show AirtelTigo as Disabled

**File:** src/app/(protected)/merchants/utils.tsx:42
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - code only; `utils.tsx:42` vs model key `airtelTigo`.
**Why it matters:** Reads `config.channels.airteltigo`; the v1 model key is `airtelTigo` (`models/MerchantConfig.js:94`), which ConfigureMerchant uses correctly.
**Suggested fix:** Use `airtelTigo`.
**Resolution:** 2026-10-13 feature 18 - reads `config.channels.airtelTigo`. Awaiting `/audit` re-review. Closed 2026-10-13 by /audit independent current (e16f6e5): `merchants/utils.tsx:42` reads `config.channels.airtelTigo`, matching the v1 key used by ConfigureMerchant.

### 18/F-12 [P3] closed - Password change silently does nothing on mismatch

**File:** src/app/(protected)/user/manage/components/UpdatePassword.tsx:37
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - code only; `UpdatePassword.tsx:37` returns with no message and has no `dependencies` rule.
**Why it matters:** When the two new passwords differ, `onFinish` returns with no message. The change-default-password page already does this correctly with a `dependencies` validator.
**Suggested fix:** Reuse that validator rule on `confirmNewPassword`.
**Resolution:** 2026-10-13 feature 18 - `confirmNewPassword` has `dependencies={["newPassword"]}` and the change-default-password mismatch validator ("The new passwords do not match!"); the silent guard in `onFinish` was removed. Awaiting `/audit` re-review. Closed 2026-10-13 by /audit independent current (e16f6e5): `UpdatePassword.tsx` `confirmNewPassword` has `dependencies={["newPassword"]}` and a validator identical to `change-default-password/page.tsx` with the same message; the silent guard is gone, so antd blocks `onFinish` on mismatch.

### 18/F-13 [P3] closed - Change-default-password page does not redirect signed-out visitors

**File:** src/app/(must-auth)/change-default-password/layout.tsx:17
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - reproduced in the browser: signed out, `/change-default-password` stays put and renders the form.
**Why it matters:** The layout redirects users who already reset their password, but renders the form for visitors with no session. Submitting then fails with a 401 instead of sending them to login.
**Suggested fix:** Also `router.replace("/auth/login")` when `!loading && !user`.
**Resolution:** 2026-10-13 feature 18 - the layout redirects to `/auth/login` when `!loading && !user` and keeps the spinner up until a user is loaded. Awaiting `/audit` re-review. Closed 2026-10-13 by /audit independent current (e16f6e5): `change-default-password/layout.tsx` returns early while loading, replaces to `/auth/login` when `!user`, keeps the `/` redirect for reset users, and renders the spinner while `loading || !user`; matches the `withAuth` signed-out signal. Post-success logout sets `current-user` to null, which triggers the same `/auth/login` redirect, so no conflict.

## Independent review

**Status:** passed
**Target commit:** e16f6e55e23f6f261570b7d1a1b412c34df242d5
**Base commit:** 705e768f8cd058c54b087496ed7f1f81aeabc992
**Base ref:** origin/main
**Spec hash:** b4ce0a242edc7662506fd2e511ce4d6b59b16f8e20811829d69ab5194371b7dc
**Prepared by:** claude
**Builder model:** claude-opus-5-5
**Requested reviewer:** claude
**Requested model:** claude-opus-5-5
**Requested execution:** automatic
**Requested at:** 2026-10-13T15:35:33Z
**Workflow:** regular
**Check required:** no
**Reviewer adapter:** claude
**Reviewer model:** claude-opus-5-5
**Reviewer context:** fresh subagent
**Actual execution:** automatic
**Reviewed at:** 2026-10-13T15:37:38Z
**Scope:** current
**Lenses:** quality, security, performance, tests
**Verdict:** passed
**Check result:** not-required

### Handoff

Review the active spec and the complete `705e768f8cd058c54b087496ed7f1f81aeabc992..e16f6e55e23f6f261570b7d1a1b412c34df242d5` delta in a fresh
session or isolated subagent without the builder conversation. Run all Audit lenses from scratch.
Run Check when required above. Do not edit product code, accept findings, or
reuse the existing findings as the review scope.

### Commands

- `npx tsc --noEmit`: pass
- `npm run lint`: pass (no ESLint warnings or errors)
- `npm run verify`: pass (typecheck and static `next build`)

### Evidence

- Pre-review state matched the request: HEAD, merge base of origin/main, spec SHA-256 (tracked spec), and a clean tree except `blueprint/context/review.md`.
- Target commit e16f6e5 diff read in full: all feature 18 scope items (F-09 to F-13) present and limited to the listed files; repo search finds no remaining references to removed hooks, actions, files, or packages.
- Lockfile change removes only `json-2-csv`, `js-file-download`, and their transitive `deeks` and `doc-path`.
- Frontend action URLs across the full delta checked against v1 backend routes (`../nera_pmt_gw` branch `v1.0.0`, `src/v1/routes/platform/`); feature 18 only removes unused callers and changes no route.
- Earlier delta commits (route restructure, antd 6, v1 2FA, query cache, inactivity logout, email resend, fonts, CI workflow) skimmed for security and quality regressions; `withAuth`, providers, protected layout, and Verify workflow (`contents: read`) inspected.

### Findings

- None new. Closed F-08, F-09, F-10, F-11, F-12, F-13 after re-examination. F-14 to F-17 (P3) remain open and non-blocking.

### Remaining risk

- No unit test runner is configured; no unit tests could run.
- No browser test harness is configured; behavior of the F-10 to F-13 fixes was verified by code reading only, not observed in a running app (Check not required).
- AirtelTigo display (F-11) depends on live merchant data shape; not exercised against the v1 API.

## Try it now

Run `npm run local`, then in a private or signed-out browser window open http://localhost:3000/change-default-password

Expected: a loading spinner briefly, then you land on `/auth/login`. The change-password form never appears.

This proves: signed-out visitors to the change-default-password page are now sent to login (F-13).
