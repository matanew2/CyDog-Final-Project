"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function DogMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw map
    const drawMap = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "#1e3a3a"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#2d4a4a"
      ctx.lineWidth = 1

      const gridSize = 30
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw roads
      ctx.strokeStyle = "#4d5a5a"
      ctx.lineWidth = 6

      // Horizontal roads
      for (let i = 1; i < 5; i++) {
        const y = (canvas.height / 6) * i
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Vertical roads
      for (let i = 1; i < 5; i++) {
        const x = (canvas.width / 6) * i
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw dog position
      const dogX = canvas.width * 0.7
      const dogY = canvas.height * 0.3

      // Draw pulse effect
      const time = Date.now() / 1000
      const pulseSize = 15 + Math.sin(time * 3) * 5

      ctx.beginPath()
      ctx.arc(dogX, dogY, pulseSize, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(48, 210, 195, 0.3)"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(dogX, dogY, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#30D2C3"
      ctx.fill()

      ctx.beginPath()
      ctx.arc(dogX, dogY, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()

      // Draw path
      ctx.strokeStyle = "#30D2C3"
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])

      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.2, canvas.height * 0.8)
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.6)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.5)
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.3)
      ctx.stroke()

      ctx.setLineDash([])
    }

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      drawMap()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full"
    />
  )
}
