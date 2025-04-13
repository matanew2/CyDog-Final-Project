"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { useAuth } from "@/components/auth/auth-provider"
import { useTheme } from "next-themes"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { theme } = useTheme()

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? theme === "dark"
            ? "bg-slate-900/70 backdrop-blur-lg shadow-md"
            : "bg-white/10 backdrop-blur-lg shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo className="h-8 md:h-10 w-auto text-white dark:text-white" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/10"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={logout}
                  className="bg-white/20 hover:bg-white/30 text-white dark:bg-white/20 dark:hover:bg-white/30 dark:text-white border border-white/20 dark:border-white/20 rounded-full px-6"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-500 dark:hover:bg-teal-600 rounded-full px-6">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              className="text-white dark:text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gradient-to-b from-teal-600/90 to-teal-800/90 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <MobileNavLinks closeMenu={() => setIsOpen(false)} />
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-white/10 hover:bg-white/20 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="w-full bg-white/20 hover:bg-white/30 text-white dark:bg-white/20 dark:hover:bg-white/30 dark:text-white"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-white/10 hover:bg-white/20 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-600 dark:hover:bg-teal-700">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// Desktop navigation links
function NavLinks() {
  const links = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-white/80 dark:text-white/80 hover:text-white dark:hover:text-white transition-colors duration-200 font-medium"
        >
          {link.name}
        </Link>
      ))}
    </>
  )
}

// Mobile navigation links
function MobileNavLinks({ closeMenu }: { closeMenu: () => void }) {
  const links = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-white/90 dark:text-white/90 hover:text-white dark:hover:text-white py-2 text-lg font-medium"
          onClick={closeMenu}
        >
          {link.name}
        </Link>
      ))}
    </>
  )
}
