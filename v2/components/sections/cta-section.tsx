"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-teal-800/30 dark:bg-teal-900/30 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-teal-700/30 dark:border-teal-700/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-white">
                Ready to Transform Dog Handling?
              </h2>
              <p className="text-white/80 dark:text-white/80 mb-6">
                Join professional handlers worldwide who use CyDog to enhance communication, coordination, and
                performance with their dogs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button className="bg-teal-500 hover:bg-teal-600 text-white dark:bg-teal-500 dark:hover:bg-teal-600 rounded-full px-8 py-6 text-lg font-semibold">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 dark:border-white dark:text-white dark:hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold"
                  >
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <div className="relative h-64 w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-600 dark:from-teal-600 dark:to-teal-800 rounded-2xl opacity-20 blur-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white dark:text-white text-center">
                    <div className="text-5xl font-bold mb-2">98%</div>
                    <div className="text-xl">Customer Satisfaction</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
