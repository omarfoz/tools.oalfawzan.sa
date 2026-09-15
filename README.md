# tools.oalfawzan.sa

A focused collection of browser-first utilities deployed as a static GitHub Pages site. The primary interface is Arabic (RTL), with English support where available.

**Live site:** https://tools.oalfawzan.sa

## Tools

1. **Job Offer Comparator** (`/offer/`): compare compensation, benefits, annual value, and offer trade-offs.
2. **Time Toolkit** (`/time/`): time-zone, date-duration, and Hijri/Gregorian utilities.
3. **Wheel of Names** (`/wheel-of-names/`): random selection from a list of names.
4. **QR Generator** (`/qr-generator/`): create downloadable QR codes from text, URLs, and vCards.
5. **Saudi Stock Analysis** (`/stock-analysis-dashboard/`): technical indicators, favorites, market data, and a simplified analysis summary.
6. **SVG Studio** (`/svg-studio/`): view, edit, optimize, and AI-generate SVG graphics entirely in the browser.

## Architecture

- Static HTML, CSS, and JavaScript. No application server or build step is required.
- Shared platform assets live under `assets/css` and `assets/js`.
- Tool-specific assets live under `assets/*/pages`.
- User preferences may be stored in `localStorage`.
- Most processing happens in the browser. Features that request market or third-party data depend on those external services and their availability.

## Visual system

The tools site intentionally shares the visual language of `oalfawzan.sa`.

- Every page loads two shared CSS layers in `<head>`: `assets/css/platform.css` (reset, shared tokens, focus, a11y) then `assets/css/oalfawzan-theme.css` (the single design authority: liquid-glass material, blue accent, header/footer/hero chrome, shared components).
- Page-specific CSS loads first and owns only the tool's functional layout; it must not redefine the palette, accent, radii, or chrome.
- The theme mirrors the portfolio's system font stack, blue accent, liquid-glass material, rounded navigation, spacing, light/dark theme behavior, and mobile blur optimization.
- `assets/js/theme-init.js` restores the saved theme and language before first paint on every page.
- `assets/js/platform.js` provides shared theme/language helpers (`window.ToolsPlatform`), notifications, clipboard utilities, and loads `mobile-enhancements.css` for touch refinements.
- The shared theme also contains the validated cross-tool refinements for homepage card balance, Stock Analysis hierarchy, nested glass surfaces, QR preview emphasis, and Wheel visual saturation.
- The background artwork is shared from `https://oalfawzan.sa/image-1600.webp` so both sites retain the same visual backdrop.

When adding a new tool, preserve this separation: tool CSS controls structure and behavior; the shared layers control brand appearance.

## Repository structure

```text
/
├── index.html
├── offer/
├── time/
├── wheel-of-names/
├── qr-generator/
├── stock-analysis-dashboard/
├── svg-studio/
├── assets/
│   ├── css/
│   │   ├── platform.css
│   │   ├── oalfawzan-theme.css
│   │   └── mobile-enhancements.css
│   └── js/
│       ├── platform.js
│       └── theme-init.js
└── 404.html
```

## Development and deployment

GitHub Pages serves the `main` branch from the repository root using the custom domain configured in `CNAME`.

For a new tool:

1. Create `/<tool-name>/index.html`.
2. Add page-specific assets under `assets/css/pages` or `assets/js/pages` when needed.
3. In `<head>`, load the tool-specific CSS, then `/assets/css/platform.css`, then `/assets/css/oalfawzan-theme.css`, and include `/assets/js/theme-init.js` before the stylesheets.
4. Use the same header, footer, hero, and back-link markup as the other tool pages.
5. Load `/assets/js/platform.js` for shared theme, language, notification, clipboard, and accessibility helpers.
6. Add the tool card to the root `index.html`.
7. Verify internal links, accessibility, mobile behavior, theme switching, first-paint styling, and JavaScript syntax before merging.

## Quality goals

- Responsive from small phones through desktop.
- Keyboard-visible focus and browser zoom support.
- Clear labels and status feedback for interactive controls.
- Consistent liquid-glass design across the homepage and all tools.
- Shared navigation and hero hierarchy across tools.
- No secrets or credentials in client-side code.
- Third-party dependencies kept explicit and limited.
- No orphaned pages or unused tool-specific assets.

## License

See repository licensing information before reuse or redistribution.