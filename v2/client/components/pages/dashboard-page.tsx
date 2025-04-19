"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layouts/app-layout";
import { useApp, type Dog } from "@/components/app/app-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getImageUrl, BACKEND_URL } from "@/utils/ImageProcess";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Dog as DogIcon,
} from "lucide-react";
import { DogCommandsSection } from "@/components/dog/dog-commands-section";
import { LocationMap } from "@/components/dog/location-map";
import { WebcamStream } from "@/components/dog/webcam-stream";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function DashboardPage() {
  const { activeDogs, getDogById } = useApp();
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCommands, setShowCommands] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(0);

  useEffect(() => {
    if (activeDogs.length > 0 && !selectedDog) {
      setSelectedDog(activeDogs[0]);
    }
  }, [activeDogs, selectedDog]);

  // Add resize listener for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      // Auto-adjust layout based on screen size
      if (window.innerWidth < 1024 && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFullscreen]);

  const handleSelectDog = (dog: Dog) => {
    setSelectedDog(dog);
    setIsStreaming(false);
  };

  const toggleStream = () => {
    setIsStreaming(!isStreaming);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleMic = () => {
    setIsMicActive(!isMicActive);

    // If turning on mic, show feedback
    if (!isMicActive) {
      const feedbackEl = document.createElement("div");
      feedbackEl.className =
        "fixed top-4 right-4 bg-teal-500 text-white px-4 py-2 rounded-md z-50 transition-opacity duration-500";
      feedbackEl.textContent = `Microphone activated`;
      document.body.appendChild(feedbackEl);

      setTimeout(() => {
        feedbackEl.style.opacity = "0";
        setTimeout(() => document.body.removeChild(feedbackEl), 500);
      }, 2000);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);

    // Trigger layout refresh for responsive adjustment
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
  };

  const toggleCommands = () => {
    setShowCommands(!showCommands);
  };

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 200; // Adjust as needed
      const newPosition =
        direction === "left"
          ? Math.max(0, sliderPosition - scrollAmount)
          : sliderPosition + scrollAmount;

      sliderRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      setSliderPosition(newPosition);
    }
  };

  if (!selectedDog) {
    return (
      <AppLayout>
        <div className="h-screen p-4">
          <h1 className="mb-4 text-2xl font-bold text-white">Command Center</h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700">
              <CardHeader className="py-3">
                <CardTitle>No Active Dogs</CardTitle>
                <CardDescription className="text-teal-100 dark:text-slate-300">
                  Add dogs to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-3">
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
    );
  }

  return (
    <AppLayout>
      <div className="h-screen max-h-screen flex flex-col p-3 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between h-12 mb-2 ml-2">
          <h1 className="text-2xl font-bold text-white">Command Center</h1>

          {/* Active Dogs Slider - Compact */}
          <div className="flex items-center">
            {/* Title for Active Dogs - Now a separate element with animated glow */}
            <div className="flex items-center gap-2 mr-4 relative">
              {/* Green glowing circle with shrink/unshrink animation */}
              <motion.div
                className="absolute left-0 top-0 w-5 h-5 rounded-full bg-green-500/20"
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                  boxShadow: [
                    "0 0 4px 2px rgba(34, 197, 94, 0.4)",
                    "0 0 8px 4px rgba(34, 197, 94, 0.6)",
                    "0 0 4px 2px rgba(34, 197, 94, 0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <DogIcon className="h-5 w-5 text-teal-400 z-10" />
              <span className="text-sm font-medium text-teal-100">
                Active Dogs
              </span>
            </div>

            {/* Slider with arrows positioned correctly */}
            <div className="relative flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="z-10 bg-teal-800/50 dark:bg-slate-800/50 text-white hover:bg-teal-700 h-8 w-8"
                onClick={() => scrollSlider("left")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div
                ref={sliderRef}
                className="flex overflow-x-auto scrollbar-hide py-1 px-2 space-x-2 max-w-lg"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {activeDogs.map((dog) => (
                  <motion.div
                    key={dog.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 cursor-pointer rounded-lg p-2 transition-colors ${
                      selectedDog?.id === dog.id
                        ? "bg-teal-700 dark:bg-teal-800 border border-teal-500"
                        : "bg-teal-900/50 dark:bg-slate-900/50 hover:bg-teal-800/70 dark:hover:bg-slate-800/70"
                    }`}
                    onClick={() => handleSelectDog(dog)}
                  >
                    <div className="flex items-center gap-2 w-44 h-8">
                      <Avatar className="h-8 w-8 border border-teal-500">
                        <AvatarImage
                          src={getImageUrl(dog.image)}
                          alt={dog.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-teal-700 dark:bg-teal-800 text-white text-xs">
                          {dog.name[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="font-medium text-sm text-white truncate">
                          {dog.name}
                        </p>
                        <p className="text-xs text-teal-100 dark:text-slate-300 truncate">
                          {dog.breed} • {dog.age} yr
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="z-10 bg-teal-800/50 dark:bg-slate-800/50 text-white hover:bg-teal-700 h-8 w-8"
                onClick={() => scrollSlider("right")}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 flex ${
            isFullscreen ? "flex-col" : "flex-col lg:flex-row"
          } gap-3 overflow-hidden`}
        >
          {/* Video Section - Left */}
          <div
            className={`${
              isFullscreen ? "w-full" : "lg:w-2/3"
            } flex flex-col h-full`}
          >
            <div className="rounded-lg bg-black/30 p-3 flex-1 flex flex-col">
              {/* Dog Info Bar */}
              <div className="flex items-center justify-between gap-2 p-1 mb-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-teal-500">
                    <AvatarImage
                      src={selectedDog.image || "/placeholder.svg"}
                      alt={selectedDog.name}
                    />
                    <AvatarFallback className="bg-teal-700 dark:bg-teal-800 text-white text-xs">
                      {selectedDog.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      {selectedDog.name} | {selectedDog.breed}
                    </h2>
                    <p className="text-xs text-teal-100 dark:text-slate-300">
                      ID:{selectedDog.id}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-teal-600 dark:border-teal-700 text-teal-600 dark:text-white hover:bg-teal-700 dark:hover:bg-teal-800 text-xs h-7 px-2"
                    onClick={toggleFullscreen}
                  >
                    <Maximize className="h-3 w-3 mr-1" />
                    Resize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-500/20 text-xs h-7 px-2"
                  >
                    End
                  </Button>
                </div>
              </div>

              {/* Video Player */}
              <div className="flex-1 w-full relative rounded-md bg-black overflow-hidden">
                <WebcamStream isActive={isStreaming} isMuted={isMuted} />

                {/* Video controls */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={toggleStream}
                    >
                      {isStreaming ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-full ${
                        isMicActive ? "bg-teal-600/70" : "bg-black/50"
                      } text-white hover:bg-black/70`}
                      onClick={toggleMic}
                    >
                      {isMicActive ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <MicOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Command Section - Collapsible */}
            <div
              className={`mt-2 rounded-lg bg-teal-800/30 dark:bg-slate-800/30 p-2 overflow-hidden ${
                isFullscreen ? "flex-shrink-0" : ""
              }`}
            >
              {showCommands && (
                <div
                  className={`${
                    isFullscreen ? "max-h-48" : "max-h-36"
                  } overflow-y-auto`}
                >
                  <DogCommandsSection dogId={selectedDog.id} />
                </div>
              )}
            </div>
          </div>

          {/* Map Section - Right */}
          <div className={`${isFullscreen ? "hidden" : "lg:w-1/3 h-full"}`}>
            <Card className="bg-teal-800/50 dark:bg-slate-800/50 text-white border-teal-700 dark:border-slate-700 h-full flex flex-col overflow-hidden">
              <CardHeader className="py-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-base">
                    <MapPin className="mr-1 h-4 w-4 text-teal-400 dark:text-teal-500" />{" "}
                    Location
                  </CardTitle>
                  <Badge className="bg-green-600 dark:bg-green-700 text-xs px-2 py-0">
                    Live
                  </Badge>
                </div>
                <CardDescription className="text-teal-100 dark:text-slate-300 text-xs">
                  Real-time tracking
                </CardDescription>
              </CardHeader>
              <CardContent
                className="p-2"
                style={{ height: "calc(100% - 80px)" }}
              >
                <div className="h-full w-full overflow-hidden rounded-md">
                  <LocationMap dogId={selectedDog.id} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
