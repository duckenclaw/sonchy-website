# sonchy-website

Marketing and storefront site for Сончи Уточкина — courses, lectures and
consulting. React + TypeScript + Vite, no backend: every page is static and
purchases hand off to lava.top.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run lint
npm run format   # Prettier over the whole repo (format:check in CI)
npm test         # Vitest; test:watch for the watch mode
```

## Layout

The site is a handful of one-off illustrated pages rather than a grid of
reusable widgets, so the code is organised **by page**. Everything a page
needs — its markup, its copy, its stylesheet — sits in one folder.

```
src/
  main.tsx                  mounts the router
  app/
    app.tsx                 route table
    routes.ts               ROUTES constants + routeTo()
  components/               shared across two or more pages
    header/                 title plaque, desktop navbar, mobile drawer
    page-layout/            <AppShell> and <PageLayout> — the .app / .page shell
    page-nav/               mobile "назад / на главную" controls
    info-panel/             speech-bubble card (Lectures + Projects)
    mouse-stickers/         cursor-trail stars on the landing page
  hooks/                    use-body-class, use-is-mobile, use-is-touch-device
  pages/
    home/  services/  consulting/  lectures/  projects/
    education/  about/  courses/  not-found/
  styles/
    index.css               imports the four global sheets, in order
    base.css                design tokens + resets
    utilities.css           .primary-text / .secondary-text
    layout.css              .app, .page, .page-inner
    page-backgrounds.css    body.<page>-background artwork
```

Each page folder holds `<name>-page.tsx`, its `*.css`, and a `*-data.ts` with
the copy. The Courses page is large enough to have its own `sections/` folder.

### Styling

- **Global** sheets live in `src/styles` and load first, via `main.tsx`.
- **Everything else** is a stylesheet next to the component that imports it.
  If you are changing how the header looks, the file is
  `src/components/header/header.css` — there is no shared "components.css".
- Brand colours, fonts and timings are tokens in `base.css`. Use
  `var(--color-secondary)` rather than `#392962`. The Courses page deliberately
  keeps its own autumn palette in `courses.css`.
- Breakpoints in use: `768px` (mobile), `1024px` (tablet / burger menu),
  `480px` for a few small-phone tweaks.

### Page shell

`<PageLayout name="services" title="УСЛУГИ" …>` renders the scroll container,
the header and a centred content column, and adds a `.page-services` hook so
the page can tune the shell from its own stylesheet. Pages that need something
different — Home, Courses — use `<AppShell>` or render the shell themselves.

## Assets

`public/` mirrors `src/pages/`: art used by exactly one page lives in that
page's folder, everything else is shared.

```
public/
  backgrounds/   full-page background artwork (body backgrounds)
  ui/            chrome reused across pages — buttons, plaques, arrows, star
  home/ services/ consulting/ lectures/ projects/ education/ about/ courses/
  fonts/         self-hosted woff2 + fonts.css
```

Reference assets with an absolute path from the site root, e.g.
`/about/writer0.webp`. When you add art, put it in the page folder first and
promote it to `ui/` only once a second page needs it.

Photography and illustration ship as **WebP**, not PNG — the originals were
88% larger for no visible gain. Convert new art before committing it:

```bash
cwebp -q 85 -m 6 -alpha_q 100 source.png -o source.webp
```

Line art and flat shapes stay as SVG.

`docs/` holds the design briefs and reference screenshots the pages were built
from.

## Tests

`src/app/app.test.tsx` asserts every route in `ROUTES` renders, including the
two placeholder fallbacks. Interaction-heavy pieces are covered next to the
code they test — `use-rocket-launch.test.tsx` for the purchase-button guard,
`lecture-modal.test.tsx` for dialog focus management.
