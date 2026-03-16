'use client'

import { useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useVideoTexture } from '@react-three/drei'
import * as THREE from 'three'

/**
 * VideoPlane
 * Renders a video texture on a plane mesh using object-cover scaling math.
 * The plane always fills the entire viewport without letterboxing.
 */
function VideoPlane({ url }: { url: string }) {
  const texture = useVideoTexture(url, { loop: true, muted: true, start: true })
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  // object-cover: scale the plane to fill the viewport while preserving video aspect ratio
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

/**
 * GlassScene
 * Three.js canvas that renders the video background.
 *
 * IMPORTANT: Do not import this component directly in Server Components.
 * Use GlassSceneClient.tsx (the dynamic SSR-safe wrapper) instead.
 *
 * z-index: 0 — all HTML content should be z-index: 10 (relative)
 */
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
