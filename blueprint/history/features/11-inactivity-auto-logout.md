# Feature: Inactivity auto-logout

**From build-plan:** feature 11
**Build attempt:** 1
**Branch:** feature/inactivity-auto-logout
**Status:** verified

## Goal

Log a signed-in user out after a period with no activity, using the existing
`useInactivityTimeout` hook and the existing `useLogout` flow. Activity in any
open tab of the app keeps every tab signed in, so an idle background tab never
logs out a user who is working in another tab.

## In scope

- Enable `useInactivityTimeout` in the protected layout. Remove the `//todo`
  comment and the commented-out call.
- Timeout: 15 minutes (decided at spec review). Set as the hook's default.
- Activity events: keep `mousemove`, `keydown`, and `click`. Add `wheel` and
  `touchstart` so scrolling a long table and tapping on a phone count as activity.
- Shared activity across tabs. The hook records the last activity time in
  `localStorage`, throttled to at most one write every 5 seconds. When the
  timer fires, it reads that time. If another tab was active within the timeout,
  it re-arms the timer for the remaining time instead of logging out.
- When the timeout fires, show an info toast: "You were logged out due to
  inactivity." Then call the existing `logout()`, which clears the token and
  cache and sends the user to `/auth/login`.
- If `localStorage` throws (private mode, blocked storage), fall back to this
  tab's own timer. Never throw from an event handler.

## Out of scope

- Server-side session expiry or token lifetime. v1 backend routes are frozen.
- A "you're about to be logged out" warning or countdown modal.
- A configurable timeout (env var or settings screen).
- Broadcasting logout to other tabs. Today the other tabs drop to login on
  their next authenticated request or `withAuth` check, and this feature doesn't
  change that.
- The generic "Success" toast that the global mutation default shows on every
  logout, manual or automatic. Item 19 (antd `App.useApp()`) covers toast cleanup.
- Auth pages. The hook runs only under the protected layout.

## Build loop

`workflow.stepReview` is `feature` and `checkpointCommits` is `disabled`. Build
both steps, run Verify once at the end, and present one review packet.
`/complete` makes the work commit. This touches session and auth behavior, so
the `when-sensitive` independent review applies before `/complete`.

## Build steps

- [x] 1. **Shared-activity timer in `useInactivityTimeout`.**
  - Keep the signature `useInactivityTimeout(onTimeout, timeoutDuration)`, changing
    the default from 3 to 15 minutes (`15 * 60 * 1000`).
  - Add the `wheel` and `touchstart` listeners, with `{ passive: true }` on both.
  - On activity, reset the local timer. Write `Date.now()` to the
    `localStorage` key `lastActivityAt`, but only if at least 5 s have passed
    since this tab last wrote it.
  - On fire, read `lastActivityAt`. If `Date.now() - last < timeoutDuration`,
    re-arm for the remaining time. Otherwise call `onTimeout` once.
  - Wrap every storage access in try/catch. If storage fails, treat the value
    as absent.
  - On mount, write the current time so a new tab or login starts a fresh window.
  - Clean up the timer and every listener on unmount.
  - Replace `useRef(null) as any` with a properly typed ref.
  - **Done when:** `npx tsc --noEmit` passes and the diff shows the fire-time
    check, the throttle, the try/catch guards, and symmetric add/remove of all
    five listeners.
- [x] 2. **Wire it into the protected layout.**
  - In `src/app/(protected)/layout.tsx`, import the hook and `useMessage`.
  - Build a `useCallback` handler that calls
    `openMessage("info", "You were logged out due to inactivity.")` and then `logout()`.
  - Pass the handler to `useInactivityTimeout`. Delete the todo comment.
  - Check that `MessageContextType["openMessage"]` accepts `"info"`. If it
    doesn't, use `"warning"` and record that here.
  - **Done when:** `npm run verify` passes. With `npm run local`, signing in and
    leaving the app idle for 15 minutes shows the info toast on `/auth/login`.
    With two tabs open, moving the mouse in tab A keeps tab B signed in past
    15 minutes.

## Files / areas

- `src/hooks/useInactivityTimeout.ts`: timer, listeners, shared `lastActivityAt`.
- `src/app/(protected)/layout.tsx`: enable the hook and the inactivity toast.
- Read only: `src/hooks/useLogout.ts` (unchanged) and `src/context/MessageContext.tsx`.

## Data / contracts

- New browser storage key `lastActivityAt`. Its value is the epoch milliseconds
  as a decimal string. It is local, per-origin UI state only. It holds no token
  or user data and is never sent to the server. A missing or non-numeric value
  is treated as "no recent activity elsewhere".
- No API, route, or persisted server data changes.
- `logout` is TanStack v5 `mutation.mutate`, which is stable across renders. The
  handler is wrapped in `useCallback`, so the hook's effect doesn't re-subscribe
  on every render.

## Testing

- No unit test runner is configured, so there are no new unit tests.
- Verify (`npm run verify`): the baseline passed during spec writing with a
  typecheck and a full static `next build`.
- Runtime behavior (the idle logout, the toast, and the two-tab case) needs a
  signed-in session. It is covered by the manual try path in step 2. Build
  output doesn't prove it.

## Notes for the AI

- Don't change `useLogout.ts`, the global mutation defaults, or any API route.
- The toast must be shown before `logout()` runs. `MessageProvider` sits above
  the protected layout, so the toast survives the redirect to login.
- Don't start a dev server. Ask the user for the runtime check.

## Decisions

1. **Timeout length:** 15 minutes, chosen by the user at spec review.
2. **Shared activity across tabs:** kept as specified. The user approved the
   spec and started `/implement` without changing it.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":5878,"specSha256":"d25015b208b2744d61fc9ec218a8d2ae4c992703c299b99829ecc9ca1625aa94","branch":"refs/heads/feature/inactivity-auto-logout","head":"a3a839d1fe87f488e68555979c10df95872b78d0","baseRef":"refs/heads/v1","baseCommit":"a9a7274594e03f58708438e81a930618e1b9c62f","sourceTree":"9a893933d614f96db8d1d8761917f3df123b549a","landing":"local-merge","absentOptional":[]} -->

## Findings

_No findings resolved in this feature. F-16 and F-17 (P3) remain open in the ledger._

## Independent review

**Status:** passed
**Target commit:** a3a839d1fe87f488e68555979c10df95872b78d0
**Base commit:** 705e768f8cd058c54b087496ed7f1f81aeabc992
**Base ref:** origin/main
**Spec hash:** d25015b208b2744d61fc9ec218a8d2ae4c992703c299b99829ecc9ca1625aa94
**Prepared by:** claude
**Builder model:** claude-opus-5-5
**Requested reviewer:** claude
**Requested model:** claude-opus-5-5
**Requested execution:** automatic
**Requested at:** 2026-10-13T15:00:34Z
**Workflow:** regular
**Check required:** no
**Reviewer adapter:** claude
**Reviewer model:** claude-opus-5-5
**Reviewer context:** fresh subagent
**Actual execution:** automatic
**Reviewed at:** 2026-10-13T15:02:50Z
**Scope:** current
**Lenses:** quality, security, performance, tests
**Verdict:** passed
**Check result:** not-required

### Handoff

Review the active spec and the complete `705e768f8cd058c54b087496ed7f1f81aeabc992..a3a839d1fe87f488e68555979c10df95872b78d0` delta in a fresh
session or isolated subagent without the builder conversation. Run all Audit lenses from scratch.
Run Check when required above. Do not edit product code, accept findings, or
reuse the existing findings as the review scope.

### Commands

- `git rev-parse HEAD` / `git merge-base origin/main HEAD`: pass (match target and base commit)
- `shasum -a 256 blueprint/context/current-feature.md`: pass (matches Spec hash)
- `git status --porcelain --untracked-files=all`: pass (only blueprint/context/review.md differs)
- `npm run verify`: pass (tsc --noEmit clean; next build generated 17 static pages)
- `npm run lint`: pass (no ESLint warnings or errors)

### Evidence

- Spec is tracked and not ignored; no Spec snapshot required. All build steps checked, status verified.
- Feature 11 diff (`git show a3a839d`): `src/hooks/useInactivityTimeout.ts` has the fire-time `lastActivityAt` check with re-arm for the remaining time, a 5 s write throttle, try/catch around every storage access, a mount-time write, five listeners added with `{ passive: true }` and removed symmetrically, and a typed timer ref; default is 15 minutes.
- `src/app/(protected)/layout.tsx` wraps `openMessage("info", ...)` then `logout()` in `useCallback`; `openMessage` is a stable `useCallback([])` and `logout` is TanStack v5 `mutate`, so the effect does not re-subscribe per render. MessageProvider sits above QueryProvider and the protected layout in `src/app/providers.tsx`, so the toast survives the redirect.
- Storage access happens only in effects and event handlers, so the static export build is unaffected. `lastActivityAt` holds only an epoch timestamp; no token or user data.
- No API route changes in the delta; `useLogout.ts` and global mutation defaults unchanged by feature 11.
- Earlier v1 commits in `705e768..a3a839d` (route restructure, antd 6, 2FA login fix, single query cache) were scanned for auth and token handling (LoginForm, AuthenticatorVerification, withAuth, providers, axios interceptor); no new P0/P1 found beyond the existing ledger.

### Findings

- F-16 [P3] open - later-firing idle tab sends logout with no token and shows an error toast
- F-17 [P3] open - future `lastActivityAt` stretches or defeats the timeout
- Existing F-06, F-08 to F-15 untouched (not re-examined as fixed; no status changes)
- No P0 or P1 finding is open or fixed

### Remaining risk

- No unit test runner is configured; the hook's timing logic has no automated tests.
- Runtime behavior (15-minute idle logout, info toast on `/auth/login`, two-tab keep-alive) was not exercised; no dev server or signed-in browser session in this review, and build output does not prove it.
- Browser throttling of hidden-tab timers can make background tabs log out up to about a minute late; not observed.
- No browser test harness or security/dependency scanner is declared.

## Try it now

Run `npm run local`, sign in with a v1 account, then:

1. **Idle logout:** leave the app untouched (no mouse, keys, scroll, or taps) for 15 minutes. You land on `/auth/login` with the info toast "You were logged out due to inactivity."
2. **Activity keeps you in:** sign in again and keep moving the mouse or scrolling a table occasionally. No logout after 15 minutes.
3. **Two tabs:** open the dashboard in two tabs, work only in tab A. After 15 minutes tab B is still signed in, and so is tab A.
4. **Storage key:** DevTools → Application → Local Storage shows `lastActivityAt` holding an epoch-millisecond timestamp, updated at most every 5 seconds while you are active.
