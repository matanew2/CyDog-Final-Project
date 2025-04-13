"use client"

import { type ReactNode, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/navigation/sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (!authLoading && user) {
      // Simulate page loading for smoother transitions
      const timer = setTimeout(() => {
        setPageLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [user, authLoading, router])

  if (authLoading || pageLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-teal-800 to-teal-900 dark:from-teal-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg font-medium text-white"
          >
            Loading Cydog...
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex h-screen overflow-hidden ${theme === "dark" ? "bg-gradient-to-br from-teal-950 to-slate-900" : "bg-gradient-to-br from-teal-800 to-teal-900"}`}
    >
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={Math.random()} // Force re-render on route change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
