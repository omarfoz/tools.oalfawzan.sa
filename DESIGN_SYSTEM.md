# tools.oalfawzan.sa Design System

This repository uses one shared design system for every page and tool. `assets/css/design-system.css` is the final runtime layer and is loaded by `assets/js/platform.js` after page-specific CSS, so shared foundations and component behavior remain consistent across the site.

## Foundations

### Semantic colors
Do not use raw colors for normal UI surfaces, text, borders, actions, or statuses. Use semantic tokens:

- `--color-bg-primary`
- `--color-bg-surface`
- `--color-bg-subtle`
- `--color-border-default`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-muted`
- `--color-brand-primary`
- `--color-status-success`
- `--color-status-warning`
- `--color-status-error`

Light and dark themes redefine the same semantic tokens. Tool-specific CSS may define chart/data colors when the color itself carries domain meaning, but should not redefine the platform palette.

### Typography
Use the shared type scale: 11, 13, 15, 18, 22, 28, 36, and 48px via `--text-*` tokens. Headings use tighter line height; body copy uses approximately 1.6; UI labels use compact line height.

### Spacing
Use the 4px spacing scale only: 4, 8, 12, 16, 24, 32, 48, 64px via `--space-*`. Avoid arbitrary spacing values in new components.

### Motion
Motion must be purposeful and fast. Use 100ms for micro interactions, 200ms for normal controls, and no more than 300ms for interactive UI. Respect `prefers-reduced-motion`.

### Icons
Use one consistent line-icon style: 24×24 default box, approximately 2px stroke, rounded caps/joins, `currentColor`. Interactive icon controls must maintain at least a 44×44px target.

## Components

Every reusable component must account for default, hover, active, disabled, focus, and validation/error states where relevant.

Button hierarchy:
1. Primary — main page action.
2. Secondary — normal supporting action.
3. Ghost — low-emphasis/navigation utility.
4. Destructive — delete/reset actions with destructive consequence.

Inputs, selects, textareas, cards, badges, back navigation, tables, headers, theme controls, and language controls inherit the shared runtime layer.

## Responsive behavior

Desktop layouts may use multi-column grids. At tablet/mobile breakpoints, tool layouts collapse predictably to one column. Touch controls remain at least 44px. Avoid horizontal page scrolling; tables should use their shared scroll wrapper.

## Themes and language

Theme preference is globally stored as `tools-theme`. Language preference is globally stored as `tools-language`. `platform.js` maintains compatibility with older storage keys. A user changing theme or language on one page should see the same preference on every other page.

## Page-specific CSS rule

Page CSS owns only what is specific to that tool: layout, data visualization, domain-specific visualization, and special interactive structures. It should not invent a separate header, palette, button system, type scale, spacing scale, theme engine, or language/theme control style.

## Review checklist

Before merging a UI change, verify dark/light, English/Arabic where supported, desktop/mobile, keyboard focus, disabled/error states, 44px touch targets, semantic colors, 4px spacing rhythm, and reduced motion.
