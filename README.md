# tools.oalfawzan.sa

A focused collection of browser-first utilities deployed as a static GitHub Pages site. The primary interface is Arabic (RTL), with English support where available.

**Live site:** https://tools.oalfawzan.sa

## Tools

1. **Job Offer Comparator** (`/offer/`): compare compensation, benefits, annual value, and offer trade-offs.
2. **Time Toolkit** (`/time/`): time-zone, date-duration, and Hijri/Gregorian utilities.
3. **Wheel of Names** (`/wheel-of-names/`): random selection from a list of names.
4. **QR Generator** (`/qr-generator/`): create downloadable QR codes from text, URLs, and vCards.
5. **Saudi Stock Analysis** (`/stock-analysis-dashboard/`): technical indicators, favorites, market data, and a simplified analysis summary.

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
- Tool-specific CSS remains responsible for each tool's functional layout and specialized components.
- `assets/js/platform.js` loads the shared visual layer on tool pages so new and existing tools keep the same visual identity without duplicating theme CSS.
- The background artwork is shared from `https://oalfawzan.sa/image-1600.webp` to keep both sites visually synchronized.

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
3. Load `/assets/js/platform.js` on the page so the shared visual system is applied.
4. Add the tool card to the root `index.html`.
5. Verify internal links, accessibility, mobile behavior, theme switching, and JavaScript syntax before merging.

## Quality goals

- Responsive from small phones through desktop.
- Keyboard-visible focus and browser zoom support.
- Clear labels and status feedback for interactive controls.
- Consistent liquid-glass design across the homepage and all tools.
- No secrets or credentials in client-side code.
- Third-party dependencies kept explicit and limited.
- No orphaned pages or unused tool-specific assets.

## License

See repository licensing information before reuse or redistribution.
