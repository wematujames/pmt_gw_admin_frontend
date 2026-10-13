# Findings

> **Generated file.** The findings ledger: review findings raised by `/audit`
> against the work in progress, each with a durable ID, severity (P0-P3), and
> status. `/implement` marks repaired findings `fixed`, a later `/audit` pass
> moves them to `closed`, and `/complete` refuses to land while any P0 or P1
> finding is `open` or `fixed`, then archives resolved findings with the work
> and resets this file.

### F-01 [P1] fixed - 2FA login ignores the v1 login response, so 2FA users cannot sign in

**File:** src/app/auth/login/LoginForm.tsx:20 (also src/app/auth/login/page.tsx:21)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - reproduced in the browser against a mocked v1 login response: no 2FA screen, no token stored, user lands back on `/auth/login`.
**Why it matters:** v1 `POST /platform/auth/login` returns `{ multiFAEnabled: true, loginToken }` for 2FA users (nera_pmt_gw `services/AuthService.js:113`). The frontend only checks `res.mfa`, which v1 never sends. It shows "Logged in successfully" and pushes to the dashboard with no token stored, and `withAuth` sends the user back to login. Any staff member with 2FA enabled is locked out.
**Suggested fix:** Branch on `res.multiFAEnabled`: store `res.loginToken` and go straight to `AuthenticatorVerification` (v1 only verifies TOTP codes). Keep the v1 contract; do not port the v2 `mfa` shape.
**Resolution:** Fixed 2026-10-13 (not yet re-reviewed). `LoginForm` branches on `res.multiFAEnabled` and passes `res.loginToken` to the login page, which shows `AuthenticatorVerification`; `login2fa` sends only `{ verificationCode, loginToken }`. Browser check with v1-shaped mocks: no-2FA login, 2FA login with a valid code, and a wrong code plus Back all behave correctly.

### F-02 [P1] open - Logout clears the wrong QueryClient, so users bounce back into the app

**File:** src/app/(protected)/layout.tsx:27 (with src/hooks/useLogout.ts:9)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - reproduced in the browser: after Logout the token is removed but the app returns to `/dashboard/financial`, still shows the user, and fires API calls with no token.
**Why it matters:** The protected layout creates a second `QueryClient` nested inside the root one from `providers.tsx`. `withAuth` and the auth layout read `current-user` from the root client, but Avatar, UpdatePassword, and TwoFactorAuth call `useLogout` under the nested client, so `setQueryData`/`clear()` never touch the root cache. After logout, `/auth/login` still sees a fresh cached user (5 min `staleTime`) and redirects to `/dashboard/financial`, where every API call now fails without a token.
**Suggested fix:** Use one QueryClient: move the mutation/query defaults into the root client in `src/app/providers.tsx` and delete the nested `QueryClientProvider` in the protected layout. Nothing is lost.
**Resolution:**

### F-03 [P1] open - Saving permissions without ticking a box revokes all of the user's permissions

**File:** src/app/(protected)/users/Permissions.tsx:24
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - reproduced in the browser: modal showed 2 permissions ticked, clicking Update sent `{ permissions: [] }`. v1 `User.permissions` are unpopulated ObjectIds, so the ticks are accurate.
**Why it matters:** `perms` starts as `[]` while the checkboxes show the user's current permissions through `defaultValue`. Clicking "Update Permissions" before changing anything sends `permissions: []`, and v1 replaces the list outright (`PermissionService.updateUserPermission` is `findByIdAndUpdate(userId, { permissions })`). One misclick strips an admin's access.
**Suggested fix:** Initialise `perms` from `user.permissions` (and reset it when the modal opens), or make the `Checkbox.Group` controlled with `value={perms}`.
**Resolution:**

### F-04 [P1] invalid - Merchant configuration saves stale values (first save always fails)

**File:** src/app/(protected)/merchants/ConfigureMerchant.tsx:49
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Why it matters:** `handleSubmit` calls `setPerms(...)` and then `mutate()` right away. The mutation closes over the previous render's `perms`, so the first Save sends `[]`, which v1 rejects ("Collection config must be an object"). Each later Save sends the values from the click before it, so a merchant's limits and channels can be saved with the wrong values.
**Suggested fix:** Drop the `perms` state and pass the payload as a mutation variable: `mutationFn: (config) => updateMerchantConfig(id, config)` and `mutate(transformMerchantConfig(vals))`.
**Resolution:** Invalid (2026-10-13 re-check). In the browser, the first Save on three fresh loads and two consecutive Saves all sent the values just entered. TanStack Query's `MutationObserver.setOptions` pushes the re-rendered `mutationFn` into the in-flight mutation before `mutationFn` runs, so the stale closure never executes. Passing the payload as a mutation variable is still a cleaner pattern, but nothing is broken.

### F-05 [P2] fixed - SMS 2FA path calls a route that does not exist in v1

**File:** src/actions/auth.ts:62 (UI in src/app/auth/login/2fa/SmsVerification.tsx, MfaSelector.tsx)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - `/auth/smsmfaotp` matches no route in nera_pmt_gw `src/v1/routes`; `AuthService.login2fa` checks only `authenticator.check`.
**Why it matters:** `sendSmsOtp` posts to `/auth/smsmfaotp`. v1 has no such route under any prefix, and `login2fa` only checks authenticator codes. The SMS screen and the method selector are carried over from v2 and cannot work against v1.
**Suggested fix:** Once F-01 is fixed, remove `SmsVerification`, `MfaSelector`, and `sendSmsOtp` (shipped but unreachable UI; needs your OK). Requirement lost: none against v1.
**Resolution:** Fixed 2026-10-13 (not yet re-reviewed). Removed `SmsVerification.tsx`, `MfaSelector.tsx`, `sendSmsOtp`, and the `MfaMethod` type.

### F-06 [P2] open - "Resend verification link" always fails

**File:** src/actions/auth.ts:66 (UI in src/app/auth/verification/email/Failed.tsx:17)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - `/user/updateemail` is behind `auth.protect` and validates `newEmail`/`password`; no resend route exists in v1.
**Why it matters:** `resendEmailVeriLink` sends `PUT /platform/auth/user/updateemail` with `{ token: <email> }`. That route requires login (`auth.protect`) and a different body, but this page is public. v1 has no resend endpoint.
**Suggested fix:** Replace the resend form with guidance to sign in and re-submit the email under Account > Email (which v1 supports), or remove it. Needs your decision because it changes shipped UI.
**Resolution:**

### F-07 [P2] open - Profile, email, and phone updates never refresh the current user

**File:** src/app/(protected)/user/manage/components/UpdateProfile.tsx:23 (same pattern in UpdateEmail.tsx:21, UpdatePhone.tsx:22)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - code only (no query uses those keys). TwoFactorAuth removed from scope: it logs out after success, so stale data is never visible there.
**Why it matters:** Each `onSuccess` invalidates its own mutation key (for example `["update-current-user"]`), which matches no query. The header greeting, avatar, and form defaults keep showing the old name, email, or phone until reload.
**Suggested fix:** Invalidate `["current-user"]`. This depends on F-02, because with two clients the header reads a different cache.
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
