# Findings

> **Generated file.** The findings ledger: review findings raised by `/audit`
> against the work in progress, each with a durable ID, severity (P0-P3), and
> status. `/implement` marks repaired findings `fixed`, a later `/audit` pass
> moves them to `closed`, and `/complete` refuses to land while any P0 or P1
> finding is `open` or `fixed`, then archives resolved findings with the work
> and resets this file.

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
