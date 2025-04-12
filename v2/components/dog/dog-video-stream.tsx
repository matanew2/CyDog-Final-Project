"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize, Camera } from "lucide-react"

interface DogVideoStreamProps {
  dogId: string
  autoPlay?: boolean
}

export function DogVideoStream({ dogId, autoPlay = false }: DogVideoStreamProps) {
  const [isStreaming, setIsStreaming] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate stream connection when autoPlay is true
    if (autoPlay) {
      setIsStreaming(true)
    }
  }, [autoPlay])

  const toggleStream = () => {
    setIsStreaming(!isStreaming)

    // If starting stream, ensure video plays
    if (!isStreaming && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
      })
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  return (
    <div ref={containerRef} className="aspect-video w-full overflow-hidden rounded-lg bg-black relative">
      <AnimatePresence>
        {isStreaming ? (
          <motion.video
            ref={videoRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted={isMuted}
          >
            <source src="/placeholder-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-full w-full items-center justify-center bg-black"
          >
            <Camera className="h-16 w-16 text-teal-500/50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video controls */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
          onClick={toggleStream}
        >
          {isStreaming ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
