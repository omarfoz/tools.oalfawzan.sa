# tools.oalfawzan.sa Design System

This repository uses one shared design system for every page and tool. Two CSS layers are loaded on every page, in this order:

1. `assets/css/platform.css` - base layer: reset, shared tokens (`--ds-*`), focus styles, skip link, toasts.
2. `assets/css/oalfawzan-theme.css` - the single design authority: the liquid-glass look (photo backdrop, glass panels, `#007aff` accent, radii 28/24/18px), site chrome (header, footer, back link, hero), and shared components (buttons, inputs, cards, tabs).

Page-specific CSS loads before these two layers and owns only tool-specific layout. `assets/css/mobile-enhancements.css` is appended by `platform.js` for touch-target and mobile rhythm refinements.

## Foundations

### Semantic colors
Do not use raw colors for normal UI surfaces, text, borders, actions, or statuses. Use the `--site-*` tokens (`--site-accent`, `--site-text`, `--site-text-muted`, `--site-glass-fill`, `--site-glass-border`) or their `--ds-*` aliases. Light and dark themes redefine the same tokens. Tool-specific CSS may define chart/data colors when the color itself carries domain meaning (for example the offer tool's A/B comparison colors `--current`/`--new`), but should not redefine the platform palette or accent.

### Typography
UI font stack comes from the shared theme. Headlines: `clamp(2.20rem,5vw,2.85rem)` on tool pages, larger on the home hero. Body copy around 1.6-1.65 line height. Hero tags and section labels use the shared `.72rem` uppercase wide-tracked style.

### Shape
One radius system, defined by the theme: header/nav 28px (`--site-radius-nav`), cards 24px (`--site-radius-card`), controls 18px (`--site-radius-control`). Do not introduce new radii in page CSS.

### Icons
One consistent line-icon style: 24×24 default box, approximately 1.8-2px stroke, rounded caps/joins, `currentColor`. Interactive icon controls must maintain at least a 44×44px target on touch screens.

## Components

Every reusable component must account for default, hover, active, disabled, focus, and validation/error states where relevant.

Button hierarchy:
1. Primary - main page action, accent blue.
2. Secondary - normal supporting action, glass surface.
3. Ghost - low-emphasis/navigation utility.
4. Destructive - delete/reset actions with destructive consequence.

Inputs, selects, textareas, cards, badges, back navigation, tables, headers, theme controls, and language controls inherit the shared theme. Headers, footers, heroes, and back links use identical markup on every page.

## Responsive behavior

Desktop layouts may use multi-column grids. At tablet/mobile breakpoints, tool layouts collapse predictably to one column. Touch controls remain at least 44px. Avoid horizontal page scrolling; tables should use their shared scroll wrapper.

## Themes and language

Theme preference is globally stored as `tools-theme`. Language preference is globally stored as `tools-language`. `assets/js/theme-init.js` restores both before first paint on every page (with legacy `tools_theme`/`tools_lang`/`offer_lang` fallbacks). `platform.js` maintains compatibility with older storage keys. A user changing theme or language on one page sees the same preference on every other page.

## Page-specific CSS rule

Page CSS owns only what is specific to that tool: layout, data visualization, domain-specific visualization, and special interactive structures. It should not invent a separate header, palette, button system, type scale, spacing scale, theme engine, or language/theme control style.

## Review checklist

Before merging a UI change, verify dark/light, English/Arabic where supported, desktop/mobile, keyboard focus, disabled/error states, 44px touch targets, one accent color, the shared radius system, and reduced motion.
