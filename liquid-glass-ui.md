# Skill: `liquid-glass-ui`

## Purpose
Build hero sections, landing pages, and marketing UIs with a liquid glass / glassmorphism aesthetic over a video or image background. Encodes the exact technical patterns that produced Bloom-quality results.

## When to Use
Invoked when building a hero, landing page, or marketing UI with glass panels over a video or image background. Captures the Bloom design system — 3-tier glass, XOR border technique, strict grayscale color constraint, Poppins + Source Serif 4 pairing, and full micro-interaction spec.

---

## Step 1 — Parse the Design Brief

Extract these 8 parameters from the user's message. Apply sensible defaults for any that are missing — do not block execution.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `brand_name` | Product/brand name | "Brand" |
| `tagline` | Short subheading below h1 | "The future, beautifully made." |
| `background_url` | Video (.mp4) or image URL | Use a neutral dark video or `bg-neutral-900` |
| `hero_heading` | Full h1 text; mark which words get serif italic | First noun phrase gets italic |
| `cta_label` | Button text | "Get Started" |
| `tag_pills` | 2–4 short labels | ["Design", "Motion", "Code"] |
| `bottom_quote` | Pull quote + attribution | Omit if not provided |
| `right_panel_cards` | Array of { title, description, icon } | 2–3 generic feature cards |

---

## Step 2 — Check Project Setup

Before writing any files:
1. Confirm Next.js App Router + Tailwind CSS + lucide-react are installed
2. If Three.js stack is missing, install it:
   ```bash
   npm install three @react-three/fiber @react-three/drei
   npm install -D @types/three
   ```
3. Confirm `globals.css` uses Tailwind's `@layer` directives

---

## Step 3 — Write `globals.css` (3-Tier Glass System)

Inject the following under `@layer components`. This is the canonical glass tier system — do not simplify or alter the values.

```css
@layer components {

  /* ── Shared structure for all glass tiers ── */
  .glass-panel, .glass-card, .glass-pill {
    position: relative;
    overflow: hidden;
  }
  .glass-panel::before, .glass-card::before, .glass-pill::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    pointer-events: none;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  /* ── PANEL — heavy (overlays, feature containers) ── */
  .glass-panel {
    background: rgba(0,0,0,0.35);
    backdrop-filter: blur(60px) saturate(180%);
    -webkit-backdrop-filter: blur(60px) saturate(180%);
    box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .glass-panel::before {
    background: linear-gradient(160deg,
      rgba(255,255,255,0.5) 0%,
      rgba(255,255,255,0.15) 30%,
      transparent 55%,
      rgba(255,255,255,0.08) 100%
    );
  }

  /* ── CARD — medium (nested cards inside panels) ── */
  .glass-card {
    background: rgba(0,0,0,0.28);
    backdrop-filter: blur(30px) saturate(160%);
    -webkit-backdrop-filter: blur(30px) saturate(160%);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.16);
  }
  .glass-card::before {
    background: linear-gradient(145deg,
      rgba(255,255,255,0.38) 0%,
      rgba(255,255,255,0.1) 35%,
      transparent 60%,
      rgba(255,255,255,0.06) 100%
    );
  }

  /* ── PILL — light (buttons, tags, nav items) ── */
  .glass-pill {
    background: rgba(0,0,0,0.22);
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
  }
  .glass-pill::before {
    background: linear-gradient(135deg,
      rgba(255,255,255,0.4) 0%,
      rgba(255,255,255,0.08) 40%,
      transparent 70%
    );
  }

}
```

---

## Step 4 — Write `layout.tsx`

```tsx
import { Poppins, Source_Serif_4 } from 'next/font/google'
import './globals.css'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${sourceSerif4.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

**Font usage rules (never deviate):**
- All headings, UI text, labels, descriptions → `style={{ fontFamily: 'var(--font-poppins)' }}`
- Italic accent words in h1 and pull quote only → `style={{ fontFamily: 'var(--font-source-serif)', fontStyle: 'italic' }}`

---

## Step 5 — Write `GlassScene.tsx` + `GlassSceneClient.tsx`

### `components/GlassScene.tsx`
```tsx
'use client'

import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useVideoTexture } from '@react-three/drei'
import * as THREE from 'three'

function VideoPlane({ url }: { url: string }) {
  const texture = useVideoTexture(url, { loop: true, muted: true, start: true })
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  // object-cover math: fill viewport while preserving aspect ratio
  const videoAspect = 16 / 9
  const viewportAspect = viewport.width / viewport.height
  const scaleX = viewportAspect > videoAspect
    ? viewport.width
    : viewport.height * videoAspect
  const scaleY = viewportAspect > videoAspect
    ? viewport.width / videoAspect
    : viewport.height

  return (
    <mesh ref={meshRef} scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

export default function GlassScene({ videoUrl }: { videoUrl: string }) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      camera={{ position: [0, 0, 1], fov: 50 }}
    >
      <VideoPlane url={videoUrl} />
    </Canvas>
  )
}
```

### `components/GlassSceneClient.tsx`
```tsx
'use client'

import dynamic from 'next/dynamic'

const GlassScene = dynamic(() => import('./GlassScene'), { ssr: false })

export default function GlassSceneClient({ videoUrl }: { videoUrl: string }) {
  return <GlassScene videoUrl={videoUrl} />
}
```

**Critical rules:**
- Both files must have `'use client'` — WebGL/video cannot run on the server
- The `dynamic(..., { ssr: false })` wrapper is required in Next.js App Router
- Canvas gets `position: absolute, inset: 0, z-index: 0`
- All HTML content gets `position: relative, z-index: 10`

---

## Step 6 — Write `page.tsx`

### Color system (strict grayscale — never add brand colors to glass)
```
text-white          → primary headings
text-white/80       → secondary text, card titles
text-white/60       → descriptions, labels
text-white/50       → muted / timestamps / captions
bg-white/15         → primary icon/button backgrounds
bg-white/10         → secondary backgrounds
bg-white/30         → dividers
bg-neutral-900      → page background fallback (always set this)
```

### Typography scale (exact values)
```
H1:           text-6xl lg:text-7xl font-medium tracking-[-0.05em]
Card titles:  text-sm font-medium
Labels:       text-xs uppercase tracking-widest
Descriptions: text-xs leading-relaxed
```

### Layout skeleton
```tsx
<main className="relative min-h-screen overflow-hidden bg-neutral-900"
  style={{ fontFamily: 'var(--font-poppins)' }}>

  {/* Layer 0: video background */}
  <GlassSceneClient videoUrl={VIDEO_URL} />

  {/* Layer 1: two-panel layout */}
  <div className="relative z-10 flex min-h-screen">

    {/* LEFT PANEL */}
    <div className="relative w-full lg:w-[52%] flex flex-col min-h-screen">
      {/* Full-panel glass overlay */}
      <div className="glass-panel absolute inset-4 lg:inset-6 rounded-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative flex flex-col min-h-screen px-10 py-8">
        {/* Nav */}
        <nav className="flex items-center justify-between">
          <span className="text-white font-medium">{BRAND_NAME}</span>
          <div className="glass-pill rounded-full px-4 py-2 flex gap-4">
            {/* nav links */}
          </div>
        </nav>

        {/* Hero — vertically centered */}
        <div className="flex-1 flex flex-col items-start justify-center gap-6">
          {/* Tag pills */}
          <div className="flex gap-2">
            {TAG_PILLS.map(tag => (
              <span key={tag} className="glass-pill rounded-full px-3 py-1 text-xs text-white/70 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>

          {/* H1 with serif italic accent */}
          <h1 className="text-6xl lg:text-7xl font-medium tracking-[-0.05em] text-white leading-tight">
            {/* Wrap accent words in: */}
            {/* <em style={{ fontFamily: 'var(--font-source-serif)', fontStyle: 'italic' }}>word</em> */}
          </h1>

          {/* Tagline */}
          <p className="text-white/60 text-lg max-w-sm">{TAGLINE}</p>

          {/* CTA */}
          <button className="glass-pill rounded-full px-6 py-3 text-white font-medium flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
            <span className="rounded-full bg-white/15 w-6 h-6 flex items-center justify-center">
              {/* icon */}
            </span>
            {CTA_LABEL}
          </button>
        </div>

        {/* Footer quote */}
        {BOTTOM_QUOTE && (
          <footer className="border-t border-white/30 pt-4">
            <p className="text-white/50 text-xs">
              <em style={{ fontFamily: 'var(--font-source-serif)', fontStyle: 'italic' }}>
                "{BOTTOM_QUOTE.text}"
              </em>
              {' '}— {BOTTOM_QUOTE.attribution}
            </p>
          </footer>
        )}
      </div>
    </div>

    {/* RIGHT PANEL — desktop only */}
    <div className="hidden lg:flex w-[48%] flex-col p-6 gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="glass-pill rounded-full px-4 py-2 flex gap-3">
          {/* social links: transition-colors hover:text-white/80 (not scale) */}
        </div>
        <div className="glass-pill rounded-full px-4 py-2 text-xs text-white/60">
          {/* secondary label/pill */}
        </div>
      </div>

      {/* Community or stats card */}
      <div className="glass-card rounded-2xl p-4 w-56">
        {/* community/stats content */}
      </div>

      {/* Feature cards — pushed to bottom */}
      <div className="mt-auto">
        <div className="glass-panel rounded-[2.5rem] p-6">
          {/* 2-column inner cards */}
          <div className="grid grid-cols-2 gap-3">
            {RIGHT_PANEL_CARDS.map(card => (
              <div key={card.title} className="glass-card rounded-2xl p-4 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                <div className="rounded-full bg-white/15 w-8 h-8 flex items-center justify-center mb-3">
                  {card.icon}
                </div>
                <p className="text-white/80 text-sm font-medium">{card.title}</p>
                <p className="text-white/50 text-xs leading-relaxed mt-1">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  </div>
</main>
```

---

## Step 7 — Apply Micro-interactions (No Exceptions)

Apply to **every** interactive element. Missing these degrades perceived quality.

| Element type | Classes |
|---|---|
| Buttons, cards, pills | `transition-transform hover:scale-105 active:scale-95 cursor-pointer` |
| Social/text links | `transition-colors hover:text-white/80` (not scale) |
| Icon containers | `rounded-full bg-white/15 flex items-center justify-center` |

---

## Step 8 — Verify

```bash
npx tsc --noEmit
npm run dev
```

**Mental checklist before shipping:**
- [ ] Video loads and fills the viewport (object-cover behavior)
- [ ] All three glass tiers are visually distinct (blur depth visible)
- [ ] No color in the UI — everything is white + opacity
- [ ] Hover scales work on every interactive element
- [ ] Right panel is hidden on mobile (`hidden lg:flex`)
- [ ] `npx tsc --noEmit` exits with zero errors
- [ ] `::before` border shimmer visible on glass panels (top-left lighter than bottom-right)

---

## Design Philosophy (Reference)

> The video provides all color. The glass panels stay achromatic. This constraint is what makes the design feel premium — the panels become windows, not surfaces.

Six dimensions that define Bloom-quality glass UI:

| Dimension | Rule |
|-----------|------|
| Glass tiers | 3 named tiers: panel / card / pill — never invent new values |
| Border technique | `::before` + `padding: 1px` + `mask-composite: exclude` — never use `border` |
| Color constraint | Strict grayscale — the video provides all color |
| Font strategy | Poppins for all structure; Source Serif 4 italic for h1 accent + quote only |
| Opacity hierarchy | white → /80 → /60 → /50 (text); /15 → /10 (bg); /30 (dividers) |
| Micro-interactions | `hover:scale-105 active:scale-95` on every interactive element, always |
