---
name: oxide-design
description: Apply the Oxide Computer design system to frontend work. Use when building or reviewing UI that should look dense, precise, and technical — dark-first OLED/terminal aesthetic, Swiss typography, uppercase mono UI chrome, OKLCH color, green accent, tight radii, hairline borders, flat surfaces, restrained motion. Use for components, pages, landing pages, dashboards, or any Next.js/React/Tailwind UI in this repo.
license: MPL-2.0
compatibility: opencode
metadata:
  audience: frontend
  source: https://github.com/oxidecomputer/design-system
  package: "@oxide/design-system"
  opencode/slash: "true"
---

# Oxide Design System

Codifies Oxide Computer's design language (`@oxide/design-system`, MPL-2.0) so UI in
this repo renders dense, precise, and technical.

Full reference in-repo: **`DESIGN.md`** (read it for the complete spec).
Upstream source: `https://github.com/oxidecomputer/design-system/blob/master/design.md`.

## Before writing UI in this repo

This is a Next.js 16 app with breaking changes. Read the relevant guide in
`node_modules/next/dist/docs/` before writing code (App Router, RSC, data fetching,
etc.). Styling is Tailwind v4 (`@tailwindcss/turbopack`).

## Brand principles

1. **Dark-first.** `:root` is dark; light is explicit opt-in via `[data-theme="light"]`.
2. **Swiss structure + ASCII texture.** Grid discipline for layout; ASCII (`▸ ● └─ ▁▂▃█`) for accent, dividers, list markers, illustration.
3. **Monospace is UI chrome.** Uppercase mono for labels, badges, buttons, table headers, nav. Sans for prose and headings. This contrast is the signature.
4. **Tight geometry.** Radii top out at 6px. Crisp edges. Surfaces separate with hairline strokes + soft ambient shadow, never heavy fills.
5. **Flat.** No gradients except the modal scrim. Backgrounds are solid black (dark) or white (light).
6. **Semantic, not literal.** Name the role (`bg-raise`, `text-secondary`, `border-error`), never a raw color.
7. **Color is rationed.** Aim for one or two accent objects per screen. Accent only when it means something (primary action, focus, active/healthy state, link).

## Colors (OKLCH)

- Neutral scale 0–1300 (0 darkest, 1300 lightest). Hues: `blue purple red yellow green` (200–1300). `800` is the canonical mid-scale accent anchor.
- Neither canvas is pure black or white — dark uses `neutral-0`, light uses `neutral-1300`.
- Intents: `accent`=green (themeable), `accent-alt`=purple, `success`=green, `error`/`destructive`=red, `notice`=yellow, `info`=blue.
- Three token layers, same class works in both themes:
  - `surface` → `bg-default bg-raise bg-secondary bg-tertiary bg-hover bg-disabled bg-accent bg-error bg-notice bg-info bg-scrim`
  - `content` → `text-raise text-default text-secondary text-tertiary text-quaternary text-disabled text-accent text-error text-success text-notice text-info text-inverse`
  - `stroke` → `border-default border-raise border-secondary border-tertiary border-accent border-error border-success border-notice border-info` (identical as `ring-*` and `outline-*`)
- **Hierarchy through tier, not opacity.** Step `default → secondary → tertiary → quaternary`; never fake it with `/50`.
- **Accent theming:** add `blue-theme`, `red-theme`, `yellow-theme`, `purple-theme`, or `green-theme` to a subtree to remap `accent` tokens (e.g. wrap error content in `red-theme`).
- **Never encode meaning in color alone** — pair hue with a label, icon, or shape. A failed status `Badge` reads "Failed".
- Targets WCAG 2.1 AA. Check contrast against the actual surface token, not `#000`/`#fff`. Set `color-scheme: dark` on root (`light` under `[data-theme="light"]`).

## Typography

- `SuisseIntl` (`--font-sans`) for prose/headings/values. `GT America Mono` (`--font-mono`) for chrome, **uppercase**.
- **Hierarchy from tone, not weight.** Sans is Regular almost everywhere; emphasis steps lighter (`text-raise`) against copy a tier or two darker at the same size. Use `500` sparingly.
- Optical tracking is built into the type utilities — never set `letter-spacing` by hand.
- Semantic sans aliases: `text-sans-sm` 12 · `text-sans-md` 14 (default body) · `text-sans-lg` 16 · `text-sans-xl` 18 · `text-sans-2xl` 25 · `text-sans-3xl` 36 · `text-sans-4xl` 52 · `text-sans-5xl` 65.
- Responsive headings (prefer for page structure): `heading-display`, `heading-xl`, `heading-lg`, `heading-md`.
- Mono: `text-mono-xs` 11 · `text-mono-sm` 12 (workhorse) · `text-mono-md` 14 — all uppercase. `text-mono-code` is 12px, **not** uppercased (code only).
- ASCII set in mono at 0% tracking / 110% leading to preserve grid integrity.

## Layout & spacing

- Tailwind 4px step (`p-2`=8px, `gap-4`=16px). **Group with 8, separate with 16.**
- Control height is the rhythm unit: `h-10` (40px) base, `h-8` (32px) compact — shared by buttons, inputs, listboxes.
- Generally a 12-column grid. Breakpoints are pixel-named (`300…1600`) as `min-width` prefixes, e.g. `800:text-sans-lg`.
- Touch targets reach **44px minimum** (extend hit area, don't enlarge the visible control). Gate hover behind `@media (hover: hover) and (pointer: fine)`.
- **No layout shift:** `tabular-nums` for changing numbers; reserve space / skeletons for async; never swap font weight on hover.
- Optical over geometric: nudge by ±1px when the math looks wrong. Align everything to something.

## Elevation & depth

Depth = hairline border **plus** soft ambient shadow, layered. The `shadow-border-*` family already includes the line — never add a separate `border` on top.

`shadow-border` · `shadow-border-small` (resting controls) · `shadow-border-medium` (raised cards) · `shadow-border-large` · `shadow-menu` · `shadow-menu-inset` (overlap ring without clipping) · `shadow-toast` · `shadow-modal` · `shadow-tooltip`.

## Shapes

`rounded-sm` 1px (checkbox/chip) · `rounded-md` 2px (**default**) · `rounded-lg` 4px (cards/modals) · `rounded-xl` 6px (max) · `rounded-full` (pill/avatar/toggle). Nest inner radius smaller so curves stay concentric.

## Motion

- Motion **explains a change**, never decorates. Honor `prefers-reduced-motion`.
- Animate compositor-friendly props only (`transform`, `opacity`); avoid `width/top/height` and `transition: all`.
- Easing: `ease-out` entering/leaving · `ease-in-out` on-screen reposition/morph · `ease` for hover/color · avoid `ease-in` · `linear` only for constant motion.
- 150–300ms UI transitions; exits faster than entrances. The more frequent the control, the less it animates. `scale(0.97)` on `:active` for tactile press.
- Enter from `scale(0.95)` + a few px, **not** `scale(0)`. `transform-origin` at the trigger/anchor. Interruptible. No spring/bounce/scroll-jacking.
- Skeletons for content regions, spinners only for action/button waits (respect a `minTime` floor).

## Interaction states

- Hover: surface steps up (`bg-default → bg-hover`); text keeps color/weight/position.
- Press: slight transform, no color/shape change.
- Disabled: dim + `cursor: not-allowed` + drop pointer events.
- Focus: 2px `outline-accent-secondary`, offset 0; destructive controls use `outline-destructive-secondary`.

## Components (`@oxide/design-system/ui`)

- `Button` — `variant` primary|secondary|ghost|danger, `size` base(h-10)|sm(h-8)|icon, `loading` overlays Spinner + blocks clicks, uppercase mono label. Disabled/loading set `aria-disabled` and drop pointer events.
- `Badge` — `color` default|destructive|notice|neutral|purple|blue, `variant` default(tinted)|solid. Uppercase mono, inset ring, `h-4`. Status + metadata.
- `Checkbox` — native input reset; `indeterminate` via ref; checked fills `bg-accent`.
- `Listbox` — accessible select (Headless UI + Floating UI); menu uses `shadow-menu-inset`.
- `Spinner` / `SpinnerLoader` — `size` base(12px)|lg(36px); `SpinnerLoader` enforces a `minTime` floor (default 500ms).
- `Tabs` — Radix compound; triggers uppercase mono, active uses `text-accent` + accent bottom border, may carry a count `Badge`.
- Icons — `@oxide/design-system/icons/react` (named, filled by default, 24/16/12px, `currentColor`) or the sprite `@oxide/design-system/icons`. Size icons to neighboring cap height.

## Do

- Use semantic tokens so UI re-themes across light/dark and accent themes for free.
- Establish hierarchy with token tiers and the type utilities (they carry optical tracking).
- Give every interactive control a visible focus ring and an accessible name.
- `tabular-nums` + reserved space for dynamic content.

## Don't

- Reach for raw scale colors (`bg-green-800`) in product code.
- Use a hue as decoration, or a gradient anywhere but the modal scrim.
- Invent radii, shadows, or type sizes outside the scales.
- Animate a frequently-used control, or start an entrance from `scale(0)`.
- Encode status in color alone; uppercase by typing capitals (let the utilities transform); hardcode light/dark colors when a token resolves both.

## Optional: install the real package

Prefer the published system when wiring this repo:

```sh
npm install @oxide/design-system
```

Then consume tokens/utilities and `@oxide/design-system/ui` components directly. Until
then, mirror the token names above as Tailwind v4 `@theme` variables so a later swap is
mechanical.

*Guidance derived from Oxide Computer's `design.md` (MPL-2.0). Built in part on prior art by Emil Kowalski and Vercel's Web Interface Guidelines.*
