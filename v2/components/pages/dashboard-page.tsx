"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/layouts/app-layout"
import { useApp, type Dog } from "@/components/app/app-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Mic,
  MicOff,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { DogCommandsSection } from "@/components/dog/dog-commands-section"
import { LocationMap } from "@/components/dog/location-map"
import { WebcamStream } from "@/components/dog/webcam-stream"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function DashboardPage() {
  const { activeDogs, getDogById } = useApp()
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isMicActive, setIsMicActive] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showCommands, setShowCommands] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [sliderPosition, setSliderPosition] = useState(0)

  useEffect(() => {
    if (activeDogs.length > 0 && !selectedDog) {
      setSelectedDog(activeDogs[0])
    }
  }, [activeDogs, selectedDog])

  const handleSelectDog = (dog: Dog) => {
    setSelectedDog(dog)
    setIsStreaming(false)
  }

  const toggleStream = () => {
    setIsStreaming(!isStreaming)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleMic = () => {
    setIsMicActive(!isMicActive)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const toggleCommands = () => {
    setShowCommands(!showCommands)
  }

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 200 // Adjust as needed
      const newPosition =
        direction === "left" ? Math.max(0, sliderPosition - scrollAmount) : sliderPosition + scrollAmount

      sliderRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })

      setSliderPosition(newPosition)
    }
  }

  if (!selectedDog) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <h1 className="mb-6 text-3xl font-bold text-white">Command Center</h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
              <CardHeader>
                <CardTitle>No Active Dogs</CardTitle>
                <CardDescription className="text-teal-100 dark:text-slate-300">Add dogs to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-6">
                  <Link href="/dog-list">
                    <Button className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600">
                      <Plus className="mr-2 h-4 w-4" /> Add Dog
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container-fluid max-w-7xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Command Center</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-teal-600 dark:border-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
            >
              <Search className="mr-2 h-4 w-4" /> Find Dog
            </Button>
            <Link href="/dog-list">
              <Button className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-700 dark:hover:bg-teal-600">
                <Plus className="mr-2 h-4 w-4" /> Add Dog
              </Button>
            </Link>
          </div>
        </div>

        {/* Active Dogs Slider */}
        <div className="mb-6 relative">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 z-10 bg-teal-800/50 dark:bg-slate-800/50 text-white"
              onClick={() => scrollSlider("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div
              ref={sliderRef}
              className="flex overflow-x-auto scrollbar-hide py-2 px-8 space-x-4 w-full"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {activeDogs.map((dog) => (
                <motion.div
                  key={dog.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 cursor-pointer rounded-lg p-3 transition-colors ${
                    selectedDog?.id === dog.id
                      ? "bg-teal-700 dark:bg-teal-800 border-2 border-teal-500"
                      : "bg-teal-900/50 dark:bg-slate-900/50 hover:bg-teal-800/70 dark:hover:bg-slate-800/70"
                  }`}
                  onClick={() => handleSelectDog(dog)}
                >
                  <div className="flex items-center gap-3 w-56">
                    <Avatar className="h-12 w-12 border border-teal-500">
                      <AvatarImage src={dog.image || "/placeholder.svg"} alt={dog.name} />
                      <AvatarFallback className="bg-teal-700 dark:bg-teal-800 text-white">{dog.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{dog.name}</p>
                      <p className="text-xs text-teal-100 dark:text-slate-300 truncate">
                        {dog.breed} • {dog.age} yr
                      </p>
                      <Badge className="mt-1 bg-green-600 dark:bg-green-700 text-xs">Active</Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 z-10 bg-teal-800/50 dark:bg-slate-800/50 text-white"
              onClick={() => scrollSlider("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main content - Video and Map */}
          <div className="lg:col-span-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Section - 2/3 width */}
              <div className="lg:col-span-2">
                <div className="rounded-xl bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-4 p-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-teal-500">
                        <AvatarImage src={selectedDog.image || "/placeholder.svg"} alt={selectedDog.name} />
                        <AvatarFallback className="bg-teal-700 dark:bg-teal-800 text-white">
                          {selectedDog.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {selectedDog.name} | {selectedDog.breed}
                        </h2>
                        <p className="text-sm text-teal-100 dark:text-slate-300">ID:{selectedDog.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-teal-600 dark:border-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
                        onClick={toggleFullscreen}
                      >
                        {isFullscreen ? "Reduce View" : "Expand View"}
                      </Button>
                      <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/20">
                        End Task
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg bg-black relative">
                    <WebcamStream isActive={isStreaming} isMuted={isMuted} />

                    {/* Video controls */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
                          onClick={toggleStream}
                        >
                          {isStreaming ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-10 w-10 rounded-full ${isMicActive ? "bg-teal-600/70" : "bg-black/50"} text-white hover:bg-black/70`}
                          onClick={toggleMic}
                        >
                          {isMicActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        </Button>
                      </div>

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
                        >
                          <Maximize className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Tracker - 1/3 width */}
              <div className="lg:col-span-1">
                <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-teal-400 dark:text-teal-500" /> Location
                      </CardTitle>
                      <Badge className="bg-green-600 dark:bg-green-700">Live</Badge>
                    </div>
                    <CardDescription className="text-teal-100 dark:text-slate-300">Real-time tracking</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-5rem)]">
                    <div className="h-full w-full overflow-hidden rounded-lg">
                      <LocationMap dogId={selectedDog.id} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Commands Section */}
            {showCommands ? (
              <div className="mt-6 rounded-xl bg-teal-800/30 dark:bg-slate-800/30 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Dog Commands</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-teal-600 dark:border-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
                    onClick={toggleCommands}
                  >
                    Hide Commands
                  </Button>
                </div>
                <DogCommandsSection dogId={selectedDog.id} />
              </div>
            ) : (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  className="border-teal-600 dark:border-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-800"
                  onClick={toggleCommands}
                >
                  Show Commands
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
