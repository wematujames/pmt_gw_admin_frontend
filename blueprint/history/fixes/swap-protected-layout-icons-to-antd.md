# Fix: Swap protected layout icons to antd

**Type:** Fix
**Status:** verified
**Branch:** fix/swap-protected-layout-icons-to-antd (branched from `v1`, the maintained v1 line)

## The problem

In dev mode (`npm run local`), every protected page shows "Verifying access..."
for about a second before content appears, and longer on a route's first compile.
Measured on 2026-10-13 by reloading `/dashboard/financial` while signed in:

- The protected layout's dev script is 9.8 MB over the wire and 39 MB unpacked.
  It finished downloading at 1.04 s; content showed at about 1.3 s.
- 32.6 MB of that script is `react-icons`. The layout path imports four icons,
  and in dev each one pulls in its whole icon set:
  - `src/app/(protected)/sideMenuItems.tsx`: `ImMeter` (`react-icons/im`),
    `MdOutlineAppRegistration` (`react-icons/md`), `GiPlatform` (`react-icons/gi`,
    6.9 MB of source)
  - `src/app/(protected)/user/components/Avatar.tsx`: `CgProfile` (`react-icons/cg`)
- `GET /platform/auth/user` took 29 ms, so the backend is not the cause.
- Production is not affected: the built protected layout script is 11 KB,
  because unused icons are removed there.

## The fix

Replace those four icons with `@ant-design/icons`, which the same files already
import. Its icons ship as separate per-icon modules, so the dev bundle includes
only the icons actually used.

| Where | Current | Replacement |
|---|---|---|
| Sidebar "Dashboards" group | `ImMeter` | `DashboardOutlined` |
| Sidebar "Operations" group | `MdOutlineAppRegistration` | `AppstoreAddOutlined` |
| Sidebar "Platform" group | `GiPlatform` | `ClusterOutlined` |
| Avatar menu "View Profile" | `CgProfile` | `UserOutlined` |

Must not break:
- Menu labels, links, group keys, ordering, and the selected-item highlight.
- The avatar dropdown items and logout.
- Other pages' `react-icons` imports. The package stays installed; replacing
  the other ~36 imports is out of scope.

Out of scope: other icons, the dashboard chart chunks (`@ant-design/plots`, which
load after the spinner), the backend `revokedtokens` index, and any `next.config`
change.

## Build steps

- [x] 1. **Swap the four icons.** Edit the imports and JSX in `sideMenuItems.tsx`
  and `Avatar.tsx` as in the table, and remove the now-unused `react-icons` imports
  from both files.
  **Done when:** neither file imports from `react-icons`, typecheck and lint pass,
  the dev `(protected)/layout.js` chunk no longer contains `react-icons/gi`, `/im`,
  `/md` or `/cg` modules and is far smaller than 39 MB, and the sidebar and avatar
  menu show the new icons with unchanged labels and links.

## Verify

1. `npm run verify` and `npm run lint` pass. Don't run Verify while `npm run local`
   is up, because both write to `.next`. Stop the dev server first, or restart it after.
2. With `npm run local`, sign in, reload `/dashboard/financial`, and in the Network
   tab compare the `app/(protected)/layout.js` size and the time until
   "Verifying access..." clears against the numbers above.
3. Check that the sidebar shows the Dashboards, Transactions, Direct Debit,
   Operations and Platform groups with icons, the links still navigate, and the
   avatar menu shows View Profile with a user icon.


<!-- blueprint:completion {"schemaVersion":2,"specBytes":3234,"specSha256":"eef92a8669fc71b6cd17bc8557afa038474f2ed5ea47b6c71e0fb60433090a59","branch":"refs/heads/fix/swap-protected-layout-icons-to-antd","head":"4a414711aad67cca9bfee3f98d1d1e3378ea3b35","baseRef":"refs/heads/v1","baseCommit":"4a414711aad67cca9bfee3f98d1d1e3378ea3b35","sourceTree":"1c34cfeba1590f32d05e4bf82fafa8bdb20e14bd","landing":"local-merge","absentOptional":[]} -->

## Try it now

Run `npm run local`, sign in, then reload http://localhost:3000/dashboard/financial with DevTools Network open.

Expected: `app/(protected)/layout.js` is about 1.5 MB, "Verifying access..." clears in about half a second, and the sidebar groups show the new dashboard, app-store and cluster icons.

This proves: the protected layout no longer loads whole react-icons sets in dev, so the auth spinner clears sooner.
