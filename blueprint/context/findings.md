# Findings

> **Generated file.** The findings ledger: review findings raised by `/audit`
> against the work in progress, each with a durable ID, severity (P0-P3), and
> status. `/implement` marks repaired findings `fixed`, a later `/audit` pass
> moves them to `closed`, and `/complete` refuses to land while any P0 or P1
> finding is `open` or `fixed`, then archives resolved findings with the work
> and resets this file.

### F-06 [P2] open - "Resend verification link" always fails

**File:** src/actions/auth.ts:66 (UI in src/app/auth/verification/email/Failed.tsx:17)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - `/user/updateemail` is behind `auth.protect` and validates `newEmail`/`password`; no resend route exists in v1.
**Why it matters:** `resendEmailVeriLink` sends `PUT /platform/auth/user/updateemail` with `{ token: <email> }`. That route requires login (`auth.protect`) and a different body, but this page is public. v1 has no resend endpoint.
**Suggested fix:** Replace the resend form with guidance to sign in and re-submit the email under Account > Email (which v1 supports), or remove it. Needs your decision because it changes shipped UI.
**Resolution:**

### F-08 [P3] open - Montserrat is never applied; body loads an unused cursive font

**File:** src/fonts/fonts.ts:13
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - corrected. In the browser `<body>` computes to Cedarville Cursive, but antd's Layout and Card set the system font, so every visible text checked (module headers, "Total Records", greeting, footer, auth copy) renders in the system font. Users never see the cursive face. Downgraded from P2.
**Why it matters:** `export const montserrat = Cedarville_Cursive(...)` is applied to `<body>` and the Montserrat rules in `globals.css` are commented out (lines 3-118). The app downloads a font it never shows, and Montserrat, which the code clearly intends, is never used.
**Suggested fix:** Decide whether the app should use Montserrat. If yes, load it with `next/font` and pass it to antd through the `fontFamily` theme token (the body class alone is overridden by antd). If no, delete `fonts.ts` and the commented CSS. Either way drop the unused `inter` and `roboto_mono` exports.
**Resolution:**

### F-09 [P3] open - Dead and shadowed code

**File:** src/hooks/useLogout.jsx:1
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - no references outside the definitions. In the browser, Logout called `GET /platform/auth/logout` without crashing, confirming the `.ts` hook is the one resolved.
**Why it matters:** These are unused, and some are broken if ever imported. `useLogout.jsx` imports a non-existent `logout` and routes to `/auth/sign-in`; it is only shadowed by `useLogout.ts` through resolution order. Also unused: `getCollectionStatics` and `getDibursementStatics` (their v1 routes are commented out), `getTransaction`, `getPlatformUser`, `useValidatePwd`, `useDebounce`, `utils/exportData.tsx` (the only user of `json-2-csv` and `js-file-download`), the empty `app/_error.tsx`, `app/500.tsx` (not a route in the App Router), and the unused `loading` state in the four detail modals.
**Suggested fix:** Delete them and remove the two export dependencies. Requirement lost: none.
**Resolution:**

### F-10 [P3] open - Forgot-password errors show as a success toast

**File:** src/app/auth/forgot-password/page.tsx:25
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - reproduced in the browser: a 401 "Not authorized" showed with the success style.
**Why it matters:** `onError` calls `openMessage("success", ...)`, so an unknown email or server error looks like a success.
**Suggested fix:** Use `"error"`.
**Resolution:**

### F-11 [P3] open - Merchant details always show AirtelTigo as Disabled

**File:** src/app/(protected)/merchants/utils.tsx:42
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - code only; `utils.tsx:42` vs model key `airtelTigo`.
**Why it matters:** Reads `config.channels.airteltigo`; the v1 model key is `airtelTigo` (`models/MerchantConfig.js:94`), which ConfigureMerchant uses correctly.
**Suggested fix:** Use `airtelTigo`.
**Resolution:**

### F-12 [P3] open - Password change silently does nothing on mismatch

**File:** src/app/(protected)/user/manage/components/UpdatePassword.tsx:37
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - code only; `UpdatePassword.tsx:37` returns with no message and has no `dependencies` rule.
**Why it matters:** When the two new passwords differ, `onFinish` returns with no message. The change-default-password page already does this correctly with a `dependencies` validator.
**Suggested fix:** Reuse that validator rule on `confirmNewPassword`.
**Resolution:**

### F-13 [P3] open - Change-default-password page does not redirect signed-out visitors

**File:** src/app/(must-auth)/change-default-password/layout.tsx:17
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - reproduced in the browser: signed out, `/change-default-password` stays put and renders the form.
**Why it matters:** The layout redirects users who already reset their password, but renders the form for visitors with no session. Submitting then fails with a 401 instead of sending them to login.
**Suggested fix:** Also `router.replace("/auth/login")` when `!loading && !user`.
**Resolution:**

### F-14 [P3] open - Four byte-identical Reload button components

**File:** src/app/(protected)/users/ReloadUsers.tsx:7 (copies in merchants/ReloadMerchants.tsx, direct-debit/mandates/ReloadDirectDebitMandates.tsx, transactions/ReloadTransactions.tsx)
**Found:** 2026-10-13 by /audit independent current (scope: current; lens: all)
**Why it matters:** The route restructure added three copies of `ReloadTransactions` that differ only in the function name. Each takes `keys` and invalidates them, so a future change (for example a loading state) must be made four times.
**Suggested fix:** Keep one shared `ReloadButton` (for example in `src/components/`) and pass `keys` from each page; delete the other three files. Requirement lost: None.
**Resolution:**

### F-15 [P3] open - Four filter drawers copy the same submit and reset logic

**File:** src/app/(protected)/users/FilterUsers.tsx:20 (copies in merchants/FilterMerchants.tsx:20, direct-debit/mandates/FilterDDebitMandates.tsx:27, transactions/FilterTransactions.tsx:27)
**Found:** 2026-10-13 by /audit independent current (scope: current; lens: quality)
**Why it matters:** `onFinish` (date-range to `startDate`/`endDate`, empty-value stripping, keep `_limit`, reset `_page`) and `handleReset` are identical in all four drawers, and the `["merchants-ids"]` query is repeated in two of them. A change to the filter-to-query contract (for example how dates are sent to v1 `advancedResult`) must be made four times and can drift.
**Suggested fix:** Extract one small helper (for example `toListFilter(formVals, prev)` in `src/utils/common.ts`) used by all four `onFinish` handlers; optionally pair it with F-14's shared reload button. Requirement lost: None.
**Resolution:**

### F-16 [P3] open - Later-firing idle tab sends logout with no token and shows an error toast

**File:** src/app/(protected)/layout.tsx:27 (with src/hooks/useLogout.ts:12, src/actions/utils/nerasikaAxios.ts:19)
**Found:** 2026-10-13 by /audit independent current (scope: current; lens: all)
**Why it matters:** When every open tab goes idle, each tab's timer fires on its own (background tabs often late because browsers throttle hidden-tab timers). The first tab's `logout()` removes the shared token in `onSettled`. A tab that fires after that calls `GET /platform/auth/logout` with no `Authorization` header, so the request fails and the global mutation `onError` shows an error toast next to "You were logged out due to inactivity." The user still ends on `/auth/login`, so this is cosmetic, but it happens in exactly the multi-tab case this feature targets. Server rejection of a tokenless logout is inferred from the route being authenticated, not observed.
**Suggested fix:** In `logoutForInactivity`, skip the server call when the token is already gone (for example, check `localStorage` for the token key and only redirect to `/auth/login`), or let item 19's toast cleanup cover it. No route change. Requirement lost: None.
**Resolution:**

### F-17 [P3] open - A future `lastActivityAt` stretches or defeats the timeout

**File:** src/hooks/useInactivityTimeout.ts:40
**Found:** 2026-10-13 by /audit independent current (scope: current; lens: all)
**Why it matters:** `idleFor = Date.now() - last` goes negative when the stored time is ahead of the clock (system clock moved back after a write). The timer then re-arms for `timeoutDuration - idleFor`, which is longer than 15 minutes, so the session outlives the timeout by the skew. If the skew is above about 24.8 days, the delay overflows `setTimeout`'s 32-bit limit, the timer fires at once and re-arms forever, which keeps the tab busy and never logs out. Rare and needs a clock change, so P3.
**Suggested fix:** Clamp the read value, for example `const last = Math.min(readLastActivity() ?? 0, Date.now())`, or treat `last > Date.now()` as absent in `readLastActivity`. Requirement lost: None.
**Resolution:**
