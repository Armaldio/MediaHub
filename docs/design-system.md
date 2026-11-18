# MediaHub design system

The service picker defines the app's visual language: charcoal surfaces, a soft
lavender accent, compact headings, clear selection states, and quiet borders.
All four routes and the connection dialogs use this system.

## Tokens

`src/style.css` is the source of truth. Its `@theme static` block exports CSS
variables and matching Tailwind utilities (`bg-surface`, `text-muted`, etc.).

| Role | Tokens | Use |
| --- | --- | --- |
| Surfaces | `canvas`, `surface`, `raised`, `hover` | Page, panel, inset control, hover |
| Borders | `line`, `line-soft` | Controls and subtle panel divisions |
| Type | `ink`, `muted`, `subtle` | Main text, supporting text, metadata |
| Accent | `accent`, `accent-hover`, `accent-soft`, `accent-line`, `on-accent` | Primary actions and selection |
| Status | `success`, `warning`, `danger`, with `-soft` backgrounds | Semantic status; always include text |
| Overlays | `scrim`, `overlay`, `--shadow-dialog` | Artwork labels and modal backdrops |
| Shape | `--radius-control`, `--radius-panel` | 8px controls and 12px panels |
| Layout | `--content-width`, `--space-page` | 1080px content; 28px gutters, 20px on phones |
| Motion | `--duration-ui` | 150ms control feedback; reduced motion is respected globally |

Use the system font stack, 14px body text, 13px controls, and 12px supporting
labels. Titles scale from 28–34px, with a 40px ceiling for media detail titles.
Use the existing 4px spacing scale for layout. Preserve individual service
artwork and media posters; brand colors are not interface action colors.

## Shared patterns

- `AppHeader`: the logo, page gutter, 68px header, optional back control, and
  action slot. Pass `back` and handle its `back` event when needed.
- `AppDialog`: a native modal with a labelled heading, automatic focus
  containment, Escape dismissal, and focus return. Mount it conditionally with
  `v-if`, pass `labelled-by`, and handle `close` to clear the open state.
- `.ui-container`, `.ui-page`, `.ui-page-intro`: page structure and safe areas.
- `.ui-title`, `.ui-description`, `.ui-section-title`: heading hierarchy.
- `.ui-panel`, `.ui-panel-padding`, `.ui-empty`: panels and empty states.
- `.ui-button`: secondary action. Add `--primary`, `--ghost`, or `--danger`
  modifiers (for example `.ui-button--primary`); `.ui-icon-button` is the square
  size. Use native buttons and provide an accessible name for icon-only actions.
- `.ui-input`, `.ui-search`: fields, including shared focus and invalid states.
- `.ui-tabs` with `.ui-chip[aria-pressed]`: wrapping filters and selections.
- `.ui-badge` with `--accent`, `--success`, `--warning`, or `--danger` modifiers:
  compact labels and status.
- `MediaCard`: a keyboard-accessible poster card with visible rating and metadata.

Layout-specific rules stay beside each view. Reuse these patterns before adding
another control style. Do not add raw neutral or action colors in a view: add a
semantic token only when an existing role cannot express the intent.

## Verification

Run lint, type checking, the production build, and the picker regression. The
cross-app browser regression covers search, detail navigation, responsive
layouts, and connection dialog keyboard/CRUD behavior:

```sh
BASE_URL=http://localhost:5173 node scripts/test-app-design.mjs
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if Chromium is installed outside Playwright's
default location. The script uses mocked catalog responses and an isolated
browser context. Set `SCREENSHOT_DIR` to export desktop and phone captures.
The TV metadata regression requires nonempty `VITE_TMDB_KEY`,
`VITE_TVDB_API_KEY`, and `VITE_TRAKT_CLIENT_ID` in the Vite server environment.
Dummy values are sufficient because its external responses are mocked.
For that regression, `BROWSER_TEST_TIMEOUT_MS` can raise its
default 15-second wait on a busy development host. Native purchase sheets remain
supplied by RevenueCat and need device testing.
