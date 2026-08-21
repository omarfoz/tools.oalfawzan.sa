# tools.oalfawzan.sa

A focused collection of browser-first utilities deployed as a static GitHub Pages site. The primary interface is Arabic (RTL) with English support where available.

**Live site:** https://tools.oalfawzan.sa

## Tools

1. **Job Offer Comparator** (`/offer/`) — compare compensation, benefits, annual value, and offer trade-offs.
2. **Loan Comparator** (`/loan-calculator/`) — compare housing-finance scenarios, DTI, cost, and amortization.
3. **Time Toolkit** (`/time/`) — time-zone, date-duration, and Hijri/Gregorian utilities.
4. **Wheel of Names** (`/wheel-of-names/`) — random selection from a list of names.
5. **JSON Formatter** (`/json-formatter/`) — validate, format, minify, and copy JSON.
6. **QR Generator** (`/qr-generator/`) — create downloadable QR codes from text or URLs.
7. **Saudi Stock Analysis** (`/stock-analysis-dashboard/`) — technical indicators, favorites, market data, and a simplified analysis summary.

## Architecture

- Static HTML/CSS/JavaScript; no application server is required for GitHub Pages.
- Shared platform foundation lives under `assets/css` and `assets/js`.
- Tool-specific CSS/JavaScript lives under `assets/*/pages` to keep individual pages maintainable.
- User preferences may be stored in `localStorage`.
- Most processing is local in the browser. Some tools intentionally request third-party data/services (for example stock-market data and optional analysis services), so those features depend on external availability and privacy policies.

## Development and deployment

GitHub Pages serves the `main` branch from the repository root using the custom domain in `CNAME`. There is no build step. Changes should pass the Modernization Audit workflow before merging.

## Quality goals

- Responsive from small phones through desktop.
- Keyboard-visible focus and browser zoom support.
- Clear labels and status feedback for interactive controls.
- No secrets or credentials in client-side code.
- Third-party dependencies kept explicit and limited.

## Data files

`loan/Loan.csv` and `loan/Loan.xlsx` are source/reference analysis files for the loan calculator. They are not runtime dependencies of the page.

## License

See repository licensing information before reuse or redistribution.
