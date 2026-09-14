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

- `assets/css/oalfawzan-theme.css` is the final shared visual layer.
- It mirrors the portfolio's system font stack, blue accent, liquid-glass material, rounded navigation, spacing, light/dark theme behavior, and mobile blur optimization.
- Every current tool loads the shared theme directly in `<head>` after its runtime CSS. This prevents a late visual restyle on slower devices.
- `assets/js/platform.js` keeps a fallback theme loader for future or legacy pages that do not yet include the stylesheet directly.
- Tool-specific CSS remains responsible for each tool's functional layout and specialized components.
- The shared theme also contains the validated cross-tool refinements for homepage card balance, Stock Analysis hierarchy, nested glass surfaces, QR preview emphasis, and Wheel visual saturation.
- The background artwork is shared from `https://oalfawzan.sa/image-1600.webp` so both sites retain the same visual backdrop.

When adding a new tool, preserve this separation: tool CSS controls structure and behavior; the shared visual layer controls brand appearance.

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
│   │   └── oalfawzan-theme.css
│   └── js/
│       └── platform.js
└── 404.html
```

## Development and deployment

GitHub Pages serves the `main` branch from the repository root using the custom domain configured in `CNAME`.

For a new tool:

1. Create `/<tool-name>/index.html`.
2. Add page-specific assets under `assets/css/pages` or `assets/js/pages` when needed.
3. Load the tool-specific CSS, runtime CSS, then `/assets/css/oalfawzan-theme.css` in that order.
4. Load `/assets/js/platform.js` for shared theme, language, notification, clipboard, and accessibility helpers.
5. Add the tool card to the root `index.html`.
6. Verify internal links, accessibility, mobile behavior, theme switching, first-paint styling, and JavaScript syntax before merging.

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