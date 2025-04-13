"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait for component to be mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 text-white/80">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 text-white/80 hover:text-white dark:text-white/80 dark:hover:text-white"
    >
      <motion.div
        initial={{ opacity: 0, rotate: -30 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {theme === "dark" ? <Moon className="h-5 w-5 transition-all" /> : <Sun className="h-5 w-5 transition-all" />}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
