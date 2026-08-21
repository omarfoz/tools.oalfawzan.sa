# Platform Modernization Notes

## Scope

This branch modernizes the complete `tools.oalfawzan.sa` static platform while preserving tool URLs and the existing business logic of the complex calculators and dashboards.

## Architectural decisions

### Shared platform foundation

**Problem:** Every tool carried its own visual foundation, focus behavior, responsive rules, theme helpers, and large inline style/script blocks.

**Decision:** Introduce `assets/css/platform.css` and `assets/js/platform.js`, and externalize page-specific CSS/JavaScript under `assets/*/pages/`.

**Reason:** The site is intentionally framework-free and static. Shared browser assets provide maintainability without introducing a build system or frontend framework.

**Impact:** Existing tool logic remains classic browser JavaScript, but common accessibility, feedback, responsive behavior, and utilities are centralized.

### Homepage directory

**Problem:** The homepage was a simple card grid with limited discovery and a large marketing-style hero.

**Decision:** Replace it with a compact tool directory with search, categories, bilingual labels, theme support, clear tool descriptions, and direct launch actions.

**Impact:** All seven tools remain at their existing URLs and are easier to discover.

### Complex tools

**Problem:** Offer Comparator, Loan Comparator, Time Toolkit, and Stock Analysis contain substantial working business logic.

**Decision:** Preserve their logic and markup structure, then improve them incrementally through the shared foundation, accessibility metadata, responsive safeguards, and code externalization rather than rewriting them.

**Impact:** Lower regression risk and backward-compatible paths/output behavior.

## Functional fixes

- JSON Formatter clears stale output when parsing fails or input is empty.
- JSON Formatter handles clipboard failures and supports Ctrl/Cmd+Enter formatting.
- QR Generator always renders the current input before download, preventing stale-image downloads.
- QR Generator reports third-party QR library loading failure and uses dated download names.
- All tool buttons without an explicit type are normalized to `type="button"` to prevent accidental form submission if tools are later wrapped in forms.

## Accessibility and responsive changes

- Removed `maximum-scale=1` / `user-scalable=no` and touch/gesture zoom blocking.
- Added visible keyboard focus treatment and a skip-to-content link.
- Added accessible names to previously unlabeled controls identified by the repository audit.
- Added polite live regions for common result/status containers.
- Added minimum interactive target sizing and reduced-motion support.
- Added responsive overflow handling for tables and constrained media/canvas elements.
- Added a purpose-built 404 page.

## Security and resilience

- Added `noopener noreferrer` protection to external `_blank` links.
- Kept user input out of the shared feedback renderer by using `textContent`.
- Documented that stock/analysis features depend on external data/proxy services instead of claiming the entire platform is offline/local-only.
- No credentials, passwords, tokens, or private keys were found in the repository inventory.

## Validation

The branch includes two GitHub Actions workflows and `scripts/repo_audit.py` to check:

- complete repository/page inventory;
- duplicate IDs;
- missing accessible control names;
- disabled browser zoom;
- risky DOM APIs and inline event usage;
- inline and externalized JavaScript syntax with Node;
- internal absolute links and referenced local assets;
- presence of the 404 page.

The baseline audit confirmed all existing inline JavaScript parsed successfully and all internal tool links resolved before the modernization was applied.
