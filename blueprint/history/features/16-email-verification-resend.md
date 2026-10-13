# Feature: Email verification resend

**From build-plan:** feature 16
**Build attempt:** 1
**Branch:** feature/email-verification-resend
**Status:** verified

## Goal

Make the failed email-verification page lead users to a way of getting a new
link that the v1 backend supports, and make verification links work when the
user is already signed in. Resolves F-06.

## In scope

- Replace the "Resend Verification Link" email form on the failed-verification
  screen with guidance and a single button. v1 has no public resend route. The
  only way to get a new link is to re-submit the email on the account Email
  tab (`PUT /platform/auth/user/updateemail`, which needs sign-in and a
  password).
  - Signed out: the copy explains the steps and the button "Go to Sign In"
    links to `/auth/login`.
  - Signed in: the button "Open Email settings" links to
    `/user/manage?tab=email`.
  - Copy: "This verification link is invalid or has expired. To get a new one,
    sign in, open your account's Email tab, enter your email address as the
    New Email, add your password, and submit."
- Remove the dead `resendEmailVeriLink` action from `src/actions/auth.ts`.
  Nothing else calls it, and it sends the wrong body to a protected route.
- Let signed-in users verify. Today `src/app/auth/layout.tsx` redirects any
  signed-in user to `/dashboard/financial` and never renders its children. The
  verification page therefore never runs for someone who changed their email
  while signed in and clicked the link in the same browser, which is the usual
  case and the exact path the new guidance sends people down. Exempt
  `/auth/verification/email` from that redirect. Every other auth page keeps
  its current behaviour.
- After a successful verification, invalidate `["current-user"]` so a
  signed-in user's Email tab shows the verified flag (`V: true`) without a
  reload.

## Out of scope

- Any new or changed backend route. v1 routes are frozen, and a public resend
  endpoint doesn't exist.
- Merchant email verification, which lives in the merchant frontend.
- Changing the email form itself (`UpdateEmail.tsx`) or its "V:" addon text.
- The success screen's "Continue to Sign In" button. For a signed-in user it
  lands on the dashboard through the existing login-page redirect, which is
  acceptable.
- The no-token "Invalid Link" state. It's unchanged.

## Build loop

`workflow.stepReview` is `feature` and `checkpointCommits` is `disabled`. Build
both steps, run Verify once at the end, and present one review packet.
`/complete` makes the work commit. Step 1 changes auth-route gating, so the
`when-sensitive` independent review applies before `/complete`.

## Build steps

- [x] 1. **Let the verification page run for signed-in users.**
  - In `src/app/auth/layout.tsx`, read `usePathname()`. For paths starting with
    `/auth/verification/email`, skip the redirect and render `children` even
    when `user` is set. Still show the spinner while `loading`.
  - Check `next.config` for `trailingSlash`. The prefix match must cover both
    `/auth/verification/email` and `/auth/verification/email/`.
  - In `src/app/auth/verification/email/page.tsx`, add `onSuccess` to the
    verify mutation that invalidates `["current-user"]`. Keep the existing
    `onError`.
  - **Done when:** `npx tsc --noEmit` passes. The diff limits the exemption to
    the verification path, so `/auth/login` and the other auth pages still
    redirect signed-in users.
- [x] 2. **Replace the resend form with guidance.**
  - Rewrite `src/app/auth/verification/email/Failed.tsx` as a `Result` with the
    copy above and one button. Use `useUser()` to pick between the signed-out
    "Go to Sign In" link and the signed-in "Open Email settings" link.
  - Remove the input, the mutation and the `useMessage` import.
  - Delete `resendEmailVeriLink` from `src/actions/auth.ts`.
  - **Done when:** `npm run verify` passes and `grep -rn resendEmailVeriLink src`
    returns nothing. With `npm run local`:
    - Opening `/auth/verification/email?token=bad` signed out shows the failed
      screen with "Go to Sign In".
    - Signed in, the same URL shows "Open Email settings", which opens the
      Email tab.
    - A real link from an email change, opened while signed in, shows "Email
      Verified!", and the Email tab then shows `V: true`.

## Files / areas

- `src/app/auth/layout.tsx`: path-scoped redirect exemption.
- `src/app/auth/verification/email/page.tsx`: invalidate `current-user` on success.
- `src/app/auth/verification/email/Failed.tsx`: guidance instead of the form.
- `src/actions/auth.ts`: remove `resendEmailVeriLink`.
- Read only: `src/hooks/useUser.jsx`, `src/app/(protected)/user/manage/page.tsx`
  (reads `?tab=`), and `UpdateEmail.tsx`.

## Data / contracts

- `PUT /platform/auth/user/verifyemail { token }` is public and unchanged. The
  backend `AuthService.verifyEmail` sets `emailVerified = true`.
- `PUT /platform/auth/user/updateemail { newEmail, password }` is behind
  `auth.protect` and unchanged. `AuthService.updateEmail` sets the new email
  immediately, sets `emailVerified = false`, and emails a new link. It accepts
  the user's current address as `newEmail`, which is what makes "re-submit to
  get a new link" work.
- Login doesn't check `emailVerified`, so a user with an expired link can still
  sign in. This was confirmed in the v1 backend.
- No new storage, routes or API calls.

## Testing

- No unit test runner is configured, so there are no new unit tests.
- Verify (`npm run verify`): the baseline passed during spec writing.
- Runtime states (signed-out failed screen, signed-in failed screen, and a
  signed-in successful verification) need the dev server and a real link. They
  are covered by the manual path in step 2. Build output doesn't prove them.

## Notes for the AI

- Keep the exemption to the one verification path. Don't loosen the auth
  layout for login, forgot-password or reset-password.
- `withAuth` and the protected layout are untouched.
- The failed screen is reached from `verifyEmailMutation.isError`, and the page
  already toasts the server message. Don't add a second toast.
- Don't start a dev server. Ask the user for the runtime check.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":6213,"specSha256":"1e4b60da76969c33bf135c2a07789f9cedba93f829f47c3b19bb77f0f801502b","branch":"refs/heads/feature/email-verification-resend","head":"44fa74de7363d8b9548a7eb0be2bac5f3c2049d4","baseRef":"refs/heads/v1","baseCommit":"cc4704dd31fa298fe9d7f10cb211307f750b61bd","sourceTree":"279da01d6eb45724347bd6aae0f804985bc0d84c","landing":"local-merge","absentOptional":[]} -->

## Findings

### 16/F-06 [P2] closed - "Resend verification link" always fails

**File:** src/actions/auth.ts:66 (UI in src/app/auth/verification/email/Failed.tsx:17)
**Found:** 2026-10-13 by /audit (scope: full; lens: all)
**Verified:** 2026-10-13 re-check - `/user/updateemail` is behind `auth.protect` and validates `newEmail`/`password`; no resend route exists in v1.
**Why it matters:** `resendEmailVeriLink` sends `PUT /platform/auth/user/updateemail` with `{ token: <email> }`. That route requires login (`auth.protect`) and a different body, but this page is public. v1 has no resend endpoint.
**Suggested fix:** Replace the resend form with guidance to sign in and re-submit the email under Account > Email (which v1 supports), or remove it. Needs your decision because it changes shipped UI.
**Resolution:** Closed 2026-10-13 by /audit independent current (feature 16, target 44fa74d). `resendEmailVeriLink` is deleted from src/actions/auth.ts (no references remain in src); Failed.tsx no longer calls any route and instead links to /auth/login (signed out) or /user/manage?tab=email (signed in), the v1-supported `PUT /platform/auth/user/updateemail` path (auth.protect, re-submitting the current address issues a new link per AuthService.updateEmail). The auth layout exemption is limited to paths starting with /auth/verification/email, so signed-in users can reach that page while login, forgot-password and reset-password still redirect. No new defect found in the repair; `npm run verify` and `npm run lint` pass.

## Independent review

**Status:** passed
**Target commit:** 44fa74de7363d8b9548a7eb0be2bac5f3c2049d4
**Base commit:** 705e768f8cd058c54b087496ed7f1f81aeabc992
**Base ref:** origin/main
**Spec hash:** 1e4b60da76969c33bf135c2a07789f9cedba93f829f47c3b19bb77f0f801502b
**Prepared by:** claude
**Builder model:** claude-opus-5-5
**Requested reviewer:** claude
**Requested model:** claude-opus-5-5
**Requested execution:** automatic
**Requested at:** 2026-10-13T15:15:23Z
**Workflow:** regular
**Check required:** no
**Reviewer adapter:** claude
**Reviewer model:** claude-opus-5-5
**Reviewer context:** fresh subagent
**Actual execution:** automatic
**Reviewed at:** 2026-10-13T15:17:08Z
**Scope:** current
**Lenses:** quality, security, performance, tests
**Verdict:** passed
**Check result:** not-required

### Handoff

Review the active spec and the complete `705e768f8cd058c54b087496ed7f1f81aeabc992..44fa74de7363d8b9548a7eb0be2bac5f3c2049d4` delta in a fresh
session or isolated subagent without the builder conversation. Run all Audit lenses from scratch.
Run Check when required above. Do not edit product code, accept findings, or
reuse the existing findings as the review scope.

### Commands

- `git rev-parse HEAD` / `git merge-base origin/main HEAD` / `shasum -a 256 blueprint/context/current-feature.md`: pass (target, base and spec hash match the request; only review.md differed from target)
- `npm run verify` (tsc --noEmit, then next build): pass (17 static pages; only a pre-existing CSS @import ordering warning)
- `npm run lint`: pass (no ESLint warnings or errors)
- `grep -rn resendEmailVeriLink src`: pass (no matches)

### Evidence

- Feature 16 commit 44fa74d: src/app/auth/layout.tsx exempts only paths starting with `/auth/verification/email` from the signed-in redirect (both the effect and the spinner gate); next.config has no `trailingSlash`, and a prefix match covers both forms. Login, forgot-password and reset-password still redirect signed-in users.
- The exemption exposes only the public verify page; `PUT /platform/auth/user/verifyemail` is unauthenticated in ../nera_pmt_gw/src/v1/routes/platform/authRouter.js, so no protected data or route becomes reachable that was not already reachable signed out. withAuth and the protected layout are unchanged by feature 16.
- Failed.tsx makes no API call; it links to /auth/login or /user/manage?tab=email (the manage page reads `?tab=` and has an `email` tab). AuthService.updateEmail sets emailVerified=false and emails a new link, matching the guidance copy.
- page.tsx onSuccess invalidates `["current-user"]`; the page-level onSuccess/onError override the QueryClient default mutation toasts, so no duplicate toast.
- Earlier v1 commits in 705e768..44fa74d (route restructure, antd 6, single QueryClient, 2FA login, inactivity logout, Verify CI): API route strings unchanged apart from formatting; 2FA response fields (`multiFAEnabled`, `loginToken`) match v1 AuthService; CI workflow grants `contents: read` only. Previously recorded F-14 to F-17 still describe the remaining issues there.

### Findings

- F-06 [P2] closed (resolved by this feature)
- No new findings. Existing open findings F-08 to F-17 are P3 and non-blocking.

### Remaining risk

- No unit test runner is configured, so there are no automated tests for the auth layout exemption or the verification states.
- Runtime states (signed-out failed screen, signed-in failed screen, signed-in successful verification updating `V: true`) were not exercised by this reviewer; Check was not required and no dev server was started.
- The spec-mandated failed-screen copy says "sign in" even when the user is already signed in and sees "Open Email settings"; cosmetic only.
- After a signed-in successful verification, "Continue to Sign In" bounces through /auth/login to the dashboard (explicitly out of scope in the spec).

## Try it now

Run `npm run local`, then:

1. **Signed out, bad link:** open `/auth/verification/email?token=bad`. You see "Verification Failed" with the sign-in instructions and a "Go to Sign In" button that opens `/auth/login`.
2. **Signed in, bad link:** sign in, then open the same URL. The page stays (no jump to the dashboard) and the button reads "Open Email settings", opening the Email tab.
3. **Signed in, real link:** on the Email tab submit your current address as the New Email with your password, open the emailed link in the same browser. You see "Email Verified!" and the Email tab shows `V: true`.
4. **Other auth pages:** while signed in, open `/auth/login`. You are still sent to the dashboard.
