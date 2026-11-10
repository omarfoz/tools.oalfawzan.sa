# tools.oalfawzan.sa

A focused collection of browser-first utilities deployed as a static GitHub Pages site. The primary interface is Arabic (RTL), with English support where available.

**Live site:** https://tools.oalfawzan.sa

## Tools

1. **Job Offer Comparator** (`/offer/`): compare take-home pay, guaranteed and expected annual cash, benefits value, first-year switching costs, and career trade-offs.
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
- `assets/js/platform.js` provides shared theme/language helpers (`window.ToolsPlatform`), notifications, clipboard utilities, with mobile presentation handled by the shared theme.
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
│   │   └── oalfawzan-theme.css
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
## Offer comparison assumptions

- Recurring and guaranteed cash, variable bonuses, reimbursements, and noncash benefits are classified separately. Expected bonuses use the entered payout percentage; benefit valuations use the entered usage percentage. Benefits do not increase take-home pay.
- Existing saved offers retain their amounts and enabled fields. Inferred classifications are flagged for review; variable bonuses start at 50% expected payout unless already specified.
- GOSI coverage and calculation dates are editable per offer, with an optional employee-rate override. The new-system schedule follows [official GOSI guidance](https://awareness.gosi.gov.sa/businessJourney.html). Confirm coverage and the contributory wage against the employee's payroll record.
- First-year cash includes sign-on payments and deducts entered relocation costs, lost bonuses, repayments, and unpaid gaps. Departure settlements are displayed separately and are not calculated as legal entitlements. Recovery time is a simple estimate using the recurring expected-cash difference; it excludes tax, financing, and timing effects.
- Time and commute inputs (optional daily hours and round-trip commute minutes per offer) produce a time profile over 22 working days per month: total invested hours, net hourly rate, the annual value of unpaid commute hours, and true hourly value (net monthly cash ÷ invested hours). These figures adjust the view of net pay and never replace the cash comparison.
- Share links encode the full comparison state in the URL (`?share=`), so a link reproduces the same inputs on any device without a server. The tool also auto-saves to `localStorage` and shows a restore banner for saved or shared sessions.
- The financial-closeness threshold uses the larger absolute expected annual cash amount as its denominator. Career-factor scores are normalized by their total relative weight and displayed separately. Leave differences require matching day-count bases and both entered values.
- End of service follows Labor Law articles 84 and 85: half a month per year for the first five years and a full month per year after, on the last wage (actual total wage by default, or base + housing, or base only). On resignation the award is nothing under 2 years, one third for 2 to 5, two thirds for 5 to 10, and full from 10. The tool compares staying for N more years with switching now (resigning from the current job today), with no annual raises assumed.
- Provided (company) housing adds no cash. For GOSI and end of service it is valued at two months of base pay per year; the entered market rent is added to the full annual value.
- The non-Saudi profile has no employee GOSI deduction and subtracts the SAR 400 monthly dependent levy per dependent the employee pays.
- A warning appears when base pay is under 60% of the monthly package, because base pay drives GOSI and end of service.
- Weighted criteria (section 03) follow the job-comparison criteria sheet: 16 criteria with editable default weights (total 95), each rated 0-10 for both jobs. Score = sum of weight × rating over the highest possible sum, counting only criteria rated for both jobs; the advantage is the score difference over the average of both scores. Unlike the sheet, each weight is applied once on a common 0-10 scale instead of also capping each rating at its weight.
- Excel export uses the same model as the screen and includes field, payroll, bonus, benefit, and transition assumptions.

Run offer-model regression checks with `node scripts/offer-calculation.test.cjs`, JavaScript syntax checks with `node --check` on the three `assets/js/pages/offer*.js` files, and the repository audit with `python scripts/repo_audit.py`.
