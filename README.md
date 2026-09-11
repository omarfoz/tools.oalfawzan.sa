# tools.oalfawzan.sa

A focused collection of browser-first utilities deployed as a static GitHub Pages site. The primary interface is Arabic (RTL), with English support where available.

**Live site:** https://tools.oalfawzan.sa

## Tools

1. **Job Offer Comparator** (`/offer/`): compare compensation, benefits, annual value, and offer trade-offs.
2. **Time Toolkit** (`/time/`): time-zone, date-duration, and Hijri/Gregorian utilities.
3. **Wheel of Names** (`/wheel-of-names/`): random selection from a list of names.
4. **QR Generator** (`/qr-generator/`): create downloadable QR codes from text or URLs.
5. **Saudi Stock Analysis** (`/stock-analysis-dashboard/`): technical indicators, favorites, market data, and a simplified analysis summary.

## Architecture

- Static HTML, CSS, and JavaScript. No application server or build step is required.
- Shared platform assets live under `assets/css` and `assets/js`.
- Tool-specific assets live under `assets/*/pages`.
- User preferences may be stored in `localStorage`.
- Most processing happens in the browser. Features that request market or third-party data depend on those external services and their availability.

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
└── 404.html
```

## Development and deployment

GitHub Pages serves the `main` branch from the repository root using the custom domain configured in `CNAME`.

For a new tool:

1. Create `/<tool-name>/index.html`.
2. Add page-specific assets under `assets/css/pages` or `assets/js/pages` when needed.
3. Add the tool card to the root `index.html`.
4. Verify internal links, accessibility, mobile behavior, and JavaScript syntax before merging.

## Quality goals

- Responsive from small phones through desktop.
- Keyboard-visible focus and browser zoom support.
- Clear labels and status feedback for interactive controls.
- No secrets or credentials in client-side code.
- Third-party dependencies kept explicit and limited.
- No orphaned pages or unused tool-specific assets.

## License

See repository licensing information before reuse or redistribution.
