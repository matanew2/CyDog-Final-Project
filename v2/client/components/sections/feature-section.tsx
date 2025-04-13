"use client"

import { motion } from "framer-motion"

export function FeatureSection() {
  const features = [
    {
      title: "Voice Command Service",
      description:
        "Send clear voice commands to your dog in real-time, enhancing communication and training effectiveness.",
      icon: "🔊",
    },
    {
      title: "Real-Time Location Service",
      description:
        "Track your dog's precise location with GPS technology, ensuring safety and coordination during operations.",
      icon: "📍",
    },
    {
      title: "Live Video Feed",
      description:
        "See what your dog sees with our high-quality video streaming, providing crucial visual information.",
      icon: "📹",
    },
    {
      title: "Task Management",
      description: "Organize, schedule, and monitor training sessions and assignments for optimal performance.",
      icon: "📋",
    },
  ]

  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-white"
          >
            Comprehensive Dog Management System
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/80 dark:text-white/80 max-w-2xl mx-auto"
          >
            CyDog enhances real-time remote communication between handlers and their dogs through our integrated
            platform
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-teal-800/30 dark:bg-teal-900/30 backdrop-blur-md rounded-2xl p-6 border border-teal-700/30 dark:border-teal-700/20 hover:bg-teal-700/30 dark:hover:bg-teal-800/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white dark:text-white">{feature.title}</h3>
              <p className="text-white/70 dark:text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
