# Design validation — 2026-09-11

Reviewed local commit `18f05a8` against https://oalfawzan.sa/.

Initial verdict: the background, blue accent, centered layout, and glass surfaces capture the portfolio's visual direction, but the implementation needed corrections. The findings below describe the original review; remediation is recorded next.

## Remediation

Implemented the six reported corrections: reduced specificity of legacy button defaults in both runtime bundles; restored shared branding precedence; excluded hidden cards from special last-card layouts; initialized the empty state with `hidden`; restored homepage base layout rules; and corrected CI to check `.audit-js` and external scripts, failing if no scripts are found. The shared font also takes precedence over the legacy language-specific body rule.

Browser verification: all five tools hide the old OF badge and use rounded shared headers; Time primary buttons render white text in light and dark themes; homepage body margin is zero; initial empty feedback is hidden; unmatched searches hide every card on desktop and at 390px; the mobile Developer filter shows only QR Generator; mobile Time branding remains visible. No calculation logic was changed. The local Python/Node execution limitation below still applies; CI configuration was inspected but not executed here.

## Confirmed findings

1. **P1 — Primary button text is difficult to read in light mode.** On `/time/`, an enabled `.btn.primary` renders text `#667085` on `#0062cc`, approximately 1.17:1 contrast. The broad `.tool-page button:not(.toggle):not(.type-btn):not(.del-btn)` rule in `assets/css/tool-runtime.css:80` has greater specificity than the shared theme's primary-button text rule. The same muted button treatment is visible on QR Generator. Resolve the competing rules so primary controls have readable foreground colors in both themes.

2. **P2 — Search and categories cannot hide the Stock Analysis card.** Enter `zzzznomatch` on the homepage. All five cards receive `hidden`, but the last card remains visible. `assets/css/oalfawzan-theme.css:617` sets an important grid display on the last odd card; the mobile rule at line 788 sets an important flex display. Both beat the general `[hidden]` rule. Reproduced at desktop and 390px width. Exclude hidden cards from these layout selectors or give the hidden rule sufficient precedence.

3. **P2 — Legacy tool headers override the intended shared branding.** The tool pages retain a square OF badge, different brand typography, and square controls, unlike the homepage and portfolio. At mobile width, the tool brand text disappears. `assets/css/tool-runtime.css:54`–58 and its mobile rules have higher specificity than the shared theme. Loading the theme last does not resolve this. Consolidate or remove competing legacy presentation rules.

4. **P2 — Empty-search feedback is visible on first load.** The homepage shows all five tools and “No tools match your search” together. `index.html:112` has no initial hidden state, the stylesheet that formerly hid `.empty-tools` is not loaded, and `assets/js/pages/home.js` does not call `applyFilter()` during initialization. Initialize the empty state explicitly and preserve its live-status behavior.

5. **P3 — Homepage base layout styles are missing.** `index.html` loads platform CSS and the theme but not its former page stylesheet. The body retains an 8px browser margin, producing an unintended outer border around the background. The search input also does not fill its allocated desktop wrapper. Restore the necessary base layout rules without reintroducing the old animated design.

6. **P2 — The PR syntax-check job can pass without checking JavaScript.** `.github/workflows/modernization-audit.yml` loops over `audit-js/*.js`, whereas `scripts/repo_audit.py` writes to `.audit-js/`. With `nullglob`, the wrong directory silently yields no files. The PR job also does not syntax-check the external scripts under `assets/js`. Fix both paths/coverage before relying on CI as validation evidence.

## Validation performed

- Inspected the live portfolio and rendered local homepage plus all five tool pages on desktop.
- Inspected homepage light/dark appearances and tool-page light-mode styling.
- Checked 390px homepage and Stock Analysis layout dimensions; checked mobile Time header and primary-button styles.
- Reproduced the search failure in desktop and mobile layouts.
- Confirmed homepage language switching changes `lang` and RTL/LTR direction. Tool descriptions remain Arabic in English mode; translation completeness was not audited.
- Checked all seven HTML pages for missing root-relative `href`/`src` targets and zoom-disabling declarations: no issues found in those checks.

## Limits

Python and Node were not available in this execution environment, and no bundled workspace runtime was configured. The repository Python audit and Node syntax checks were therefore not run. The static link/zoom check above is narrower than the repository audit. Tool calculations, downloads, market-data requests, full keyboard navigation, and every responsive breakpoint were not exhaustively tested. Findings above are based on rendered browser evidence and source inspection, not a claim of complete functional certification.

Recommended order: fix CSS precedence and hidden states, restore homepage base rules, repair CI coverage, then repeat both-theme and RTL/LTR browser validation.
