# Handoff: Folio — Personal Finance App

## Overview
Folio is a personal-finance web app for everyday people (not accountants) to track expenses, set budgets, organize categories, and see a dashboard of their spending. The aesthetic is calm, trustworthy, premium fintech SaaS: light theme, lots of whitespace, soft rounded cards, subtle shadows, gentle borders, one confident emerald accent.

This package documents six screens — App Shell, Login/Register, Dashboard, Expenses, Budgets, Categories — each with loading, empty, and error states.

## About the Design Files
The files in `reference/` are **design references created in HTML** — a working prototype showing the intended look and behavior. **They are not production code to copy directly.** `*.dc.html` is a custom streaming-component format; `support.js` is its runtime. Do **not** port that runtime or the `dc.html` syntax.

Your task: **recreate these designs in the target codebase** (React + Vite + TailwindCSS, per the original brief) using its established patterns and libraries. Open `reference/Folio Finance.dc.html` in a browser to interact with the real thing — use the **"Demo" switcher** at the top-right of each screen to preview Data / Loading / Empty / Error states, and resize the window below 860px to see the mobile layout. Read the inline `style="…"` objects and the `class Component` logic block for exact values and behavior.

If no front-end environment exists yet, scaffold React + Vite + Tailwind and implement there.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, shadows, and interactions are all specified below and present in the reference files. Recreate the UI pixel-faithfully using your codebase's component patterns. Exact hex values and px measurements are given — use them.

---

## Design Tokens

### Color — Neutrals (warm-tinted)
| Token | Hex | Usage |
|---|---|---|
| `app-bg` | `#FAFAF9` | App background (warm off-white) |
| `surface` | `#FFFFFF` | Cards, sidebar, inputs |
| `surface-hover` | `#FCFCFB` | List-row hover |
| `surface-muted` | `#F4F4F2` | Track of progress bars, pill chips, segmented control bg |
| `border` | `#EEEEEC` | Card / sidebar borders |
| `border-strong` | `#E4E4E7` | Input borders |
| `border-faint` | `#F7F7F5` | List-row dividers |
| `text` | `#18181B` | Primary text |
| `text-secondary` | `#3F3F46` | Labels, secondary headings |
| `text-muted` | `#52525B` | Nav idle, body |
| `text-subtle` | `#71717A` | Helper / subtitle text |
| `text-faint` | `#A1A1AA` | Captions, meta, placeholders |
| `icon-idle` | `#A1A1AA` | Idle nav icons |
| `delete-idle` | `#C4C4C8` | Idle delete icon |

### Color — Accent (emerald) & semantic
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#059669` | Primary buttons, active accents, focus ring |
| `primary-hover` | `#047857` | Primary button hover |
| `primary-tint` | `#ECFDF5` | Active nav pill bg, avatar bg |
| `primary-text` | `#065F46` | Text on primary tint (active nav label) |
| `success` | `#10B981` | Positive trend, success accents |
| `success-soft-bg` | `#ECFDF5` | Down-trend chip bg |
| `success-soft-text` | `#047857` | Down-trend chip text (spending decreased = good) |
| `warning` | `#F59E0B` | Amber category / caution |
| `warning-bg` | `#FFFBEB` | Up-trend chip bg |
| `warning-text` | `#B45309` | Up-trend chip text (spending increased) |
| `danger` | `#DC2626` | Delete, over-budget bars, errors |
| `danger-hover` | `#B91C1C` | Danger button hover, over-budget label text |
| `danger-tint` | `#FEF2F2` | Danger-hover bg, "Over budget" pill, error icon bg |

### Color — Category palette (color picker swatches)
`#10B981` `#F59E0B` `#3B82F6` `#8B5CF6` `#06B6D4` `#F43F5E` `#EC4899` `#F97316` `#14B8A6` `#6366F1`
Default seed categories: Groceries `#10B981`, Dining `#F59E0B`, Transport `#3B82F6`, Rent & Home `#8B5CF6`, Utilities `#06B6D4`, Entertainment `#F43F5E`.

### Typography
- **Sans:** `Geist` (Google Fonts), weights 400/500/600/700. Fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- **Mono:** `Geist Mono`, weights 400/500/600 — used for **all currency values** and numeric data, with `font-variant-numeric: tabular-nums`.
- Antialiasing: `-webkit-font-smoothing: antialiased`.

| Role | Size / Weight / Tracking |
|---|---|
| Page H1 (screen title) | 24px / 600 / -0.025em |
| Greeting (dashboard H1) | 24px / 600 / -0.025em |
| Auth H1 | 22px / 600 / -0.02em |
| Big stat number (mono) | 29px / 600 / -0.02em |
| Budget total (mono) | 27px / 600 / -0.02em |
| Section/card heading | 15px / 600 |
| Top-category name | 20px / 600 / -0.02em |
| Body / inputs | 14px / 400–500 |
| List item title | 14px / 500 |
| Labels (form) | 12.5–13px / 500 |
| Caption / meta | 12.5px / 400 (`text-faint`) |
| Pill / badge | 11–12px / 600 |
| Nav item | 14px / 500 (idle), 600 (active) |
| Uppercase kicker ("DEMO") | 11px / 600 / 0.06em / uppercase |

### Spacing
Base scale (px): 2, 3, 6, 8, 9, 10, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32. Card padding 22–24px. Page gutters: desktop 32px horizontal / 28px top; mobile 18px / 14–20px. Grid gaps: 18px (cards/panels), 13px (form fields), 14px (budget cards).

### Border radius
| Token | px | Usage |
|---|---|---|
| `radius-pill` | 999px | Progress bars, chips, badges |
| `radius-sm` | 8–9px | Icon buttons, small controls, segmented buttons |
| `radius-md` | 10px | Buttons, inputs, nav items |
| `radius-card-sm` | 14px | Budget row cards |
| `radius-card` | 16px | Standard cards/panels |
| `radius-card-lg` | 18px | Auth card, modal |
| Logo mark | 9–10px | Brand square |

### Shadows
| Token | Value | Usage |
|---|---|---|
| `shadow-card` | `0 1px 2px rgba(16,24,40,.04)` | All cards/panels |
| `shadow-primary-btn` | `0 1px 2px rgba(5,150,105,.25)` | Primary buttons |
| `shadow-logo` | `0 3px 9px rgba(5,150,105,.3)` | Logo mark |
| `shadow-auth` | `0 1px 2px rgba(16,24,40,.04), 0 8px 28px -12px rgba(16,24,40,.10)` | Auth card |
| `shadow-modal` | `0 20px 50px -16px rgba(16,24,40,.32)` | Confirm modal |
| `shadow-toast` | `0 10px 30px -8px rgba(0,0,0,.4)` | Toast |
| `shadow-segment` | `0 1px 2px rgba(16,24,40,.10)` | Active segmented-control button |

### Focus ring (all inputs/selects)
`border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,.12);` on focus. Inputs are 42–44px tall, 1px `#E4E4E7` border, 10px radius, 14px text.

### Motion
- Hover transitions: `background .15s, color .15s` (and `border-color`/`box-shadow .15s` on inputs).
- Progress/category bars animate width: `width .4s ease`.
- Button active press: `transform: translateY(1px)`.
- Keyframes: `folioFade` (8px up + fade, 0.5s) for auth; `folioPop` (10px up + scale .98, 0.2s) for modal/toast; `folioOverlay` (opacity, 0.15s) for modal backdrop; `folioShimmer` (skeleton, 1.4s infinite linear, 450px sweep).

---

## Reusable Components

### Button
- **Primary:** bg `#059669`, white text, 14px/600, height 42–44px, radius 10px, `shadow-primary-btn`; hover `#047857`; active `translateY(1px)`. Often leads with a 17px `+` icon (stroke 2.2).
- **Secondary:** bg `#FFFFFF`, 1px `#E4E4E7` border, text `#3F3F46`, 14px/500; hover bg `#FAFAF9`.
- **Ghost:** transparent, text `#059669` (or muted), no border; hover bg `#ECFDF5` (or `#FAFAF9`). Used for "Clear filters", sign-out.
- **Danger:** bg `#DC2626`, white text; hover `#B91C1C`. Used in confirm modal.
- **Icon button:** 32–34px square, transparent, `radius-sm`; delete variant idle `#C4C4C8` → hover bg `#FEF2F2` + color `#DC2626`.

### Input / Select
Height 42–44px, `#FFFFFF` bg, 1px `#E4E4E7` border, 10px radius, 14px text, 0–14px horizontal padding; focus ring as above. Labels 12.5–13px/500 `#52525B`, 6–7px below. Selects use `appearance: none`. Amount inputs use Geist Mono.

### Card
`#FFFFFF`, 1px `#EEEEEC` border, 16px radius, 22–24px padding, `shadow-card`.

### Badge / Pill
- Month chip: bg `#F4F4F2`, text `#A1A1AA`, 12px/500, 2px×9px padding, pill.
- "Over budget" / "Over": bg `#FEF2F2`, text `#B91C1C`, 11px/600, pill.
- Trend chip: up = bg `#FFFBEB`/text `#B45309`; down = bg `#ECFDF5`/text `#047857`; 12px/600, pill.

### List / Table row
Flex row, 14px vertical / 22px horizontal padding, divider `1px #F7F7F5`, hover bg `#FCFCFB`. Pattern: category color dot (9px) · title + meta (flex:1) · date (`text-faint`, right) · amount (mono 14px/600, right) · delete icon button.

### Modal / Confirm
Fixed overlay `rgba(24,24,27,.32)` (`folioOverlay`); centered panel max-width 392px, `#FFFFFF`, 18px radius, 26px padding, `shadow-modal`, `folioPop`. Danger icon in `#FEF2F2` rounded square. Title 17px/600, body 14px `#71717A`. Actions right-aligned: secondary "Cancel" + danger confirm. Backdrop click cancels; panel click stops propagation.

### Toast
Fixed bottom-center, bg `#18181B`, white 13.5px/500 text, 11px radius, green check icon, `shadow-toast`, `folioPop`. Auto-dismiss after 2.6s.

### App Navigation
- **Desktop sidebar:** 248px wide, `#FFFFFF`, right border `#EEEEEC`, sticky full height. Logo (emerald rounded square + rotated white diamond + "Folio" 17px/600). Nav items: flex, 12px gap, 10px×12px padding, 10px radius; idle text `#52525B` + icon `#A1A1AA`; active bg `#ECFDF5`, text `#065F46`/600, icon `#059669`. Footer: avatar (34px circle, `#ECFDF5` bg, `#065F46` initials) + name + email, then full-width "Sign out" ghost row.
- **Mobile (<860px):** top bar (58px, logo + sign-out button) + fixed bottom tab nav (62px, 4 tabs, icon + 10.5px/600 label; active `#059669`, idle `#A1A1AA`). Sidebar hidden.

---

## Screens / Views

### 1. App Shell
- **Layout:** flex; sidebar (desktop) + main column (flex:1, min-width:0). Main has a header block then a body block. Desktop padding: header `28px 32px 8px`, body `18px 32px 36px`. Mobile adds bottom padding 62px for the tab bar.
- **Header:** screen title H1 (24px/600/-0.025em) + subtitle (14px `#71717A`), and on the right the **Demo state switcher** — a segmented control (bg `#F4F4F2`, 10px radius, 4px padding) with "DEMO" kicker + Data/Loading/Empty/Error buttons; active button bg `#FFFFFF` + `shadow-segment`. *(The Demo switcher is a prototype affordance — omit it in production; wire the three states to real async status instead.)*

### 2. Login / Register
- **Purpose:** authenticate; toggle sign-in ↔ sign-up.
- **Layout:** full-viewport centered, bg `radial-gradient(120% 120% at 50% 0%, #F2F7F4 0%, #FAFAF9 55%)`. Card max-width 404px, 18px radius, 32px padding, `shadow-auth`, `folioFade` in. Logo above card.
- **Components:** H1 ("Welcome back" / "Create your account") + subtitle; Email + Password inputs (44px); inline error text `#DC2626` 13px; full-width primary submit ("Sign in" / "Create account"); switch link row (`#059669`/600 button); reassurance caption below card.
- **Validation:** both fields required, else "Please enter your email and password." Submitting signs in.

### 3. Dashboard
- **Purpose:** monthly spending overview.
- **Layout:** month selector row → 3 stat cards (`repeat(3,1fr)` desktop, `1fr` mobile, 18px gap) → 2 panels (`1fr 1fr` desktop, `1fr` mobile).
- **Month selector:** prev/next icon buttons (36px square, secondary), centered month label (15px/600, min-width 148px), "This month" secondary button. Prev/next shift the visible month; data recomputes for that month.
- **Stat cards:**
  - *Total spent* — all-time sum (mono 29px) + "All time · N expenses".
  - *This month* — month sum (mono 29px) + trend chip vs last month + "vs last month". Trend = `(thisMonth − prevMonth) / prevMonth × 100`; ↑ uses warning colors, ↓ uses success colors; "No prior data" when prevMonth = 0.
  - *Top category* — color dot (11px) + name (20px/600) + "amount · pct of spending"; empty → "No spending yet".
- **Spending by category panel:** title + month subtitle; horizontal bars per category with spend > 0, sorted desc. Each: color dot + name (left), `amount · pct%` (mono, right), then 9px track (`#F4F4F2`, pill) with colored fill scaled to the **largest** category (max = 100%, min 3%). Empty → EmptyState (chart icon).
- **Budget usage panel:** per budget in the visible month: dot + category + optional "Over" pill (left), `spent / budget` (mono, right), 9px progress (fill = min(spent/budget,100)%; **over-budget fill is `#DC2626`**). Empty → EmptyState (target icon).

### 4. Expenses
- **Purpose:** add, search, filter, sort, delete expenses.
- **Layout:** Add-expense card → list card.
- **Add-expense form:** grid `1.7fr 1fr 1.1fr 1.3fr` desktop / `1fr` mobile: Title, Amount (mono, number), Date (date), Category (select). Second row: Notes (optional, flex) + primary "Add expense". Validation order: title required → amount > 0 → category required; messages: "Please enter a title." / "Enter an amount greater than 0." / "Choose a category." On success: prepend row + toast "Expense added", reset form.
- **List card header:** summary "N expenses · $total" (14px/600) + controls: search input (180px, leading magnifier icon), category `<select>` (All categories + each), sort `<select>` (Newest/Oldest/Amount high→low/low→high), and "Clear filters" ghost button (only when a filter is active).
- **Rows:** list/table row pattern above; meta line = category name, plus `· notes` when present. Delete → confirm modal → toast.
- **Empty states:** filtered-with-no-results → EmptyState (list) + "Clear filters" button; no expenses at all → EmptyState (list) "No expenses yet".

### 5. Budgets
- **Purpose:** set monthly limits, track progress.
- **Layout:** total-budgeted summary card → add-budget card → list of budget cards.
- **Summary:** "Total budgeted" label + sum (mono 27px) + "N budgets" pill.
- **Add-budget form:** flex row — Category (select), Monthly limit (mono number), Month (`month` input) + primary "Add budget". Validation: category required → amount > 0. Success → prepend + toast "Budget added".
- **Budget cards** (`radius-card-sm`, sorted newest-month-first): header row = dot + category + month chip + optional "Over budget" pill (left), `spent / budget` (mono, right) + delete; 10px progress bar (over = `#DC2626`); footer = "pct% used" (left) + remaining ("$X left" muted, or "$X over" in `#B91C1C`).
- **Empty:** EmptyState (target) inside a card.

### 6. Categories
- **Purpose:** create/delete color-coded categories.
- **Layout:** add-category card (max-width 560px) → list card.
- **Add-category form:** Name input (flex) + primary "Add category"; below, "Color" label + a row of 10 swatch buttons (32px, 9px radius). Selected swatch shows a ring (`0 0 0 2px #fff, 0 0 0 4px <color>`). Validation: name required → "Enter a category name." Success → append + toast.
- **List:** header "N categories"; each row = 38px rounded swatch (`radius` 11px) + name (14.5px/600) + count ("N expense(s)") + delete icon. Deleting a category sets its expenses' categoryId to null (they show as "Uncategorized"); confirm copy notes this.
- **Empty:** EmptyState (tag) "No categories yet".

---

## State & States (all screens)
Each screen renders one of: **Loading** (skeleton cards, `folioShimmer`), **Empty** (EmptyState component with icon ∈ chart/target/list/tag + title + body), **Error** (ErrorState card: danger icon, "Couldn't load your data", "Try again" dark button), or **Data**. In the prototype these are driven by the Demo switcher; in production drive them from real fetch status (`isLoading` / `error` / empty array / data).

### Data model
```
Category { id, name, color }
Expense  { id, title, amount:number, date:'YYYY-MM-DD', categoryId, notes }
Budget   { id, categoryId, amount:number, month:'YYYY-MM' }
User     { name, email }
```
### Derived values
- Month scope filters expenses by `date.startsWith(month)`.
- Trend % vs previous month (see Dashboard).
- Category bars: sum per category for the month, sorted desc, bar width relative to the max category.
- Budget usage: spent = month expenses in that category; over = spent > budget.
- Expense filtering: search matches title or notes (case-insensitive); category filter; 4 sort modes. `filtersActive` toggles "Clear filters".
- Currency format: `en-US`, always 2 decimals, `$` prefix, tabular-nums mono.
- Greeting by local hour (<12 morning / <18 afternoon / else evening); first name derived from email local-part.

### Interactions
Sign in/out · switch auth mode · navigate (sidebar + mobile tabs) · prev/next/this-month · add expense/budget/category (with validation) · delete anything via confirm modal · success toasts (2.6s) · live search/filter/sort · color-swatch selection · responsive reflow at 860px · hover/focus/active states throughout.

## Responsive behavior
Breakpoint **860px**. Below it: sidebar → top bar + bottom tab nav; stat cards and panels stack to a single column; form grids collapse to `1fr`; page padding tightens. The reference reads `window.innerWidth`; in production use Tailwind responsive variants (`md:` ≈ this breakpoint, or a custom screen).

## Assets
No external image assets. The logo is pure CSS/markup (emerald rounded square + rotated white diamond). All icons are inline SVG strokes (Lucide-style, stroke-width 1.8–2.2) — substitute your icon library (e.g. `lucide-react`): dashboard=layout-grid, expenses=list, budgets=pie/clock, categories=tag, sign-out=log-out, search, plus, trash, chevron-left/right, alert-triangle, refresh-cw, check.

## Files
- `reference/Folio Finance.dc.html` — the full app (all screens + logic). The `class Component` block is the source of truth for data, derived values, and handlers; inline `style` objects are the source of truth for visuals.
- `reference/SkelCard.dc.html` — skeleton loading card.
- `reference/EmptyState.dc.html` — empty-state block (icon/title/body).
- `reference/ErrorState.dc.html` — error-state card with retry.
- `reference/support.js` — prototype runtime only; **do not port**.
- `tailwind.theme.md` — copy-paste Tailwind theme tokens.
