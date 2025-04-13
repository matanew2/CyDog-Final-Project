"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features")
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const slides = [
    {
      title: "Elevate Your Dog Handling Experience",
      description: "Real-time communication and tracking for professional dog handlers",
      cta: "Get Started",
    },
    {
      title: "Seamless Dog-Handler Communication",
      description: "Voice commands, live video, and location tracking in one platform",
      cta: "Try CyDog",
    },
    {
      title: "Trusted by Professional Handlers",
      description: "Join thousands of satisfied customers who rely on CyDog every day",
      cta: "Join Now",
      stats: {
        value: "98%",
        label: "Customer Satisfaction",
      },
    },
  ]

  return (
    <section className="relative pt-32 md:pt-40 pb-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tighter text-white dark:text-white">
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p className="text-xl md:text-2xl text-white/80 dark:text-white/80 mb-10 max-w-3xl mx-auto">
              {slides[currentSlide].description}
            </motion.p>

            {slides[currentSlide].stats && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-10 flex justify-center"
              >
                <div className="relative h-32 w-64 md:w-80">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 dark:from-teal-600 dark:to-teal-800 rounded-2xl opacity-20 blur-xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl font-bold mb-2">{slides[currentSlide].stats.value}</div>
                      <div className="text-xl">{slides[currentSlide].stats.label}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-500 dark:hover:bg-teal-600 rounded-full px-8 py-6 text-lg font-semibold">
                  {slides[currentSlide].cta}
                  <ChevronDown className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold"
                >
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="flex justify-center mt-12 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-white w-8" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll down indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
            onClick={scrollToFeatures}
          >
            <ChevronDown className="h-6 w-6" />
            <span className="sr-only">Scroll down</span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
