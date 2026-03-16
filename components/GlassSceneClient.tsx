'use client'

import dynamic from 'next/dynamic'

/**
 * GlassSceneClient
 * SSR-safe wrapper for GlassScene. Required for Next.js App Router.
 *
 * @react-three/fiber uses browser-only APIs (WebGL, canvas, requestAnimationFrame).
 * The `ssr: false` option prevents Next.js from attempting to render it on the server,
 * which would fail at build time or during static generation.
 *
 * Always import THIS component in your pages/layouts, not GlassScene directly.
 */
const GlassScene = dynamic(() => import('./GlassScene'), { ssr: false })

export default function GlassSceneClient({ videoUrl }: { videoUrl: string }) {
  return <GlassScene videoUrl={videoUrl} />
}
