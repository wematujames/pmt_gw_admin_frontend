# Feature: Single query cache

**From build-plan:** feature 13
**Build attempt:** 1
**Branch:** feature/single-query-cache
**Status:** verified

## Goal

Run the whole app on one TanStack `QueryClient`. Logout then clears the cache that
`withAuth` and the auth layout actually read, so the user lands on the login form
and stays there. Profile, email, and phone updates refresh `["current-user"]`, so
the header greeting, avatar, and form defaults show the new values without a reload.
Resolves findings F-02 and F-07. Step 3, added after independent review, also fixes
F-03 (build-plan item 14) because that open P1 blocks completion.

## In scope

- Move the protected layout's client defaults into the single root client in
  `src/app/providers.tsx`:
  - mutations: `onSuccess` shows `"Success"`, and `onError` shows
    `err.response?.data.message || err.message` through `useMessage().openMessage`
  - queries: `refetchOnWindowFocus: false` and `refetchOnReconnect: false`
- Delete the nested `QueryClientProvider` and its `QueryClient` from
  `src/app/(protected)/layout.tsx`.
- Make `UpdateProfile`, `UpdateEmail`, and `UpdatePhone` invalidate
  `["current-user"]` on success instead of their own mutation keys.
- F-03: the user permissions modal sends exactly the boxes shown as ticked, starting
  from the user's current permissions.

## Out of scope

- Inactivity auto-logout (feature 11). Leave the commented `useInactivityTimeout` line alone.
- Deleting the shadowed `src/hooks/useLogout.jsx` and other dead code (F-09, feature 18).
- Changes to `useLogout.ts` logic. It is already correct once there is one client.
- `TwoFactorAuth`'s invalidation. It logs out after success, so F-07 excludes it.
- The email verification resend flow (feature 16), API routes, and any v2 behavior.

## Build loop

`workflow.stepReview` is `feature` and `checkpointCommits` is `disabled`. Build all
steps, run Verify after each one, and present one review packet at the end. No
step checkpoint commits. `/complete` creates the feature commit.

## Build steps

- [x] 1. **One root QueryClient.** In `src/app/providers.tsx`, add a small inner
  client component, for example `QueryProvider`, rendered inside `MessageProvider`.
  It calls `useMessage()` and creates the client once with
  `useState(() => new QueryClient({ defaultOptions }))`, using the defaults listed in
  scope. `Providers` cannot call `useMessage` itself because `MessageProvider` is its
  child, so the inner component is required. In
  `src/app/(protected)/layout.tsx`, remove the `QueryClient`/`QueryClientProvider`
  import, the `useState` client, and the wrapper element. Keep `useState` for
  `collapsed`. Leave the rest of the layout markup unchanged.
  **Done when:** `grep -rn "new QueryClient" src` returns only `providers.tsx`, and
  Verify passes. In the browser, after Avatar -> Logout, the app shows the
  `/auth/login` form and stays there. It does not bounce back to
  `/dashboard/financial`, and no `/platform/...` calls fire without a token.
  Signing in again shows the dashboard.
- [x] 2. **Account updates refresh the current user.** In `UpdateProfile.tsx`,
  `UpdateEmail.tsx`, and `UpdatePhone.tsx`, replace the `invalidateQueries` key with
  `["current-user"]`. Keep each component's own success and error messages. Where a
  form calls `form.resetFields()` after success, await
  `queryClient.invalidateQueries({ queryKey: ["current-user"] })` first so the reset
  uses the refreshed values. `UpdateProfile` resets only `password`, so its name
  fields already hold the submitted values.
  **Done when:** Verify passes. After a successful profile update, the header
  greeting shows the new first name without a reload. After a successful phone
  update, the form shows the new value. For email, the form shows whatever
  `GET /platform/auth/user` returns after the change. A pending-verification email
  may still show the old address, which is backend behavior and outside this feature.

- [x] 3. **Permissions editor starts from current permissions (F-03).** In
  `src/app/(protected)/users/Permissions.tsx`, make `Checkbox.Group` controlled
  with `value={perms}` and set `perms` from `user.permissions` (as strings) each
  time the modal opens. "Update Permissions" then sends exactly what is ticked.
  The API call and route are unchanged.
  **Done when:** Verify passes. Opening the modal and clicking Update without
  changes sends the user's current permission IDs, not `[]`. Unticking a box
  removes only that ID, and closing then reopening the modal discards unsaved ticks.

## Files / areas

- `src/app/providers.tsx` - single client with the moved defaults
- `src/app/(protected)/layout.tsx` - remove the nested provider
- `src/app/(protected)/user/manage/components/UpdateProfile.tsx`
- `src/app/(protected)/user/manage/components/UpdateEmail.tsx`
- `src/app/(protected)/user/manage/components/UpdatePhone.tsx`
- `src/app/(protected)/users/Permissions.tsx` - controlled permissions selection
- Read-only context: `src/hooks/useLogout.ts`, `src/hooks/useUser.jsx`,
  `src/components/routing/withAuth.tsx`, `src/app/auth/layout.tsx`

## Data / contracts

- There are no API or route changes. The query key `["current-user"]` (from
  `useUser`) is the single source for the signed-in user.
- TanStack Query 5 merges default and per-call options with the per-call values
  winning. A `useMutation` that defines its own `onSuccess` or `onError` therefore
  replaces the default handler and does not show two toasts.
- Auth token storage is unchanged. `useLogout` removes the `localStorage` token and
  clears the cache whether or not the server logout succeeds.

## Testing

- Run Verify (`npm run verify`) after each step. It passed on `v1` at 5833377
  before this spec was written.
- There is no unit or browser test runner, so no automated tests are added. The
  Done-when browser checks are manual and belong in `/check`. They need a running
  dev server and a v1 backend account.

## Notes for the AI

- **Default handlers now apply on the auth pages too.** Every auth-page mutation
  already defines its own handlers except `verify-email`, which has no `onSuccess`.
  A successful email verification will now also show a `"Success"` toast next to
  its success card. This is accepted as harmless; feature 16 reworks that flow.
  Logout from Avatar, UpdatePassword, and TwoFactorAuth already showed the default
  toasts under the nested client, so that does not change.
- `refetchOnWindowFocus: false` becomes the app-wide query default. `useUser` sets
  `refetchOnWindowFocus: true` explicitly, so the current-user check is unchanged.
- This feature touches the auth/session boundary, so the `when-sensitive`
  independent review gate is expected to apply.
- Only `refs/heads/v1` exists locally. Branch `feature/single-query-cache` from `v1`.
- Implementation note (step 2): antd only applies `initialValues` on a later
  render, so `form.resetFields()` right after the refetch can still restore the old
  value. Email and phone therefore also call `form.setFieldValue` for the read-only
  current field from `queryClient.getQueryData(["current-user"])`. The email
  success toast now shows before the refetch, matching the phone form.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":7241,"specSha256":"5f62f2247e24f80a4c38065ff986bc0ac2c0c2b483057a86ea2042843a3309d5","branch":"refs/heads/feature/single-query-cache","head":"75a06cc0adde18688daa80875090ff73fd0a4416","baseRef":"refs/heads/v1","baseCommit":"5833377b34ac16b5bee63830b8c921c072bf0a1d","sourceTree":"d65d11201a0b101f8cd4b448a4b94c8cbd5d44e4","landing":"local-merge","absentOptional":[]} -->

## Findings

### 13/F-01 [P1] closed - 2FA login ignores the v1 login response, so 2FA users cannot sign in

**File:** src/app/auth/login/LoginForm.tsx:20 (also src/app/auth/login/page.tsx:21)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - reproduced in the browser against a mocked v1 login response: no 2FA screen, no token stored, user lands back on `/auth/login`.
**Why it matters:** v1 `POST /platform/auth/login` returns `{ multiFAEnabled: true, loginToken }` for 2FA users (nera_pmt_gw `services/AuthService.js:113`). The frontend only checks `res.mfa`, which v1 never sends. It shows "Logged in successfully" and pushes to the dashboard with no token stored, and `withAuth` sends the user back to login. Any staff member with 2FA enabled is locked out.
**Suggested fix:** Branch on `res.multiFAEnabled`: store `res.loginToken` and go straight to `AuthenticatorVerification` (v1 only verifies TOTP codes). Keep the v1 contract; do not port the v2 `mfa` shape.
**Resolution:** Fixed 2026-10-13 (not yet re-reviewed). `LoginForm` branches on `res.multiFAEnabled` and passes `res.loginToken` to the login page, which shows `AuthenticatorVerification`; `login2fa` sends only `{ verificationCode, loginToken }`. Browser check with v1-shaped mocks: no-2FA login, 2FA login with a valid code, and a wrong code plus Back all behave correctly. Closed 2026-10-13 by independent review (7c429c7): `LoginForm.tsx:20` branches on `res.multiFAEnabled` and hands `res.loginToken` to `AuthenticatorVerification`; `login2fa` posts only `{ verificationCode, loginToken }` to `/platform/auth/login2fa`, matching nera_pmt_gw `v1/services/AuthService.js:110-136`. No new defect found.

### 13/F-02 [P1] closed - Logout clears the wrong QueryClient, so users bounce back into the app

**File:** src/app/(protected)/layout.tsx:27 (with src/hooks/useLogout.ts:9)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - reproduced in the browser: after Logout the token is removed but the app returns to `/dashboard/financial`, still shows the user, and fires API calls with no token.
**Why it matters:** The protected layout creates a second `QueryClient` nested inside the root one from `providers.tsx`. `withAuth` and the auth layout read `current-user` from the root client, but Avatar, UpdatePassword, and TwoFactorAuth call `useLogout` under the nested client, so `setQueryData`/`clear()` never touch the root cache. After logout, `/auth/login` still sees a fresh cached user (5 min `staleTime`) and redirects to `/dashboard/financial`, where every API call now fails without a token.
**Suggested fix:** Use one QueryClient: move the mutation/query defaults into the root client in `src/app/providers.tsx` and delete the nested `QueryClientProvider` in the protected layout. Nothing is lost.
**Resolution:** Fixed 2026-10-13 in feature 13 (not yet re-reviewed). The protected layout no longer creates a nested `QueryClient`; its mutation and query defaults moved to the single root client in `src/app/providers.tsx`, so `useLogout` clears the cache `withAuth` and the auth layout read. Verify passes; browser logout check not yet run. Closed 2026-10-13 by independent review (7c429c7): `new QueryClient`/`QueryClientProvider` appear only in `src/app/providers.tsx`; the protected layout has no nested provider, so `useLogout`'s `clear()` acts on the client `withAuth` and `auth/layout.tsx` read. Moved defaults match the removed ones and per-call handlers still override them. Code-level only; the browser logout check was not run (Check not required).

### 13/F-03 [P1] closed - Saving permissions without ticking a box revokes all of the user's permissions

**File:** src/app/(protected)/users/Permissions.tsx:24
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - reproduced in the browser: modal showed 2 permissions ticked, clicking Update sent `{ permissions: [] }`. v1 `User.permissions` are unpopulated ObjectIds, so the ticks are accurate.
**Why it matters:** `perms` starts as `[]` while the checkboxes show the user's current permissions through `defaultValue`. Clicking "Update Permissions" before changing anything sends `permissions: []`, and v1 replaces the list outright (`PermissionService.updateUserPermission` is `findByIdAndUpdate(userId, { permissions })`). One misclick strips an admin's access.
**Suggested fix:** Initialise `perms` from `user.permissions` (and reset it when the modal opens), or make the `Checkbox.Group` controlled with `value={perms}`.
**Resolution:** Still open 2026-10-13 after independent review (7c429c7): the file moved to `src/app/(protected)/users/Permissions.tsx` in the reviewed delta, and `perms` still starts as `[]` (line 24) while `Checkbox.Group` uses `defaultValue` (line 87), so the defect is unchanged. Blocks a passing independent receipt until repaired or explicitly accepted by the user. Fixed 2026-10-13 in feature 13 step 3 (not yet re-reviewed): `Checkbox.Group` is controlled by `perms`, which is set from `user.permissions` each time the modal opens, so Update sends exactly what is ticked. Verify passes; browser check not yet run. Closed 2026-10-13 by independent review (75a06cc): `Checkbox.Group` is controlled by `perms` (line 93), and the Permissions trigger sets `perms` from `user.permissions` as strings before opening (lines 57-60), so Update without changes sends the current IDs and reopening discards unsaved ticks. The mutation still posts `{ user, permissions }` to `PUT /platform/permissions/grant`, matching nera_pmt_gw `v1/routes/platform/permissionsRouter.js`. The Modal is a sibling of the trigger, so checkbox clicks do not re-run the reset. No new defect found. Code-level only; the browser check was not run (Check not required).

### 13/F-04 [P1] invalid - Merchant configuration saves stale values (first save always fails)

**File:** src/app/(protected)/merchants/ConfigureMerchant.tsx:49
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Why it matters:** `handleSubmit` calls `setPerms(...)` and then `mutate()` right away. The mutation closes over the previous render's `perms`, so the first Save sends `[]`, which v1 rejects ("Collection config must be an object"). Each later Save sends the values from the click before it, so a merchant's limits and channels can be saved with the wrong values.
**Suggested fix:** Drop the `perms` state and pass the payload as a mutation variable: `mutationFn: (config) => updateMerchantConfig(id, config)` and `mutate(transformMerchantConfig(vals))`.
**Resolution:** Invalid (2026-10-13 re-check). In the browser, the first Save on three fresh loads and two consecutive Saves all sent the values just entered. TanStack Query's `MutationObserver.setOptions` pushes the re-rendered `mutationFn` into the in-flight mutation before `mutationFn` runs, so the stale closure never executes. Passing the payload as a mutation variable is still a cleaner pattern, but nothing is broken.

### 13/F-05 [P2] closed - SMS 2FA path calls a route that does not exist in v1

**File:** src/actions/auth.ts:62 (UI in src/app/auth/login/2fa/SmsVerification.tsx, MfaSelector.tsx)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - `/auth/smsmfaotp` matches no route in nera_pmt_gw `src/v1/routes`; `AuthService.login2fa` checks only `authenticator.check`.
**Why it matters:** `sendSmsOtp` posts to `/auth/smsmfaotp`. v1 has no such route under any prefix, and `login2fa` only checks authenticator codes. The SMS screen and the method selector are carried over from v2 and cannot work against v1.
**Suggested fix:** Once F-01 is fixed, remove `SmsVerification`, `MfaSelector`, and `sendSmsOtp` (shipped but unreachable UI; needs your OK). Requirement lost: none against v1.
**Resolution:** Fixed 2026-10-13 (not yet re-reviewed). Removed `SmsVerification.tsx`, `MfaSelector.tsx`, `sendSmsOtp`, and the `MfaMethod` type. Closed 2026-10-13 by independent review (7c429c7): no references to `smsmfaotp`, `mfaType`, `MfaMethod`, `MfaSelector`, `SmsVerification`, or `sendSmsOtp` remain in `src`; `src/app/auth/login/2fa/` holds only `AuthenticatorVerification.tsx`.

### 13/F-07 [P2] closed - Profile, email, and phone updates never refresh the current user

**File:** src/app/(protected)/user/manage/components/UpdateProfile.tsx:23 (same pattern in UpdateEmail.tsx:21, UpdatePhone.tsx:22)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - code only (no query uses those keys). TwoFactorAuth removed from scope: it logs out after success, so stale data is never visible there.
**Why it matters:** Each `onSuccess` invalidates its own mutation key (for example `["update-current-user"]`), which matches no query. The header greeting, avatar, and form defaults keep showing the old name, email, or phone until reload.
**Suggested fix:** Invalidate `["current-user"]`. This depends on F-02, because with two clients the header reads a different cache.
**Resolution:** Fixed 2026-10-13 in feature 13 (not yet re-reviewed). `UpdateProfile`, `UpdateEmail`, and `UpdatePhone` invalidate `["current-user"]`; email and phone await the refetch and set the read-only current value from it after resetting the form. Verify passes; browser check not yet run. Closed 2026-10-13 by independent review (7c429c7): all three components invalidate `["current-user"]`, the key `useUser` reads, on the single root client; no other query uses the old mutation keys. Code-level only; the browser refresh check was not run (Check not required).

## Independent review

**Status:** passed
**Target commit:** 75a06cc0adde18688daa80875090ff73fd0a4416
**Base commit:** 705e768f8cd058c54b087496ed7f1f81aeabc992
**Base ref:** origin/main
**Spec hash:** 5f62f2247e24f80a4c38065ff986bc0ac2c0c2b483057a86ea2042843a3309d5
**Prepared by:** claude
**Builder model:** claude-opus-5-5
**Requested reviewer:** claude
**Requested model:** claude-opus-5-5
**Requested execution:** automatic
**Requested at:** 2026-10-13T14:45:07Z
**Workflow:** regular
**Check required:** no
**Reviewer adapter:** claude
**Reviewer model:** claude-opus-5-5
**Reviewer context:** fresh subagent
**Actual execution:** automatic
**Reviewed at:** 2026-10-13T14:49:08Z
**Scope:** current
**Lenses:** quality, security, performance, tests
**Verdict:** passed
**Check result:** not-required

### Handoff

Review the active spec and the complete `705e768f8cd058c54b087496ed7f1f81aeabc992..75a06cc0adde18688daa80875090ff73fd0a4416` delta in a fresh
session or isolated subagent without the builder conversation. Run all Audit lenses from scratch.
Run Check when required above. Do not edit product code, accept findings, or
reuse the existing findings as the review scope.

### Commands

- `git rev-parse HEAD` / `git merge-base origin/main HEAD` / `git status --porcelain --untracked-files=all` / `shasum -a 256 blueprint/context/current-feature.md`: pass (HEAD, merge base, and spec hash match the request; only `blueprint/context/review.md` differed)
- `npm run lint`: pass (no ESLint warnings or errors)
- `npm run verify`: pass (`tsc --noEmit` clean; `next build` generated 17 static pages; one pre-existing CSS warning about the Montserrat `@import` order in unchanged `src/app/globals.css`)
- `npm ls @ant-design/cssinjs antd react @ant-design/nextjs-registry`: pass (single deduped cssinjs 2.1.2, antd 6.6.6, React 18.3.1)

### Evidence

- Single client: `new QueryClient`/`QueryClientProvider` exist only in `src/app/providers.tsx`; defaults match those removed from `src/app/(protected)/layout.tsx`; `openMessage` is a stable `useCallback`, so the once-created client does not hold a stale handler.
- Logout and re-login: `useLogout` clears the client that `withAuth` and `auth/layout.tsx` read; after login the errored `["current-user"]` query refetches on mount with status reset to pending, so `withAuth` shows the spinner instead of bouncing.
- Account updates invalidate `["current-user"]` (UpdateProfile, UpdateEmail, UpdatePhone); no query uses the old mutation keys.
- F-03 repair: `users/Permissions.tsx` controls `Checkbox.Group` with `perms`, seeded from `user.permissions` on open; payload unchanged.
- v1 contract: every `/platform/auth/*`, `/platform/users`, `/platform/merchants`, `/platform/merchantconfigs/:id`, `/platform/permissions[/grant]`, `/platform/directdebit/mandates`, and `/platform/summary/transactionsoverall` call matches nera_pmt_gw `src/v1/routes/platform`; `_page`/`_limit`/`startDate`/`endDate` and the `{ data, meta }` shape match `BaseService.advancedResult`.
- Auth header now comes from the `nerasikaAxios` request interceptor for every call; removed `setAuthToken` mutated global axios defaults only.
- No secrets in the delta; `blueprint/reference/testCreds.txt` is ignored and untracked.

### Findings

- F-03 [P1] closed (repair verified at 75a06cc)
- F-15 [P3] open, new: duplicated filter submit/reset logic in four drawers
- Still open from earlier passes and non-blocking: F-06 [P2], F-08 [P3], F-09 [P3], F-10 [P3], F-11 [P3], F-12 [P3], F-13 [P3], F-14 [P3]

### Remaining risk

- Check was not required and not run: browser logout, re-login, account-refresh, and permissions-modal behavior is verified at code level only.
- No unit or browser test command is declared, so there is no automated coverage for auth, filters, or permissions logic.
- Merchant ID dropdowns rely on v1's default 500-row limit; a larger merchant list would be truncated (unchanged from base).
- Build emits a CSS `@import` order warning for the Montserrat font in `src/app/globals.css` (related to F-08, unchanged in this delta).
- `npm audit` or another dependency vulnerability scan was not run (network-backed); the antd 6 and icons 6 upgrade was checked only through lint, typecheck, and build.

## Try it now

Run `npm run local`, sign in with a v1 account, then:

1. **Logout:** avatar menu → Logout. You land on `/auth/login` and stay there; signing in again loads the dashboard.
2. **Profile refresh:** avatar → View Profile, change First Name, enter your password, submit. The header greeting updates without a reload.
3. **Phone refresh:** Phone tab, submit a new number. "Current Phone Number" shows the new value.
4. **Permissions:** Users → a user's Permissions → Update without changing anything. In DevTools → Network, the `PUT /platform/permissions/grant` body lists the user's existing permission IDs, not `[]`.
