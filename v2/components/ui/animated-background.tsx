"use client"

import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

// Enhanced floating paths with more dynamic animation
export function AnimatedBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait for theme to be available
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingPaths position={1} theme={theme} />
      <FloatingPaths position={-1} theme={theme} />
      <FloatingParticles theme={theme} />
      <GlowingOrbs theme={theme} />
    </div>
  )
}

// Enhanced floating paths component
function FloatingPaths({ position, theme }: { position: number; theme?: string }) {
  // Reduced number of paths for better performance
  const paths = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={theme === "dark" ? 0.03 + path.id * 0.01 : 0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Floating particles component for enhanced background
function FloatingParticles({ theme }: { theme?: string }) {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 30,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${theme === "dark" ? "bg-teal-500/10" : "bg-white/30"}`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 1, 1, 0],
            scale: [0, 1, 1.5, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// New glowing orbs component for enhanced visual effect
function GlowingOrbs({ theme }: { theme?: string }) {
  const orbs = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: 100 + Math.random() * 200,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 60 + Math.random() * 60,
    delay: Math.random() * 10,
    color:
      theme === "dark"
        ? i % 2 === 0
          ? "rgba(20, 184, 166, 0.05)"
          : "rgba(56, 189, 248, 0.05)"
        : i % 2 === 0
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(255, 255, 255, 0.15)",
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            backgroundColor: orb.color,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
