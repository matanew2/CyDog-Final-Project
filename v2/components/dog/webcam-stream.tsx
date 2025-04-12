"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Loader2 } from "lucide-react"

interface WebcamStreamProps {
  isActive: boolean
  isMuted: boolean
}

export function WebcamStream({ isActive, isMuted }: WebcamStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    let animationFrameId: number

    const setupWebcam = async () => {
      if (!isActive) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
        return
      }

      setIsInitializing(true)

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.muted = isMuted
          setHasPermission(true)
          setErrorMessage(null)

          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) videoRef.current.play()
            setIsInitializing(false)
          }
        }
      } catch (err) {
        console.error("Error accessing webcam:", err)
        setHasPermission(false)
        setIsInitializing(false)

        if (err instanceof DOMException) {
          if (err.name === "NotAllowedError") {
            setErrorMessage("Camera access denied. Please allow camera access in your browser settings.")
          } else if (err.name === "NotFoundError") {
            setErrorMessage("No camera detected. Please connect a camera and try again.")
          } else {
            setErrorMessage(`Camera error: ${err.message}`)
          }
        } else {
          setErrorMessage("An unknown error occurred while accessing the camera.")
        }
      }
    }

    // Apply visual effects to video stream
    const applyEffects = () => {
      if (videoRef.current && canvasRef.current && hasPermission && isActive) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Match canvas size to video
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Apply subtle vignette effect
          const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            canvas.height / 3,
            canvas.width / 2,
            canvas.height / 2,
            canvas.height,
          )
          gradient.addColorStop(0, "rgba(0,0,0,0)")
          gradient.addColorStop(1, "rgba(0,0,0,0.4)")

          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Add timestamp
          const now = new Date()
          const timeString = now.toLocaleTimeString()
          ctx.fillStyle = "rgba(255,255,255,0.8)"
          ctx.font = "16px monospace"
          ctx.fillText(timeString, 10, canvas.height - 10)

          // Continue animation loop
          animationFrameId = requestAnimationFrame(applyEffects)
        }
      }
    }

    setupWebcam()

    if (isActive && hasPermission) {
      animationFrameId = requestAnimationFrame(applyEffects)
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isActive, isMuted, hasPermission])

  // Update muted state when isMuted prop changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  return (
    <AnimatePresence>
      {isActive ? (
        isInitializing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-full w-full flex-col items-center justify-center bg-black"
          >
            <Loader2 className="h-12 w-12 text-teal-500 animate-spin mb-4" />
            <p className="text-white text-lg">Initializing camera...</p>
          </motion.div>
        ) : hasPermission === true ? (
          <div className="relative h-full w-full">
            <video ref={videoRef} className="hidden h-full w-full object-cover" autoPlay playsInline />
            <canvas ref={canvasRef} className="h-full w-full object-cover" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-full w-full flex-col items-center justify-center bg-black p-4 text-center"
          >
            <Camera className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-white text-lg font-medium">Camera Error</p>
            <p className="text-gray-400 mt-2">{errorMessage || "Unable to access camera"}</p>
          </motion.div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex h-full w-full items-center justify-center bg-black"
        >
          <Camera className="h-16 w-16 text-teal-500/50 dark:text-teal-600/50" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
