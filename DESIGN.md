# 01 Overview

**Creative North Star: Quiet Utility.** tools.oalfawzan.sa should feel like a precise workbench: fast to scan, calm under load, and visually secondary to the task itself. The interface is Arabic-first with full RTL support and must remain equally clear in English. Favor direct labels, visible hierarchy, compact navigation, and functional feedback over decorative storytelling.

# 02 Colors

Use the existing semantic tokens from `assets/css/design-system.css`; do not introduce page-specific brand palettes.

- Background: `--color-bg-primary`
- Surface: `--color-bg-surface`
- Subtle surface: `--color-bg-subtle`
- Default border: `--color-border-default`
- Strong border: `--color-border-strong`
- Primary text: `--color-text-primary`
- Secondary text: `--color-text-secondary`
- Muted text: `--color-text-muted`
- Brand/action: `--color-brand-primary`
- Status colors: success, warning, error, and info semantic tokens

Use one accent for actions and selection. Avoid gradients, decorative glows, or extra palette families unless color carries domain meaning in a chart or data visualization.

# 03 Typography

Primary family: **IBM Plex Sans Arabic** for Arabic and **IBM Plex Sans** for English/UI Latin text.

Use the shared type scale and weights from `design-system.css`. Headings should be strong but not theatrical. Body text should stay readable at approximately 1.6–1.75 line-height. Labels and metadata should be compact and explicit. Do not add novelty serif/display fonts.

# 04 Elevation

Flat by default. Group content with spacing, borders, and subtle surface contrast before using elevation. Standard cards and panels have no shadow. Shadows are reserved for truly floating UI such as temporary toasts, dialogs, menus, or overlays. Nested cards should be visually quieter than their parent and should not create repeated box-within-box chrome.

# 05 Components

- **Header:** compact, stable, and consistent across every tool. Brand at one side; language/theme and essential navigation at the other.
- **Hero:** one clear page purpose, one supporting sentence, no ornamental animation required to understand the page.
- **Buttons:** primary, secondary, ghost, destructive. One obvious primary action per local task area.
- **Inputs:** 44px minimum touch target, explicit labels, semantic error/focus states, no decorative inner shadows.
- **Cards/Panels:** use only when grouping is meaningful. Prefer sections and whitespace over additional containers.
- **Tool directory cards:** concise category, icon, title, description, and one clear launch affordance.
- **Tables/Data:** prioritize alignment, sticky headers when useful, restrained row hover, and horizontal scroll wrappers on narrow screens.
- **Motion:** 100–200ms for controls and state changes. No blanket reveal-on-scroll, parallax, or pointer-follow effects. Respect `prefers-reduced-motion`.

# 06 Do's and Don'ts

**Do** preserve RTL behavior, accessibility, semantic color tokens, keyboard focus, 44px touch targets, and the existing client-side privacy model. Keep copy specific. Make important actions visually distinct. Use spacing to create hierarchy. Test both themes and mobile widths.

**Don't** add gradients for decoration, glowing blobs, oversized sticky hero scenes, unrelated font families, excessive pills, cards inside cards, universal scroll reveals, pointer-follow highlights, or multiple competing accents. Do not redesign tool logic while polishing presentation. Do not make every element equally prominent.
