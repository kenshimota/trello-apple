---
name: apple-design
description: Apply Apple's Human Interface Guidelines (HIG) and the iOS/macOS look to frontend work. Use when building or reviewing UI that should feel native and Apple-like — San Francisco typography, dynamic system colors, continuous rounded corners, frosted-glass materials, translucent navigation bars, grouped inset lists, soft layered depth, spring motion, full light/dark support. Use for components, pages, forms, dashboards, or any Next.js/React/Tailwind UI in this repo.
---

# Apple Design System

Codifies Apple's Human Interface Guidelines (HIG) so UI in this repo renders
native, calm, and layered — the iOS 17 / macOS Sonoma feel.

## Before writing UI in this repo

This is a Next.js 16 app with breaking changes. Read the relevant guide in
`node_modules/next/dist/docs/` (App Router, RSC, data fetching, forms) before
writing code. Styling is Tailwind v4 (`@tailwindcss/turbopack`).

## Three pillars of the HIG

1. **Clarity.** Legible type at every size, precise icons, restrained ornament.
   Content leads; chrome recedes.
2. **Deference.** The interface defers to content. Flat surfaces, translucency
   over decoration, whitespace over lines.
3. **Depth.** Layered planes convey hierarchy. Cards float above grouped
   backgrounds with soft shadows and blur, never with heavy borders.

## Non-negotiables

- **Both appearances, always.** Light and dark are peers. Resolve every color
  through a semantic token so it adapts. Default to `prefers-color-scheme`.
- **System type.** San Francisco via the system stack. Do not ship a custom
  display face for UI. Let the OS pick SF Pro.
- **Continuous corners.** Use the generous, smoothed radii below — not the
  2–6px "technical" corners of other systems.
- **Materials, not lines.** Separate surfaces with translucency + shadow;
  hairlines are a fallback, not the default.
- **44pt touch targets.** Visible controls can be smaller, but the hit area
  must reach 44×44pt.
- **Motion is physical.** Spring-like, interruptible, direct-manipulation.
  Never bounce for its own sake; never animate the thing the user touches
  constantly.

## Typography — San Francisco

System stack (falls back gracefully off Apple hardware):

```css
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
  "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

Type ramp (size / line-height, px). Prefer the named styles over raw sizes:

| Style        | Size | Leading | Weight   | Use                          |
| ------------ | ---- | ------- | -------- | ---------------------------- |
| large-title  | 34   | 41      | 700      | top-level screen title       |
| title-1      | 28   | 34      | 700      | page / section title         |
| title-2      | 22   | 28      | 700      | card group title             |
| title-3      | 20   | 25      | 600      | subsection                   |
| headline     | 17   | 22      | 600      | list row primary text        |
| body         | 17   | 22      | 400      | default reading text         |
| callout      | 16   | 21      | 400      | secondary body               |
| subheadline  | 15   | 20      | 400      | supporting text              |
| footnote     | 13   | 18      | 400      | metadata, captions           |
| caption-1    | 12   | 16      | 400      | dense labels                 |
| caption-2    | 11   | 13      | 400      | smallest labels              |

- Use **weight** for hierarchy (semibold/bold titles), not color shifts alone.
- Body text is 17px — larger than web defaults. Respect it.
- Use `-0.02em` tracking on large titles; body stays near `0`.
- Numbers that change use `font-variant-numeric: tabular-nums`.

## Color — dynamic system colors

Semantic, appearance-aware tokens. Never hardcode light or dark values in
components; resolve through these.

**Labels / content**

| Token              | Light                      | Dark                        |
| ------------------ | -------------------------- | --------------------------- |
| `label`            | `#000000`                  | `#FFFFFF`                   |
| `secondary-label`  | `rgba(60,60,67,0.60)`      | `rgba(235,235,245,0.60)`    |
| `tertiary-label`   | `rgba(60,60,67,0.30)`      | `rgba(235,235,245,0.30)`    |
| `quaternary-label` | `rgba(60,60,67,0.18)`      | `rgba(235,235,245,0.16)`    |

**Backgrounds / fills**

| Token                       | Light                   | Dark                    |
| --------------------------- | ----------------------- | ----------------------- |
| `system-background`         | `#FFFFFF`               | `#000000`               |
| `secondary-system-bg`       | `#F2F2F7`               | `#1C1C1E`               |
| `tertiary-system-bg`        | `#FFFFFF`               | `#2C2C2E`               |
| `system-grouped-bg`         | `#F2F2F7`               | `#000000`               |
| `secondary-grouped-bg`      | `#FFFFFF`               | `#1C1C1E`               |
| `system-fill`               | `rgba(120,120,128,0.20)`| `rgba(120,120,128,0.36)`|
| `secondary-system-fill`     | `rgba(120,120,128,0.16)`| `rgba(120,120,128,0.32)`|
| `separator`                 | `rgba(60,60,67,0.29)`   | `rgba(84,84,88,0.65)`   |
| `opaque-separator`          | `#C6C6C8`               | `#38383A`               |

**System accents** (light / dark). Blue is the default tint:

| Color   | Light     | Dark      |
| ------- | --------- | --------- |
| blue    | `#007AFF` | `#0A84FF` |
| green   | `#34C759` | `#30D158` |
| red     | `#FF3B30` | `#FF453A` |
| orange  | `#FF9500` | `#FF9F0A` |
| yellow  | `#FFCC00` | `#FFD60A` |
| indigo  | `#5856D6` | `#5E5CE6` |
| purple  | `#AF52DE` | `#BF5AF2` |
| pink    | `#FF2D55` | `#FF375F` |
| teal    | `#30B0C7` | `#40C8E0` |

- **Tint is functional.** Blue marks interactive/selected/primary. Red is
  destructive. Green is affirmative. Never tint for decoration.
- Pair color with a label or symbol — never encode meaning in hue alone.

## Materials & elevation

Blur is the signature of depth. A material = a translucent fill **plus**
`backdrop-filter`.

```css
--material-thick: rgba(255,255,255,0.80);  /* dark: rgba(28,28,30,0.80) */
--material-regular: rgba(255,255,255,0.72);/* dark: rgba(28,28,30,0.72) */
--material-thin: rgba(255,255,255,0.60);   /* dark: rgba(28,28,30,0.60) */
backdrop-filter: saturate(180%) blur(20px);
```

Elevation shadows (soft, wide, low opacity — never a hard dark drop):

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.10);
--shadow-md: 0 2px 8px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.08);
--shadow-lg: 0 12px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
```

- Navigation/toolbars are **translucent** and content scrolls beneath them.
- Cards sit on a grouped background and lift with `--shadow-sm`.
- Use `border` only for hairlines (separators, list dividers, field edges).

## Shapes

Continuous (squircle) corners. Radii:

```
--radius-xs: 6px     small chips, checkboxes
--radius-sm: 10px    default controls, buttons, inputs
--radius-md: 12px    menus, small cards
--radius-lg: 16px    cards, grouped list containers
--radius-xl: 22px    sheets, large cards, modals
--radius-capsule: 9999px  pills, segmented controls, avatars
```

- **Capsules** are common: buttons, badges, segmented controls, search fields.
- Grouped lists use radius ~10–16 on the container; rows are divided by
  hairlines inset to the text (not full-bleed).

## Motion

- Spring-like: use `cubic-bezier(0.32, 0.72, 0, 1)` or a CSS spring feel.
  Fast start, gentle settle. Avoid linear and `ease-in`.
- Animate `transform` / `opacity` only. Durations 200–350ms for UI;
  sheets/modals longer.
- Enter from a small scale/offset (`0.96`), never `scale(0)`. Exits faster
  than entrances.
- Press feedback: `scale(0.97)` and a slight fill darken. Direct manipulation
  (drag, swipe) tracks the pointer 1:1.
- Honor `prefers-reduced-motion`; reduce to fades.

## Components

- **Button.** Filled (system tint, white label, `radius-sm` or capsule),
  Tinted (tint at ~15% alpha, tinted label), Gray (system-fill, label), Plain
  (tint label, no fill). Height `44px` base / `34px` small / `28px` mini.
  Label is **sans, semibold, sentence case** — never uppercase mono. Icon
  buttons are circular.
- **Segmented control.** Capsule track (`system-fill`), selected segment is a
  white/system-background capsule with `--shadow-sm`. Two–five options.
- **Text field.** `secondary-system-fill` or `tertiary-system-bg` fill,
  `radius-sm`, 44px tall, 17px text, `tertiary-label` placeholder, blue focus
  ring (2px, `system-blue`) or blue caret. Grouped lists inset rows with
  hairline separators.
- **List (inset grouped).** Rounded container on grouped bg; rows 44px+,
  `label` primary + `secondary-label` detail, optional chevron / switch.
- **Card.** `secondary-grouped-bg`, `radius-lg`, `--shadow-sm`, 16px padding.
- **Badge / pill.** Capsule, caption-1, tinted fill, tinted label.
- **Switch / checkbox.** iOS switch (capsule track, green when on) or round
  checkmark selection. Checkboxes are rare in Apple UI — prefer switches.
- **Navigation bar.** Translucent material, sticky, title centered. Large-title
  variant collapses on scroll. Back chevron + tint label on the left.

## Icons

- Use SF Symbols if an asset pipeline exists; otherwise stroke icons at ~1.5–2px
  weight, rounded caps/joins, sized to adjacent text cap height (17/20/24px).
- Icons inherit the tint; system glyphs default to blue for actions.

## Do

- Resolve every color through a dynamic token so light/dark both read well.
- Use the type ramp by name; body at 17px.
- Give cards continuous corners, soft shadows, and grouped backgrounds.
- Keep touch targets ≥ 44pt; gate hover behind fine pointers.
- Use blur for nav bars, sheets, and overlays that sit above content.

## Don't

- Don't ship a custom UI typeface, or set buttons/labels in uppercase mono.
- Don't use 2px technical corners, hard 1px borders as the primary separator,
  or gradients for backgrounds.
- Don't use harsh black drop shadows.
- Don't encode state in color alone.
- Don't put an opaque bar where a translucent material belongs.
- Don't animate frequently-used controls; keep interaction instant.

## Applying in this repo

Mirror the tokens above as Tailwind v4 `@theme` / `@utility` variables so the
appearance is driven from one place. The reference implementation lives in
`src/app/globals.css`; components consume semantic utilities
(`bg-surface`, `bg-card`, `text-label`, `text-secondary`, `text-tint`,
`border-separator`, `rounded-lg`, …).
