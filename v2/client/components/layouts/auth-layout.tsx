"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { AnimatedBackground } from "@/components/ui/animated-background"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600 via-orange-400 to-teal-400 dark:from-purple-900 dark:via-orange-700 dark:to-teal-700 p-4">
      <AnimatedBackground />

      <div className="absolute right-4 top-4 z-50 flex items-center gap-4">
        <ThemeToggle />
        <Link
          href="/"
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
        >
          Back to Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl dark:bg-black/20"
      >
        <div className="mb-8 flex justify-center">
          <Logo className="h-10 w-auto text-white" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <h1 className="mb-2 text-center text-3xl font-bold text-white">{title}</h1>
          <p className="mb-8 text-center text-white/80">{subtitle}</p>

          {children}
        </motion.div>
      </motion.div>
    </div>
  )
}
