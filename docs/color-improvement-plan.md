# Plan: Improve DylGPT Colors

Local working doc — **do not commit**. Goal: replace ad-hoc gray/blue/purple/green with a small, intentional token system that feels branded and accessible.

## Direction (pick one clear look)

**Recommended: “Signal ink”** — cool slate surfaces + a single electric accent (teal/cyan-green), not purple-on-white, not cream/terracotta, not broadsheet.

- Atmosphere: soft slate gradient or faint grain on the main pane; deep ink sidebar
- Brand signal: accent used for CTA, focus, send affordance, and active states
- Avatars: tinted neutrals derived from the same accent (user = accent, assistant = muted ink) instead of purple/green defaults

## Principles

1. **One accent family** — modal CTA, focus rings, send button, and user avatar share the same hue.
2. **Tokens first** — define CSS variables; map Tailwind theme colors to them; stop scattering `blue-500` / `purple-600`.
3. **Surfaces over cards** — keep borders hairline; prefer background shifts over heavy shadows.
4. **Light + dark as first-class** — pair tokens for both; sidebar should feel like a dark surface in light mode, not a separate palette.
5. **Accessibility** — body text ≥ 4.5:1; interactive accents ≥ 3:1 for UI components; test focus states.

## Proposed token set

```css
:root {
  /* Surfaces */
  --bg-canvas: #f4f7f8;       /* main shell — cool, not cream */
  --bg-elevated: #ffffff;     /* input, modal */
  --bg-muted: #e8eef1;        /* assistant rows */
  --bg-sidebar: #0f171a;      /* ink */
  --bg-sidebar-hover: #1a262b;

  /* Text */
  --fg-primary: #12181a;
  --fg-secondary: #4a5a62;
  --fg-muted: #6b7c85;
  --fg-on-accent: #ffffff;
  --fg-on-sidebar: #e8eef1;

  /* Accent (single family) */
  --accent: #0d9488;          /* teal-600-ish */
  --accent-hover: #0f766e;
  --accent-subtle: #ccfbf1;
  --focus-ring: #14b8a6;

  /* Status */
  --danger: #b42318;
  --success: #067647;
  --border: rgba(15, 23, 26, 0.10);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-canvas: #0b1214;
    --bg-elevated: #141c1f;
    --bg-muted: #1a2428;
    --bg-sidebar: #060a0c;
    --bg-sidebar-hover: #1a262b;
    --fg-primary: #e8eef1;
    --fg-secondary: #9aadb6;
    --fg-muted: #6b7c85;
    --accent-subtle: #134e4a;
    --border: rgba(232, 238, 241, 0.12);
  }
}
```

Wire into `@theme inline` as `--color-canvas`, `--color-accent`, etc., then replace utilities.

## Implementation steps

### 1. Foundation
- Expand `app/globals.css` with the token set above.
- Map tokens in `@theme inline` so classes like `bg-canvas`, `text-fg-secondary`, `bg-accent` work.
- Keep Geist fonts; drop the system font stack on `body` so typography matches layout.tsx.

### 2. Replace hardcoded accents
| File | Change |
|------|--------|
| `NameModal.tsx` | `blue-500/600` → `bg-accent` / `hover:bg-accent-hover`; focus ring → `focus:ring-focus-ring` |
| `ChatInterface.tsx` | user avatar `purple-600` → `bg-accent`; assistant `green-600` → `bg-sidebar` or muted accent; shell/borders → tokenized |
| `page.tsx` | sidebar `gray-900/700` → `bg-sidebar` / `bg-sidebar-hover`; main `gray-50` → `bg-canvas` |

### 3. Hierarchy polish
- Empty state: brand “DylGPT” in primary ink; supporting line in secondary; disclaimer in muted.
- Send button: idle = muted; enabled = accent fill (clear affordance).
- Modal: elevated surface on dimmed canvas; one accent CTA only.

### 4. Dark mode
- Implement via tokens (`prefers-color-scheme` or a toggle later).
- Verify message rows, input, and sidebar contrast in both themes.

### 5. QA checklist
- [ ] Contrast audit (axe or manual) on empty state, chat thread, modal
- [ ] Keyboard focus visible on input, send, Continue, New chat
- [ ] Mobile header + desktop sidebar both use the same accent language
- [ ] No leftover `blue-*` / `purple-*` / `green-*` for brand accents
- [ ] Screenshot light + dark for review

## Out of scope (for this plan)

- Full redesign / motion system
- Custom illustration or logo work
- Changing SMS / API behavior

## Success criteria

- One accent hue everywhere interactive
- Surfaces read as a system (canvas / elevated / muted / sidebar)
- Looks like DylGPT, not a stock ChatGPT clone or default AI purple theme
