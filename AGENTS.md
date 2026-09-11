# AGENTS.md

Repository guidance for AI coding agents working on `tools.oalfawzan.sa`.

## Repository overview

- Type: static HTML, CSS, and JavaScript tools website
- Deployment: GitHub Pages
- Production domain: https://tools.oalfawzan.sa
- Default branch: `main`
- Primary language: Arabic (RTL), with English support where available
- Framework: none, vanilla browser technologies only

## Current tools

```text
/
├── index.html
├── offer/
│   └── index.html
├── time/
│   └── index.html
├── wheel-of-names/
│   └── index.html
├── qr-generator/
│   └── index.html
├── stock-analysis-dashboard/
│   └── index.html
├── assets/
└── 404.html
```

### Job Offer Comparator (`/offer/`)
Compares compensation, benefits, annual value, and other offer trade-offs.

### Time Toolkit (`/time/`)
Provides time-zone conversion, date-duration calculations, and Hijri/Gregorian utilities.

### Wheel of Names (`/wheel-of-names/`)
Provides random selection from a list of names with a visual spinning wheel.

### QR Generator (`/qr-generator/`)
Generates QR codes from text or URLs and supports downloading the result.

### Saudi Stock Analysis (`/stock-analysis-dashboard/`)
Provides Saudi-market analysis features, indicators, favorites, and market-data views.

## Architecture

- Keep the site static and framework-free unless a change explicitly requires otherwise.
- Shared platform assets belong under `assets/css` and `assets/js`.
- Page-specific assets belong under `assets/css/pages` and `assets/js/pages`.
- Keep tool URLs stable unless the task explicitly removes or renames a tool.
- Prefer progressive enhancement and browser-native APIs.
- Treat external market or analysis services as optional dependencies and handle failures clearly.

## Development rules

- Use 2-space indentation.
- Preserve Arabic RTL behavior and English support.
- Use semantic HTML and accessible labels.
- Keep browser zoom enabled.
- Keep keyboard focus visible.
- Use `type="button"` for non-submit buttons.
- Use `noopener noreferrer` for external links opened in a new tab.
- Do not place secrets, tokens, passwords, or private keys in client-side files.
- Avoid adding unused assets, duplicate utilities, or orphaned pages.

## Adding a new tool

1. Create `/<tool-name>/index.html`.
2. Add page-specific CSS or JavaScript only when needed.
3. Add the tool to the root `index.html` directory.
4. Update `README.md` and this file.
5. Test internal links, mobile layout, RTL/LTR behavior, keyboard access, and JavaScript syntax.

## Deployment

GitHub Pages serves the repository root from `main` using the custom domain in `CNAME`. There is no build step for production.

Before merging, run the available repository audit and JavaScript syntax checks where applicable.
