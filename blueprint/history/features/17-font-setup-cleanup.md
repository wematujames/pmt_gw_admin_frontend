# Feature: Font setup cleanup

**From build-plan:** feature 17
**Build attempt:** 1
**Branch:** feature/font-setup-cleanup
**Status:** verified

## Goal

The app renders in the system font while loading fonts it never shows: a cursive face on `<body>` that antd overrides, and a runtime Google Fonts `@import` of Montserrat that nothing uses (F-08). Make the whole app render in **Inter** and remove the unused font setup.

Decision (2026-10-13, user): use Inter, not Montserrat. Inter is built for UI text and stays clear in dense tables at 12-14px. Montserrat was dropped because it's wide and hard to read at small sizes.

## In scope

- Load Inter once with `next/font/google`, which self-hosts it at build time with no runtime request to Google, and expose it as a CSS variable.
- Apply Inter to antd through the `fontFamily` theme token so antd components (Layout, Card, Table, forms, messages) use it.
- Apply Inter to `<body>` so text outside antd components uses it too.
- Remove the Cedarville Cursive font, the unused `roboto_mono` export, and the misleading `montserrat` export name.
- Remove the Montserrat Google Fonts `@import` and the commented-out CSS block in `globals.css`.

## Out of scope

- Tabular (fixed-width) figures in tables, font sizes, weights, colours, or any other theme change.
- Other cleanup from F-09 to F-13 (feature 18).
- The antd `App` wrapper (feature 19).

## Build loop

`workflow.stepReview` is `feature` and `checkpointCommits` is `disabled`: build all steps, run Verify once at the end, then present one review packet. `/complete` makes the single work commit.

## Build steps

- [x] 1. **Load Inter only.** In `src/fonts/fonts.ts`, keep a single export: `inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })`. Delete `roboto_mono` and the Cedarville `montserrat`. In `src/app/layout.tsx`, import `inter` and set `<body className={`${inter.variable} ${inter.className}`}>`.
  Done when `npx tsc --noEmit` passes and no source file references `montserrat`, `Cedarville` or `roboto_mono`.
- [x] 2. **Pass Inter to antd.** In `src/themes/default.ts`, add `fontFamily` to `token`: `var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. The fallback is antd's default system stack, so text stays readable if the variable is missing.
  Done when `npx tsc --noEmit` passes and the theme token is a string that starts with `var(--font-inter)`.
- [x] 3. **Remove dead font CSS.** Reduce `src/app/globals.css` to `@import "tailwindcss";`. This deletes the Montserrat `@import url(...)` and the commented block.
  Done when `globals.css` contains only the Tailwind import and `npm run verify` passes.

## Files / areas

- `src/fonts/fonts.ts`
- `src/app/layout.tsx`
- `src/themes/default.ts`
- `src/app/globals.css`

## Data / contracts

None. There are no API, route, or persisted-data changes. `next/font` emits the font files into the static export at build time, so the `output: "export"` build needs no server.

## Testing

- No unit test runner is configured, and no logic changes.
- Verify: `npm run verify` (typecheck, then `next build`).
- Visual: build output can't prove the rendered font. The try guide covers checking the computed `font-family` in DevTools on an antd element (e.g. a table cell) and on body text.

## Notes for the AI

- `next/font/google` must be called at module scope in `fonts.ts`. The root `layout.tsx` is a server component, so importing it there is supported.
- The antd token uses the CSS variable rather than importing `next/font` into the client `providers.tsx`/theme module. This keeps the font loader in the server layout only.
- Tailwind preflight sets `html` to its sans stack. The body class overrides it for non-antd text, which is intended.
- Leave every other theme token untouched.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":3852,"specSha256":"0260008d976cec91303f3ef2540df37b4446ec85d76f1d8be0faad753728f8c0","branch":"refs/heads/feature/font-setup-cleanup","head":"f1f62c2a0fe191d529c65faf3eea4d6511bc0ed2","baseRef":"refs/heads/v1","baseCommit":"f1f62c2a0fe191d529c65faf3eea4d6511bc0ed2","sourceTree":"9ed6869653ecca3da356ad321a2f188ffd8a26d3","landing":"local-merge","absentOptional":[]} -->

## Findings

_No findings resolved in this feature. F-08 (P3) is marked `fixed` and stays in the ledger for an `/audit` re-review._

## Independent review

_Not selected. `qualityGates.regular.independentReview` is `when-sensitive` and a font change is not sensitive._

## Try it now

With `npm run local` running (restart it if pages error):

1. Open http://localhost:3000, sign in, and go to **Transactions**. Table text, the header greeting, and buttons render in Inter.
2. **antd text:** right-click a table cell → Inspect → **Computed** → `font-family`. It starts with `__Inter_…`, the resolved `var(--font-inter)`.
3. **Body text:** inspect `<body>`. Its classes include `__variable_…` and `__className_…`, and its computed `font-family` starts with `__Inter_…`.
4. **No Google request:** DevTools → Network, reload, filter by `font`. The Inter `.woff2` files load from `/_next/static/media/`, with nothing from `fonts.googleapis.com`.
