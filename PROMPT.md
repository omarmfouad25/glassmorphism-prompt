# The Liquid Glass UI Prompt

A standalone, annotated prompt that encodes all six design dimensions of the liquid-glass-ui system. Drop this into Claude (or any capable AI assistant) with your project brief to reproduce premium glassmorphism results.

---

## How to Use

1. Fill in the **Parameters** table below with your project details
2. Copy everything inside the `--- START PROMPT ---` / `--- END PROMPT ---` markers
3. Paste it into a new conversation, followed by your specific brief
4. The AI will build your hero section using the exact techniques in this repo

Works with: Claude, GPT-4o, Gemini, or any LLM with strong coding ability.

---

## Parameters (fill in before sending)

| Parameter | Your Value | Default if left blank |
|-----------|------------|----------------------|
| `BRAND_NAME` | | "Brand" |
| `HERO_HEADING` | | "Build something beautiful" |
| `HEADING_ACCENT_WORDS` | Which word(s) get serif italic | First noun phrase |
| `TAGLINE` | Short line below h1 | "The future, beautifully made." |
| `CTA_LABEL` | Button text | "Get Started" |
| `TAG_PILLS` | 2–4 short labels | Design, Motion, Code |
| `BACKGROUND_URL` | Video (.mp4) or image URL | `bg-neutral-900` fallback |
| `BOTTOM_QUOTE` | Pull quote + attribution (optional) | Omit |
| `RIGHT_PANEL_CARDS` | Array of cards: title, description | 2–3 generic feature cards |

---

--- START PROMPT ---

You are building a premium glassmorphism hero section. Follow this system exactly — do not simplify or deviate from the specified values. Every value was chosen deliberately.

## Stack

- Next.js 14+ (App Router)
- Tailwind CSS 3+
- Three.js + @react-three/fiber + @react-three/drei (for video background)
- Poppins + Source Serif 4 (via next/font/google)
- lucide-react for icons

Before writing files, confirm Three.js is installed. If not:
```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

---

## Rule 1 — The 3-Tier Glass System (CSS)

Inject this block under `@layer components` in globals.css. Do not alter any values.

```css
@layer components {

  .glass-panel, .glass-card, .glass-pill {
    position: relative;
    overflow: hidden;
  }

  .glass-panel::before,
  .glass-card::before,
  .glass-pill::before {
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

  /* PANEL — heavy (page overlays, feature sections) */
  .glass-panel {
    background: rgba(0,0,0,0.35);
    backdrop-filter: blur(60px) saturate(180%);
    -webkit-backdrop-filter: blur(60px) saturate(180%);
    box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .glass-panel::before {
    background: linear-gradient(160deg,
      rgba(255,255,255,0.5)  0%,
      rgba(255,255,255,0.15) 30%,
      transparent            55%,
      rgba(255,255,255,0.08) 100%
    );
  }

  /* CARD — medium (nested inside panels) */
  .glass-card {
    background: rgba(0,0,0,0.28);
    backdrop-filter: blur(30px) saturate(160%);
    -webkit-backdrop-filter: blur(30px) saturate(160%);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.16);
  }
  .glass-card::before {
    background: linear-gradient(145deg,
      rgba(255,255,255,0.38) 0%,
      rgba(255,255,255,0.1)  35%,
      transparent            60%,
      rgba(255,255,255,0.06) 100%
    );
  }

  /* PILL — light (buttons, tags, nav items) */
  .glass-pill {
    background: rgba(0,0,0,0.22);
    backdrop-filter: blur(16px) saturate(150%);
    -webkit-backdrop-filter: blur(16px) saturate(150%);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
  }
  .glass-pill::before {
    background: linear-gradient(135deg,
      rgba(255,255,255,0.4)  0%,
      rgba(255,255,255,0.08) 40%,
      transparent            70%
    );
  }

}
```

**Why this exact structure:**
The `::before` pseudo-element + `padding: 1px` + `mask-composite: exclude` creates a gradient border without using the `border` property. The XOR operation reveals only the 1px padding strip, not the content box. This produces a physically accurate light-from-top-left shimmer that a flat `border` cannot achieve.

Never invent new glass values. Pick one of the three tiers. The visual contrast between tiers is what creates perceived depth.

---

## Rule 2 — Video Background (Two-File Pattern)

**Why two files:** `@react-three/fiber` uses browser APIs (canvas, WebGL, requestAnimationFrame) that crash during SSR. The `dynamic(..., { ssr: false })` wrapper is non-negotiable in Next.js App Router.

### components/GlassScene.tsx
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

  // object-cover math: fill viewport while preserving 16:9 aspect ratio
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

### components/GlassSceneClient.tsx
```tsx
'use client'

import dynamic from 'next/dynamic'

const GlassScene = dynamic(() => import('./GlassScene'), { ssr: false })

export default function GlassSceneClient({ videoUrl }: { videoUrl: string }) {
  return <GlassScene videoUrl={videoUrl} />
}
```

---

## Rule 3 — Color Constraint (Strict Grayscale)

**Why:** When panels have color, they compete with the background. When they stay achromatic, they become windows — depth comes from the video, not the UI.

Never add brand colors, tinted backgrounds, or colored text to any glass element.

```
text-white          → primary headings
text-white/80       → secondary text, card titles
text-white/60       → descriptions, labels
text-white/50       → muted, timestamps, captions

bg-white/15         → primary icon/button backgrounds
bg-white/10         → secondary element backgrounds
bg-white/30         → dividers and separators

bg-neutral-900      → page background fallback — always set this
```

---

## Rule 4 — Typography (Two Fonts, Two Roles)

**Why:** Source Serif 4 italic is powerful because it appears rarely — two or three words maximum on the entire page. Overuse destroys the effect.

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

- Poppins → everything: headings, UI, labels, descriptions
- Source Serif 4 italic → accent words in `<h1>` only + the pull quote footer
- `<em style={{ fontFamily: 'var(--font-source-serif)', fontStyle: 'italic' }}>word</em>`

Type scale (exact values):
```
H1:           text-6xl lg:text-7xl font-medium tracking-[-0.05em]
Card titles:  text-sm font-medium
Labels:       text-xs uppercase tracking-widest
Descriptions: text-xs leading-relaxed
```

---

## Rule 5 — Layout Architecture

```tsx
<main className="relative min-h-screen overflow-hidden bg-neutral-900"
  style={{ fontFamily: 'var(--font-poppins)' }}>

  {/* z-index 0: full-screen video background */}
  <GlassSceneClient videoUrl={VIDEO_URL} />

  {/* z-index 10: two-panel layout */}
  <div className="relative z-10 flex min-h-screen">

    {/* LEFT PANEL — full height, glass overlay */}
    <div className="relative w-full lg:w-[52%] flex flex-col min-h-screen">
      <div className="glass-panel absolute inset-4 lg:inset-6 rounded-3xl pointer-events-none" />
      <div className="relative flex flex-col min-h-screen px-10 py-8">
        <nav>...</nav>
        <div className="flex-1 flex flex-col items-start justify-center gap-6">
          {/* tag pills, h1, tagline, CTA */}
        </div>
        <footer>...</footer>
      </div>
    </div>

    {/* RIGHT PANEL — desktop only */}
    <div className="hidden lg:flex w-[48%] flex-col p-6 gap-4">
      {/* top bar (glass-pill), community card (glass-card) */}
      <div className="mt-auto">
        <div className="glass-panel rounded-[2.5rem] p-6">
          <div className="grid grid-cols-2 gap-3">
            {/* feature cards (glass-card) */}
          </div>
        </div>
      </div>
    </div>

  </div>
</main>
```

**Critical:** The glass-panel `div` gets `pointer-events-none` — it sits as a visual overlay above the content layer. The content `div` sits on top via `relative` positioning.

---

## Rule 6 — Micro-interactions (No Exceptions)

**Why:** `active:scale-95` is as important as `hover:scale-105` — it provides tactile feedback on click. Without it the interaction feels half-finished.

Apply to **every** interactive element. Not optional.

| Element | Classes |
|---------|---------|
| Buttons, cards, pills | `transition-transform hover:scale-105 active:scale-95 cursor-pointer` |
| Text links, social icons | `transition-colors hover:text-white/80` (not scale) |
| Icon containers | `rounded-full bg-white/15 flex items-center justify-center` |

---

## Verification Checklist

Before finishing, confirm:

- [ ] Video loads and fills viewport (object-cover behavior verified)
- [ ] All three glass tiers are visually distinct — blur depth is visible
- [ ] Zero color in the UI — everything is white + opacity
- [ ] Hover/active scales work on every interactive element
- [ ] Right panel is hidden on mobile (`hidden lg:flex`)
- [ ] `::before` shimmer visible: top-left lighter than bottom-right
- [ ] `npx tsc --noEmit` exits with zero errors

---

## My Brief

[Paste your brief here after the prompt, including BRAND_NAME, HERO_HEADING, BACKGROUND_URL, and any other parameters from the table above.]

--- END PROMPT ---

---

## Why Each Dimension Matters

**Glass tiers** — Three named levels mean every element has an unambiguous depth. When everything is the same blur, nothing reads as foreground or background. Tier contrast is what creates hierarchy.

**The XOR border** — A plain `border: 1px solid rgba(255,255,255,0.2)` is uniform. The gradient border mimics how light wraps a physical glass edge — brighter where the light source hits, fading where it doesn't. This single technique accounts for roughly half of the perceived premium quality.

**Grayscale constraint** — Every color your eye sees in the glass panels is actually a reflection of the video behind them. This is exactly how real glass behaves. Violating this by tinting panels makes them feel like opaque rectangles, not glass.

**Serif scarcity** — The Source Serif 4 italic has impact because it appears 2–3 times on the entire page. Use it for 10 words and it becomes decoration. Use it for 2 and it becomes the thing your eye goes to first.

**Opacity ladder** — Four text opacities, three background opacities. The table is rigid. Without it, designers "eyeball" values and end up with 7–10 slightly different opacities that produce visual noise instead of hierarchy.

**Scale micro-interactions** — `scale-105/95` at 150ms feels physical. It's the digital equivalent of a button that depresses when pressed. Most glassmorphism UIs are purely visual — adding the tactile layer elevates the experience category from "pretty design" to "designed product."
