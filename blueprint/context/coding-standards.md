# Coding Standards

> Conventions as practiced in this codebase (surveyed by `/adopt`, 2026-10-13).
> Edit freely; these describe what the code does, not an ideal.

## Contract with the backend

- This is the **v1** frontend, locked to the frozen v1 backend. Never add, rename,
  or reshape API routes or payloads. Admin endpoints live under `/platform/...`.
- Before finishing any change that touches `src/actions/`, verify URLs against
  `../nera_pmt_gw/src/v1/routes/platform/` (branch `v1.0.0`).
- Do not port route changes from the v2 admin frontend.

## TypeScript

- Strict mode is on. Existing code uses `any` for API records and filters; new
  code should prefer small interfaces in `src/types/types.d.ts` where the shape
  is known, without a big-bang retyping of existing modules.
- Path alias `@/*` maps to `src/*`. Prefer it over deep relative imports.

## Next.js and rendering

- App Router with `output: "export"`: the app is a static site. No server
  components that fetch data, no Server Actions, no API routes, no middleware.
- Pages and components are client components (`"use client"`).
- Route groups: `(protected)` for pages behind `withAuth` and the admin shell,
  `(must-auth)` for authenticated pages outside the shell, `auth/` for public auth pages.
- Auth is client-side: `withAuth` (src/components/routing/withAuth.tsx) uses
  `useUser` and redirects to `/auth/login` or `/change-default-password`.

## File Organization

- API calls: `src/actions/[feature].ts`, one async function per endpoint, all
  using the shared axios client `src/actions/utils/nerasikaAxios.ts`.
- A module's page and its parts live together in its route folder, e.g.
  `src/app/(protected)/merchants/page.tsx` beside `CreateMerchant.tsx`,
  `FilterMerchants.tsx`, `MerchantDetails.tsx`, `ReloadMerchants.tsx`.
- Shared UI: `src/components/` (e.g. `layout/ModuleHeader.tsx`).
- Hooks: `src/hooks/`; React contexts: `src/context/`; helpers: `src/utils/`;
  shared types: `src/types/types.d.ts`; antd theme: `src/themes/default.ts`.
- New menu entries go in `src/app/(protected)/sideMenuItems.tsx` (key = route path).

## Naming

- Components and their files: PascalCase (`MerchantDetails.tsx`).
- Route folders: kebab-case (`direct-debit`, `change-default-password`).
- Action files: lowercase feature name (`directdebitmandate.ts`); functions camelCase
  (`getPlatformMerchants`, `updateMerchantStatus`).
- Hooks: `useXxx`.

## Data Fetching

- TanStack Query for all server state. List pages keep `queryParams` in state
  (`_page`, `_limit`, plus filters) and pass them into the query key.
- List actions return `{ data, meta }` from `res.data`; single-item actions return
  `res.data.data`.
- Strip empty filter values with `filterFalslyValues` before sending params.
- Refresh buttons invalidate the module's query key.
- The protected layout's `QueryClient` shows a success message on every mutation
  and an error message from `err.response?.data.message`; don't duplicate that
  per component unless the message needs to differ.

## UI and Styling

- Ant Design 6 is the component library; use its components before building custom ones.
- Theme colors and tokens come from `src/themes/default.ts` and `theme.useToken()`.
  Don't hardcode new brand colors.
- Tailwind 4 utilities for layout and spacing around antd components. Inline
  `style` with theme tokens is acceptable and common.
- Module pages follow the existing pattern: `ModuleHeader`, then a white rounded
  card with a "Total Records" header, filter + refresh controls, and a small
  `Table` with server-side pagination.
- Dates: format with dayjs (`YYYY-MM-DD HH:mm:ss`) as list pages do.

## Error Handling

- Let axios errors propagate to TanStack Query; the global handlers surface them
  via the message context.
- Use `useMessage` / `useNotification` for user feedback, not `alert`.

## Testing

**Current state: no test runner is configured and there are no tests.** Logic is
verified with the running app, browser evidence, `npm run lint`, and the build.

The blueprint installs no test runner; testing is opt-in at the project level,
because the overlay can't know your stack. Adding unit testing is an explicit
setup task the AI can do through the normal workflow, either as a build-plan item
or with `/tests`. The setup should choose the stack-native runner, wire the
scripts or commands, add a small example test, and update the Commands section
of `AGENTS.md`.

When `AGENTS.md` declares a `Verify` command, treat it as the umbrella automated
gate. It combines only the checks this project actually has, in this order when
available: typecheck, tests, then build. The command does not enable an absent
test runner or replace focused evidence. It gives local work and optional CI one
exact command to run. `/ci` owns Verify and CI setup. `/tests` adds the real test
command to Verify when it already exists, but never creates CI only because
testing was configured.

**The opt-in switch is one signal: a `test` command in the Commands section of
`AGENTS.md`.** Declare one and **tests become a gate for logic-bearing steps**,
not an optional extra; leave it out and the loop verifies logic with the evidence
it already uses (run it, a screenshot, the build). Adding the runner is itself a
deliberate step, never a silent mid-step install. This is the single definition
of the switch; the skills and `ai-interaction.md` only point back here.

- **What to test (the scope rule):** pure logic where a wrong answer is possible -
  parsers, formatters, validators, id/slug builders, server actions. These have
  assertable inputs and outputs and real edge cases (empty, missing, malformed).
- **What not to test:** UI components and integration-level surfaces (render or
  export routes, anything driving a real browser or external service). Verify those
  with a screenshot and the build, not brittle unit tests.
- **The gate (when a runner is configured):** a build step that adds in-scope logic
  must ship a passing test in the same reviewable diff. The project's test command
  must be green before the step is approved, before any checkpoint commit, and
  before `/complete` merges. UI and integration-only steps are exempt and ride on
  screenshot plus build evidence.
- **When it's named:** the `/feature` spec's Testing section predicts the coverage,
  `/implement` writes the test with the step, and if a step surfaces logic the spec
  didn't foresee, add a focused test then.
- An empty suite should fail, not pass, so "no tests ran" never looks like "passed".
- Test files live next to source files (for example `feature.test.ts`).
- Run them via the project's test command (see Commands in `AGENTS.md`), not a
  hardcoded tool name.

Stack binding: if testing is added, use Vitest, `vi.mock()` for the axios client
(`src/actions/utils/nerasikaAxios.ts`), and `vi.useFakeTimers()` for
time-dependent logic such as `useInactivityTimeout`. Good first targets are
pure helpers in `src/utils/` (e.g. `filterFalslyValues`).

## Browser Verification

For UI and integration behavior, prefer real browser evidence over reading the
code and assuming it works.

- Browser automation is separately opt-in through `/tests browser`. That setup
  reuses a compatible runner or prefers Playwright for supported projects, then
  documents the exact command as `Browser tests` in `AGENTS.md`.
- When `Browser tests` is declared, add focused coverage for stable behavioral
  done-whens when it is proportionate, and run the documented command during
  `/check`. Do not assume it proves visual fidelity, real authenticated-profile
  behavior, browser chrome, or another claim the test does not observe.
- If no Browser tests command is declared, do not add a runner silently in the
  middle of an unrelated feature. Use the available dev server, browser
  screenshots, build output, API output, or manual evidence instead.
- Browser tests are not part of the default Verify command or CI unless the user
  separately chooses that slower gate.
- Browser evidence is especially important for flows that click, type, submit,
  navigate, download files, render complex layouts, or depend on client-side
  state.

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible

## Comments

Write code that explains itself; comment only what the code cannot say.
Over-commenting is a common AI tell, so resist it.

- Comment the **why**, not the **what**. Delete any comment that restates the code.
- No banner/header blocks, section dividers, or step-by-step narration of obvious
  code. A file does not need a comment announcing each region.
- A comment earns its place only when it captures something the code can't: a
  non-obvious decision, a gotcha or workaround, why a value is what it is, or a
  link to a spec or issue.
- Prefer self-documenting names and small functions over explanatory comments.
- Keep doc comments minimal: a one-line purpose on an exported type or function is
  plenty; don't write JSDoc that just repeats the signature.
- When in doubt, leave the comment out.

## Writing

- No em dashes (U+2014) in generated content: docs, comments, commit messages,
  READMEs, specs. They read as AI-generated.
- Use a hyphen for `term - description` separators; rephrase prose with commas,
  parentheses, or a colon. Avoid en dashes and the ellipsis character too.
