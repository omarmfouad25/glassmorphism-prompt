# liquid-glass-ui

A precision design system for building **liquid glass / glassmorphism hero sections** over video or image backgrounds — using Next.js, Tailwind CSS, and Three.js.

This repo documents the exact techniques that produce premium-quality glass UI results. Not "add a blur" — a named tier system, a specific border trick, a strict color philosophy, and a complete micro-interaction spec.

---

## What This Is

Most glassmorphism tutorials say "add `backdrop-filter: blur()`." That produces mediocre results.

This system specifies **six dimensions simultaneously**. The precision is what makes the difference:

| Dimension | Rule |
|-----------|------|
| Glass tiers | 3 named tiers: `panel` / `card` / `pill` — each with exact blur, opacity, and shadow values |
| Border technique | `::before` + `padding: 1px` + `mask-composite: exclude` XOR trick — never a plain `border` |
| Color constraint | Strict grayscale only — the background video/image provides all color |
| Font strategy | Poppins for all structure; Source Serif 4 italic for h1 accent + pull quote only |
| Opacity hierarchy | white → /80 → /60 → /50 (text); /15 → /10 (bg); /30 (dividers) |
| Micro-interactions | `hover:scale-105 active:scale-95` on every interactive element, always |

---

## The Design Philosophy

> **The background provides all color. The glass panels stay achromatic.**

This constraint is what makes the design feel premium. When the panels have no color of their own, they become *windows* rather than surfaces — they reveal depth by showing what's behind them, not by asserting what they are.

Every value in this system was chosen to serve that constraint. The blur depths create foreground hierarchy. The opacity tiers create typographic hierarchy. The border gradient creates a light-from-top-left illusion of physicality.

---

## Tech Stack

| Tool | Version |
|------|---------|
| Next.js | 14+ (App Router) |
| Tailwind CSS | 3+ |
| Three.js | latest |
| @react-three/fiber | latest |
| @react-three/drei | latest |
| lucide-react | latest |
| Poppins + Source Serif 4 | via `next/font/google` |

Install Three.js stack:
```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

---

## The 3-Tier Glass System

The core of this design system. Three named CSS classes that map to three depth levels.

### `.glass-panel` — Heavy (60px blur)
Use for: full-section overlays, large feature containers, page-level regions.
- `blur(60px) saturate(180%)`
- `bg: rgba(0,0,0,0.35)`
- Strong top-left shimmer gradient on the `::before` border

### `.glass-card` — Medium (30px blur)
Use for: cards nested inside panels, stat blocks, community widgets.
- `blur(30px) saturate(160%)`
- `bg: rgba(0,0,0,0.28)`
- Softer shimmer on the `::before` border

### `.glass-pill` — Light (16px blur)
Use for: buttons, nav items, tags, small interactive chips.
- `blur(16px) saturate(150%)`
- `bg: rgba(0,0,0,0.22)`
- Minimal shimmer — just enough to feel real

**Never invent new glass values.** Pick one of the three tiers. The visual contrast between tiers is intentional and what creates perceived depth.

---

## The Border Technique

This is the single most impactful technique. Instead of `border: 1px solid rgba(255,255,255,0.2)` (which looks flat), we use a CSS `::before` pseudo-element with the XOR mask trick to create a border made of a *gradient* — lighter in the top-left, fading toward the bottom-right. This mimics how light hits a physical glass object.

```css
.glass-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;          /* This 1px padding becomes the border area */
  border-radius: inherit;
  pointer-events: none;

  /* XOR mask: shows only the padding area (the "border"), not the content box */
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;

  /* The gradient that fills the border area */
  background: linear-gradient(160deg,
    rgba(255,255,255,0.5) 0%,
    rgba(255,255,255,0.15) 30%,
    transparent 55%,
    rgba(255,255,255,0.08) 100%
  );
}
```

The XOR composite operation means: *show the background where content-box and full-box do NOT overlap* — which is exactly the 1px padding strip. Result: a gradient border with no actual `border` property.

---

## Opacity Hierarchy

Every color decision flows through this table. No exceptions.

### Text
| Token | Use |
|-------|-----|
| `text-white` | Primary headings |
| `text-white/80` | Secondary text, card titles |
| `text-white/60` | Descriptions, labels |
| `text-white/50` | Muted, timestamps, captions |

### Backgrounds
| Token | Use |
|-------|-----|
| `bg-white/15` | Primary icon containers, button fills |
| `bg-white/10` | Secondary element backgrounds |

### Structural
| Token | Use |
|-------|-----|
| `bg-white/30` | Dividers, separators |
| `bg-neutral-900` | Page background fallback (always set this) |

---

## Typography

Two fonts. Two roles. No mixing.

```tsx
// layout.tsx
import { Poppins, Source_Serif_4 } from 'next/font/google'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '600'],
})
```

| Font | Role |
|------|------|
| Poppins | Everything — headings, UI, labels, descriptions |
| Source Serif 4 italic | Accent words in `<h1>` only, and the pull quote |

Source Serif 4 should appear in **at most 2–3 words** on the entire page. The rarity is what makes it land.

### Type Scale
```
H1:           text-6xl lg:text-7xl font-medium tracking-[-0.05em]
Card titles:  text-sm font-medium
Labels:       text-xs uppercase tracking-widest
Descriptions: text-xs leading-relaxed
```

---

## Video Background (Three.js)

The video background uses WebGL via `@react-three/fiber` to render a video texture on a plane mesh with object-cover scaling math. This avoids the `<video>` z-index / `position: fixed` conflicts that plague CSS-only approaches.

**Two-file pattern required for Next.js App Router:**

1. `GlassScene.tsx` — the actual Three.js canvas with `'use client'`
2. `GlassSceneClient.tsx` — a `dynamic(() => ..., { ssr: false })` wrapper

The `ssr: false` wrapper is non-negotiable. `@react-three/fiber` uses browser APIs (`canvas`, `WebGL`, `requestAnimationFrame`) that do not exist on the server. Without it, builds will fail.

See [`components/GlassScene.tsx`](./components/GlassScene.tsx) and [`components/GlassSceneClient.tsx`](./components/GlassSceneClient.tsx).

---

## Layout Architecture

```
<main>  ← bg-neutral-900, overflow-hidden
  │
  ├── <GlassSceneClient />     z-index: 0  (absolute, fills screen)
  │
  └── <div>                    z-index: 10 (relative, flex row)
        │
        ├── Left Panel (w-full lg:w-[52%])
        │     ├── .glass-panel (absolute inset-4 pointer-events-none)
        │     └── content (relative flex-col)
        │           ├── nav
        │           ├── hero (flex-1 centered)
        │           │     ├── tag pills (.glass-pill)
        │           │     ├── h1 with serif italic accent
        │           │     ├── tagline
        │           │     └── CTA button (.glass-pill)
        │           └── footer quote
        │
        └── Right Panel (hidden lg:flex w-[48%])
              ├── top bar (.glass-pill)
              ├── community card (.glass-card)
              └── feature section (.glass-panel)
                    └── 2-col grid (.glass-card × N)
```

---

## Micro-interactions

Applied to **every** interactive element. Not optional. These are what make the design feel alive vs. static.

| Element | Classes |
|---------|---------|
| Buttons, cards, pills | `transition-transform hover:scale-105 active:scale-95 cursor-pointer` |
| Text links, social icons | `transition-colors hover:text-white/80` |
| Icon containers | `rounded-full bg-white/15 flex items-center justify-center` |

The `active:scale-95` is as important as the hover scale — it gives tactile feedback on click. Don't omit it.

---

## Files in This Repo

| File | Description |
|------|-------------|
| [`globals.css`](./globals.css) | Complete 3-tier glass CSS system, ready to paste into `@layer components` |
| [`components/GlassScene.tsx`](./components/GlassScene.tsx) | Three.js video background component |
| [`components/GlassSceneClient.tsx`](./components/GlassSceneClient.tsx) | SSR-safe dynamic wrapper for Next.js App Router |
| [`examples/layout.tsx`](./examples/layout.tsx) | Font setup for `layout.tsx` |
| [`examples/page.tsx`](./examples/page.tsx) | Full two-panel layout skeleton with comments |

---

## Quick Start

1. Copy [`globals.css`](./globals.css) content into your project's `globals.css` under `@layer components`
2. Copy [`components/`](./components/) into your project
3. Update [`layout.tsx`](./examples/layout.tsx) with the font setup
4. Use [`examples/page.tsx`](./examples/page.tsx) as your starting point
5. Replace `VIDEO_URL`, `BRAND_NAME`, heading text, and card data with your content

---

## Claude Code Skill

This repo includes a Claude Code skill file ([`liquid-glass-ui.md`](./liquid-glass-ui.md)) that encodes this entire system as a reusable prompt. Place it in `~/.claude/commands/` to invoke it with `/liquid-glass-ui` from any project.

When invoked, it will:
1. Parse your design brief (brand, heading, CTA, cards, quote, background URL)
2. Check your project setup and install Three.js if needed
3. Write all files following this exact spec
4. Verify with `npx tsc --noEmit`

---

## Why This Works

The difference between mediocre glassmorphism and premium glass UI comes down to constraint. Specificity. Every value chosen for a reason.

- The 3-tier hierarchy means your eye always knows what's in front of what
- The XOR border creates physical dimensionality without adding visual noise
- The achromatic constraint keeps the UI from competing with the background
- The serif italic accent is powerful *because* it appears in exactly one place
- The micro-interactions at `scale-105/95` feel physical without being exaggerated

When all six dimensions are applied together, the result doesn't look like a CSS trick. It looks like glass.

---

## License

MIT
