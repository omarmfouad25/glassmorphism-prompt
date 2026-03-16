/**
 * liquid-glass-ui — Two-Panel Hero Layout
 * ========================================
 * Replace all CAPS_PLACEHOLDER values with your content.
 *
 * Layer system:
 *   z-0  GlassSceneClient  (absolute, fills screen — the video)
 *   z-10 Layout content    (relative — all HTML on top of video)
 *
 * Panel structure:
 *   Left  (w-full → lg:w-[52%]) — primary content: nav, h1, CTA, quote
 *   Right (hidden → lg:flex w-[48%]) — secondary: social, stats, feature cards
 */

import GlassSceneClient from '@/components/GlassSceneClient'
import { ArrowRight, Github, Twitter, Linkedin, Sparkles, Users, Zap, Shield } from 'lucide-react'

// ── Configuration — replace these with your brief ──────────────────────────

const VIDEO_URL = '/your-background-video.mp4'
const BRAND_NAME = 'Brand'
const TAGLINE = 'The future, beautifully made.'

// Words wrapped in <em> get Source Serif 4 italic treatment
const TAG_PILLS = ['Design', 'Motion', 'Code']
const CTA_LABEL = 'Get Started'

const BOTTOM_QUOTE = {
  text: 'The best design is the one you don\'t notice.',
  attribution: 'Someone wise',
}

const RIGHT_PANEL_CARDS = [
  {
    title: 'Performance',
    description: 'Built for speed from the ground up.',
    icon: <Zap className="w-4 h-4 text-white/70" />,
  },
  {
    title: 'Security',
    description: 'Enterprise-grade from day one.',
    icon: <Shield className="w-4 h-4 text-white/70" />,
  },
  {
    title: 'Community',
    description: 'Join thousands of creators.',
    icon: <Users className="w-4 h-4 text-white/70" />,
  },
  {
    title: 'AI-Powered',
    description: 'Intelligent tools that learn with you.',
    icon: <Sparkles className="w-4 h-4 text-white/70" />,
  },
]

// ── Component ───────────────────────────────────────────────────────────────

export default function HeroPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-neutral-900"
      style={{ fontFamily: 'var(--font-poppins)' }}
    >
      {/* ── Layer 0: Video Background ── */}
      <GlassSceneClient videoUrl={VIDEO_URL} />

      {/* ── Layer 1: Two-Panel Layout ── */}
      <div className="relative z-10 flex min-h-screen">

        {/* ════════════════════════════════════════
            LEFT PANEL
            Full-width on mobile, 52% on desktop
        ════════════════════════════════════════ */}
        <div className="relative w-full lg:w-[52%] flex flex-col min-h-screen">

          {/* Glass overlay — pointer-events-none so it doesn't block clicks */}
          <div className="glass-panel absolute inset-4 lg:inset-6 rounded-3xl pointer-events-none" />

          {/* Content layer — relative so it sits on top of the glass overlay */}
          <div className="relative flex flex-col min-h-screen px-10 py-8">

            {/* ── Nav ── */}
            <nav className="flex items-center justify-between">
              <span className="text-white font-medium text-sm tracking-wide">
                {BRAND_NAME}
              </span>

              <div className="glass-pill rounded-full px-4 py-2 flex items-center gap-5">
                {['Product', 'Docs', 'Pricing'].map(item => (
                  <a
                    key={item}
                    href="#"
                    className="text-white/60 text-xs transition-colors hover:text-white/80"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </nav>

            {/* ── Hero — vertically centered ── */}
            <div className="flex-1 flex flex-col items-start justify-center gap-6">

              {/* Tag pills */}
              <div className="flex flex-wrap gap-2">
                {TAG_PILLS.map(tag => (
                  <span
                    key={tag}
                    className="glass-pill rounded-full px-3 py-1 text-xs text-white/70 uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* H1 — serif italic on accent word(s) only */}
              <h1 className="text-6xl lg:text-7xl font-medium tracking-[-0.05em] text-white leading-tight max-w-lg">
                Build{' '}
                <em style={{ fontFamily: 'var(--font-source-serif)', fontStyle: 'italic' }}>
                  beautiful
                </em>{' '}
                products faster
              </h1>

              {/* Tagline */}
              <p className="text-white/60 text-lg max-w-sm leading-relaxed">
                {TAGLINE}
              </p>

              {/* CTA button */}
              <button className="glass-pill rounded-full px-6 py-3 text-white font-medium flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                <span className="rounded-full bg-white/15 w-6 h-6 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </span>
                {CTA_LABEL}
              </button>
            </div>

            {/* ── Footer quote ── */}
            <footer className="border-t border-white/30 pt-4">
              <p className="text-white/50 text-xs">
                <em style={{ fontFamily: 'var(--font-source-serif)', fontStyle: 'italic' }}>
                  &ldquo;{BOTTOM_QUOTE.text}&rdquo;
                </em>
                {' '}— {BOTTOM_QUOTE.attribution}
              </p>
            </footer>
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT PANEL
            Hidden on mobile, 48% on desktop
        ════════════════════════════════════════ */}
        <div className="hidden lg:flex w-[48%] flex-col p-6 gap-4">

          {/* ── Top bar ── */}
          <div className="flex items-center justify-between">
            {/* Social links — hover changes color, not scale */}
            <div className="glass-pill rounded-full px-4 py-2 flex items-center gap-4">
              {[
                { icon: <Github className="w-4 h-4" />, href: '#' },
                { icon: <Twitter className="w-4 h-4" />, href: '#' },
                { icon: <Linkedin className="w-4 h-4" />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="text-white/60 transition-colors hover:text-white/80"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="glass-pill rounded-full px-4 py-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-white/50" />
              <span className="text-xs text-white/60 uppercase tracking-widest">v2.0</span>
            </div>
          </div>

          {/* ── Community card ── */}
          <div className="glass-card rounded-2xl p-4 w-56">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/60 uppercase tracking-widest">Community</span>
            </div>
            <p className="text-white font-medium text-2xl">12,400+</p>
            <p className="text-white/50 text-xs mt-1">creators building with us</p>
          </div>

          {/* ── Feature cards — pushed to bottom ── */}
          <div className="mt-auto">
            <div className="glass-panel rounded-[2.5rem] p-6">
              <p className="text-xs text-white/50 uppercase tracking-widest mb-4">
                Everything you need
              </p>

              <div className="grid grid-cols-2 gap-3">
                {RIGHT_PANEL_CARDS.map(card => (
                  <div
                    key={card.title}
                    className="glass-card rounded-2xl p-4 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <div className="rounded-full bg-white/15 w-8 h-8 flex items-center justify-center mb-3">
                      {card.icon}
                    </div>
                    <p className="text-white/80 text-sm font-medium">{card.title}</p>
                    <p className="text-white/50 text-xs leading-relaxed mt-1">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
