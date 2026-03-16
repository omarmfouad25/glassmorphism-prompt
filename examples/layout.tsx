import { Poppins, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

/**
 * Font setup for liquid-glass-ui
 *
 * Two fonts. Two strict roles:
 *   Poppins         → ALL structure: headings, UI, labels, nav, descriptions, buttons
 *   Source Serif 4  → italic accent ONLY: 1–3 words in the h1, and the pull quote
 *
 * Source Serif 4 italic should appear sparingly. Its power comes from rarity.
 * If it's used everywhere, it loses all contrast.
 */

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Your Brand',
  description: 'Your tagline here',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Both font CSS variables are applied to <html>
    // Use them via: style={{ fontFamily: 'var(--font-poppins)' }}
    //           or: style={{ fontFamily: 'var(--font-source-serif)', fontStyle: 'italic' }}
    <html lang="en" className={`${poppins.variable} ${sourceSerif4.variable}`}>
      <body>{children}</body>
    </html>
  )
}
