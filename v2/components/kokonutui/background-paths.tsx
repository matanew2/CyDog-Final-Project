"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-mobile"

// FloatingPaths component with improved performance
function FloatingPaths({ position }: { position: number }) {
  // Reduced number of paths for better performance
  const paths = Array.from({ length: 24 }, (_, i) => ({
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
            strokeOpacity={0.1 + path.id * 0.03}
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

// SVG Logo Component
const Logo = ({ className = "" }: { className?: string }) => (
  <svg
    width="162"
    height="52"
    viewBox="0 0 162 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M68.5796 38.7965C69.9361 39.373 71.496 39.6613 73.2595 39.6613C75.1586 39.6613 76.8033 39.3391 78.1937 38.6948C79.618 38.0165 80.7202 37.1687 81.5002 36.1513H81.6019L81.0932 39H91.3178L98.0833 0.543396H86.7396L84.2979 14.5831H84.1962C83.891 14.1422 83.4841 13.7353 82.9754 13.3623C82.4667 12.9892 81.9071 12.684 81.2967 12.4466C80.6863 12.1753 80.0419 11.9719 79.3637 11.8362C78.6855 11.7006 78.0242 11.6327 77.3798 11.6327C75.2434 11.6327 73.2595 12.0736 71.4282 12.9553C69.5969 13.837 68.02 15.024 66.6974 16.5161C65.3749 18.0082 64.3405 19.7717 63.5945 21.8064C62.8484 23.8073 62.4754 25.9437 62.4754 28.2159C62.4754 29.8097 62.6958 31.3019 63.1367 32.6923C63.6114 34.0827 64.3066 35.3035 65.2223 36.3548C66.1379 37.3722 67.257 38.1861 68.5796 38.7965ZM74.5821 29.335C73.9038 28.5889 73.5647 27.6733 73.5647 26.5881C73.5647 25.7742 73.6834 25.0281 73.9208 24.3499C74.1582 23.6377 74.4973 23.0103 74.9381 22.4677C75.4129 21.9251 75.9725 21.5012 76.6168 21.196C77.2611 20.8908 77.9902 20.7382 78.8041 20.7382C80.0928 20.7382 81.0763 21.1112 81.7545 21.8573C82.4667 22.5695 82.8228 23.4851 82.8228 24.6042C82.8228 25.3842 82.6871 26.1302 82.4158 26.8424C82.1784 27.5546 81.8223 28.1819 81.3476 28.7245C80.9067 29.2671 80.3641 29.691 79.7198 29.9963C79.1094 30.3015 78.4142 30.4541 77.6342 30.4541C76.3116 30.4541 75.2942 30.081 74.5821 29.335ZM32.3191 34.8796C31.6069 35.4901 30.7761 36.1174 29.8265 36.7618C28.9109 37.3722 27.8596 37.9148 26.6727 38.3896C25.4858 38.8643 24.1462 39.2543 22.6541 39.5595C21.1958 39.8647 19.5681 40.0173 17.7707 40.0173C15.0577 40.0173 12.633 39.6443 10.4965 38.8982C8.39394 38.1522 6.59659 37.0839 5.10445 35.6935C3.64621 34.3031 2.52711 32.6245 1.74712 30.6575C0.96714 28.6906 0.577148 26.5033 0.577148 24.0955C0.577148 21.0095 1.10279 18.1269 2.15407 15.4479C3.23927 12.7688 4.74836 10.4288 6.68137 8.42801C8.61437 6.42719 10.9035 4.85026 13.5486 3.69724C16.1938 2.54422 19.0933 1.96771 22.2471 1.96771C25.3671 1.96771 28.114 2.45944 30.4878 3.4429C32.8617 4.39244 34.676 5.57938 35.9308 7.0037L27.7409 15.4479C27.1305 14.5661 26.3166 13.9218 25.2992 13.5149C24.3158 13.074 23.1967 12.8536 21.9419 12.8536C20.6533 12.8536 19.4833 13.1249 18.432 13.6675C17.3807 14.1762 16.482 14.8883 15.736 15.8039C14.9899 16.6857 14.4134 17.72 14.0064 18.9069C13.5995 20.0939 13.396 21.3656 13.396 22.7221C13.396 24.4855 13.9386 25.9776 15.0238 27.1985C16.1429 28.4193 17.8046 29.0298 20.0089 29.0298C21.2976 29.0298 22.5015 28.7585 23.6206 28.2159C24.7397 27.6733 25.7062 27.012 26.5201 26.232L32.3191 34.8796ZM39.083 38.6439L32.6736 12.2431H45.289L46.9168 26.8933H47.1202L53.3771 12.2431H65.5855L50.0706 40.6278C49.155 42.3234 48.2393 43.8155 47.3237 45.1042C46.442 46.4268 45.4416 47.5289 44.3225 48.4106C43.2034 49.3263 41.9147 50.0215 40.4565 50.4963C39.0321 50.971 37.3365 51.2084 35.3696 51.2084C34.1488 51.2084 33.0297 51.1236 32.0123 50.9541C30.9949 50.7845 30.1641 50.598 29.5197 50.3945L31.4527 41.3908C31.8597 41.5604 32.2836 41.696 32.7244 41.7977C33.1653 41.9334 33.6401 42.0012 34.1488 42.0012C35.4035 42.0012 36.37 41.7299 37.0483 41.1873C37.7604 40.6786 38.3369 40.0173 38.7778 39.2035L39.083 38.6439ZM110.619 39.8139C108.584 39.8139 106.685 39.5595 104.922 39.0508C103.158 38.5422 101.615 37.7791 100.293 36.7618C98.9699 35.7444 97.9356 34.4896 97.1895 32.9975C96.4435 31.5054 96.0704 29.7928 96.0704 27.8598C96.0704 25.6216 96.4435 23.502 97.1895 21.5012C97.9356 19.5004 99.0038 17.7539 100.394 16.2618C101.819 14.7696 103.548 13.5996 105.583 12.7518C107.651 11.8701 110.008 11.4293 112.654 11.4293C114.722 11.4293 116.655 11.6836 118.453 12.1923C120.25 12.701 121.81 13.464 123.132 14.4814C124.455 15.4987 125.489 16.7535 126.235 18.2456C127.015 19.7378 127.405 21.4503 127.405 23.3833C127.405 25.6216 127.032 27.7411 126.286 29.7419C125.54 31.7427 124.455 33.4892 123.031 34.9814C121.606 36.4735 119.843 37.6604 117.74 38.5422C115.672 39.39 113.298 39.8139 110.619 39.8139ZM134.433 38.1861C135.858 38.7287 137.502 39 139.367 39C140.181 39 140.944 38.9152 141.657 38.7456C142.403 38.5422 143.064 38.3048 143.64 38.0335C144.217 37.7283 144.726 37.4061 145.166 37.067C145.607 36.7279 145.963 36.4057 146.235 36.1005H146.387L146.133 37.423C146.031 38.1013 145.828 38.7287 145.523 39.3052C145.251 39.9156 144.844 40.4413 144.302 40.8821C143.759 41.3569 143.081 41.7299 142.267 42.0012C141.487 42.2725 140.52 42.4082 139.367 42.4082C138.079 42.4082 136.671 42.1369 135.145 41.5943C133.619 41.0517 132.314 40.2547 131.229 39.2035L125.836 47.0372C126.65 47.7154 127.583 48.3089 128.634 48.8176C129.719 49.3602 130.872 49.8011 132.093 50.1402C133.314 50.5132 134.569 50.7845 135.858 50.9541C137.18 51.1236 138.469 51.2084 139.724 51.2084C144.743 51.2084 148.71 50.0384 151.627 47.6985C154.543 45.3585 156.476 41.5604 157.426 36.3039L161.648 12.2431H150.915L150.457 15.1427H150.304C149.49 13.9218 148.388 13.0401 146.998 12.4975C145.641 11.921 144.319 11.6327 143.03 11.6327C140.826 11.6327 138.808 12.0736 136.977 12.9553C135.145 13.8031 133.568 14.9901 132.246 16.5161C130.957 18.0082 129.94 19.7547 129.194 21.7556C128.482 23.7564 128.126 25.8929 128.126 28.165C128.126 29.725 128.363 31.1662 128.838 32.4888C129.312 33.8114 130.008 34.9644 130.923 35.9479C131.873 36.8974 133.043 37.6435 134.433 38.1861ZM139.215 28.0124C139.113 27.5376 139.062 27.0967 139.062 26.6898C139.062 25.9776 139.181 25.2655 139.418 24.5533C139.656 23.8412 139.995 23.1968 140.436 22.6203C140.91 22.0438 141.47 21.586 142.114 21.2469C142.793 20.8738 143.573 20.6873 144.454 20.6873C145.709 20.6873 146.693 21.0264 147.405 21.7047C148.151 22.3829 148.524 23.3155 148.524 24.5025C148.524 25.2824 148.388 26.0455 148.117 26.7915C147.879 27.5037 147.523 28.148 147.049 28.7245C146.608 29.2671 146.048 29.725 145.37 30.098C144.726 30.4371 143.997 30.6067 143.183 30.6067C142.369 30.6067 141.69 30.488 141.148 30.2506C140.605 29.9793 140.181 29.6571 139.876 29.2841C139.571 28.9111 139.351 28.4872 139.215 28.0124Z"
      fill="currentColor"
    />
    <path
      d="M111.478 35.5097C111.177 35.3089 110.876 35.1332 110.6 34.9074C110.123 34.556 109.671 34.1796 109.194 33.8283C108.391 33.2009 107.463 32.7492 106.484 32.448C105.455 32.1469 104.476 31.7955 103.498 31.3438C103.096 31.1682 102.77 30.867 102.494 30.5157C102.218 30.1392 102.042 29.6875 102.017 29.2107C101.942 28.3826 102.117 27.5544 102.519 26.8266C102.82 26.2745 103.297 25.8479 103.849 25.5719C104.451 25.2707 105.104 25.0449 105.781 24.9194C106.986 24.6433 108.165 24.2418 109.27 23.7148C109.596 23.5391 109.922 23.3635 110.273 23.2129C110.976 22.8616 111.804 22.8616 112.532 23.1627C112.934 23.3133 113.285 23.5391 113.611 23.8152C114.063 24.2418 114.339 24.7939 114.389 25.3962C114.59 26.6761 114.916 27.9057 115.368 29.1103C115.644 29.8381 115.945 30.5659 116.196 31.3187C116.397 31.8708 116.472 32.448 116.397 33.0252C116.271 33.8032 115.92 34.5059 115.343 35.058C114.816 35.6101 114.113 35.9614 113.36 36.0367C113.059 36.0367 112.783 36.0116 112.482 35.9614C112.407 35.9614 112.306 35.9363 112.231 35.9112L111.478 35.5097Z"
      fill="#30D2C3"
    />
    <path
      d="M114.615 15.2576C114.791 15.4333 114.942 15.609 115.067 15.8097C115.368 16.2865 115.469 16.8637 115.393 17.4158C115.293 18.3695 114.866 19.2729 114.164 19.9254C113.737 20.3771 113.135 20.6532 112.507 20.6783C111.855 20.6783 111.253 20.3018 111.002 19.6995C110.701 18.9718 110.675 18.1687 110.952 17.4409C111.203 16.663 111.679 15.9603 112.357 15.4835C112.859 15.0569 113.536 14.9063 114.164 15.0569C114.189 15.0569 114.214 15.0569 114.214 15.0569L114.615 15.2576Z"
      fill="#30D2C3"
    />
    <path
      d="M109.069 20.9794C108.743 21.7072 108.14 22.3095 107.387 22.6106C106.484 23.0121 105.43 22.6106 105.028 21.7072C104.978 21.6068 104.953 21.5315 104.928 21.4311C104.677 20.603 104.752 19.7246 105.104 18.9467C105.355 18.3193 105.806 17.7672 106.358 17.3657C106.785 17.0394 107.312 16.8888 107.839 16.9641C108.467 17.0394 109.019 17.466 109.244 18.0683C109.646 18.9718 109.521 19.8752 109.169 20.7786C109.144 20.8288 109.119 20.9041 109.069 20.9794Z"
      fill="#30D2C3"
    />
    <path
      d="M115.694 19.8752C116.146 19.0219 116.874 18.3695 117.777 18.0432C118.279 17.8424 118.831 17.8424 119.333 18.0181C119.684 18.1436 119.96 18.3945 120.086 18.7459C120.588 19.9756 120.287 21.3809 119.333 22.2843C118.831 22.8114 118.179 23.1627 117.451 23.2882C116.472 23.4889 115.518 22.8364 115.318 21.8577C115.293 21.7072 115.268 21.5315 115.293 21.3809C115.293 20.8539 115.443 20.3269 115.694 19.8752Z"
      fill="#30D2C3"
    />
    <path
      d="M116.497 26.2745C116.949 25.4213 117.401 24.8441 118.104 24.4676C118.58 24.2167 119.132 24.1665 119.659 24.3171C119.91 24.3923 120.136 24.5429 120.287 24.7688C120.964 25.5216 121.165 26.5506 120.864 27.5042C120.688 28.1567 120.337 28.759 119.835 29.2358C119.082 29.9384 118.078 29.9886 117.225 29.4616C116.799 29.2107 116.472 28.8342 116.297 28.3574C116.171 27.981 116.121 27.5795 116.221 27.203C116.297 26.8517 116.447 26.4753 116.497 26.2745Z"
      fill="#30D2C3"
    />
  </svg>
)

// Navigation component with mobile responsiveness
function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [scrolled, setScrolled] = useState(false)

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
        scrolled ? "bg-white/10 backdrop-blur-lg shadow-md dark:bg-black/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo className="h-8 md:h-10 w-auto text-white" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/20 rounded-full px-6">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
            className="md:hidden bg-gradient-to-b from-purple-600/90 to-teal-500/90 backdrop-blur-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <MobileNavLinks closeMenu={() => setIsOpen(false)} />
                <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/20 rounded-full w-full">
                  Get Started
                </Button>
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
    { name: "Home", href: "#" },
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
          className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
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
    { name: "Home", href: "#" },
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
          className="text-white/90 hover:text-white py-2 text-lg font-medium"
          onClick={closeMenu}
        >
          {link.name}
        </Link>
      ))}
    </>
  )
}

// Feature section component
function FeatureSection() {
  const features = [
    {
      title: "Innovative Design",
      description: "Cutting-edge design principles that set your brand apart from the competition.",
      icon: "✨",
    },
    {
      title: "Responsive Framework",
      description: "Fully responsive layouts that work seamlessly across all devices and screen sizes.",
      icon: "📱",
    },
    {
      title: "Performance Optimized",
      description: "Lightning-fast load times and smooth animations for the best user experience.",
      icon: "⚡",
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
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Discover the tools and capabilities that make our platform stand out
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Call to action section
function CTASection() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
              <p className="text-white/80 mb-6">
                Join thousands of satisfied customers who have transformed their digital presence with our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold">
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold"
                >
                  Learn More
                </Button>
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
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-purple-500 rounded-2xl opacity-20 blur-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
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

// Main component with enhanced features
export default function BackgroundPaths() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-600 via-orange-400 to-teal-400 dark:from-purple-900 dark:via-orange-700 dark:to-teal-700">
      {/* Background animation */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tighter text-white"
            >
              Elevate Your Digital Experience
            </motion.h1>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto"
            >
              Create stunning, responsive websites with our cutting-edge design platform
            </motion.p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold">
                Get Started
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-semibold"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo className="h-8 w-auto text-white mb-4" />
              <p className="text-white/70 mb-4">
                Elevating digital experiences with cutting-edge design and technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
            <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
