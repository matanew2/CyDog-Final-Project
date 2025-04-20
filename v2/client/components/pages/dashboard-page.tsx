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
  Video as VideoIcon,
  Camera as CameraIcon,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { DogCommandsSection } from "@/components/dog/dog-commands-section";
import { LocationMap } from "@/components/dog/location-map";
import { WebcamStream } from "@/components/dog/webcam-stream";
import { HLSPlayer } from "@/components/dog/hls-player";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DashboardPage() {
  const { activeDogs, getDogById, convertRTSPToHLS } = useApp();
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCommands, setShowCommands] = useState(true);
  const [streamType, setStreamType] = useState<"webcam" | "hls">("webcam");
  const [hlsUrl, setHlsUrl] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("disconnected");
  const [customStreamDialogOpen, setCustomStreamDialogOpen] = useState(false);
  const [customStreamUrl, setCustomStreamUrl] = useState("");
  const [customStreamType, setCustomStreamType] = useState("hls");
  const [isRtspStream, setIsRtspStream] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(85);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(0);

  // Mock HLS stream URLs - in a real application, these would come from your backend
  const getHlsStreamUrl = (dogId: string) => {
    // This is a placeholder - in a real app you would get the actual stream URL from your backend
    return `${BACKEND_URL}/stream/${dogId}/index.m3u8`;
  };

  useEffect(() => {
    if (activeDogs.length > 0 && !selectedDog) {
      setSelectedDog(activeDogs[0]);
    }
  }, [activeDogs, selectedDog]);

  useEffect(() => {
    if (selectedDog && streamType === "hls") {
      // Set the HLS stream URL for the selected dog
      setHlsUrl(getHlsStreamUrl(selectedDog.id));
      setIsRtspStream(false); // Reset RTSP flag when switching dogs
    }
  }, [selectedDog, streamType]);

  // Simulate connection status changes
  useEffect(() => {
    if (isStreaming && streamType === "hls") {
      setConnectionStatus("connecting");

      const connectionTimer = setTimeout(() => {
        setConnectionStatus("connected");
      }, 2000);

      return () => clearTimeout(connectionTimer);
    } else if (!isStreaming) {
      setConnectionStatus("disconnected");
    }
  }, [isStreaming, streamType]);

  // Simulate battery level changes
  useEffect(() => {
    if (isStreaming) {
      const batteryInterval = setInterval(() => {
        setBatteryLevel((prev) => Math.max(prev - 1, 0));
      }, 30000); // Decrease by 1% every 30 seconds

      return () => clearInterval(batteryInterval);
    }
  }, [isStreaming]);

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
    setIsRtspStream(false); // Reset RTSP flag when switching dogs

    if (streamType === "hls") {
      setHlsUrl(getHlsStreamUrl(dog.id));
    }
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

  const handleStreamTypeChange = (value: string) => {
    setStreamType(value as "webcam" | "hls");
    setIsStreaming(false); // Reset streaming state when changing source
    setIsRtspStream(false); // Reset RTSP flag when changing stream type

    if (value === "hls" && selectedDog) {
      setHlsUrl(getHlsStreamUrl(selectedDog.id));
    }
  };

  const handleCustomStreamSubmit = async () => {
    if (customStreamUrl) {
      if (customStreamType === "rtsp") {
        // For RTSP streams, we need to convert them to HLS
        setIsRtspStream(true);

        // Notify user that conversion is happening
        const feedbackEl = document.createElement("div");
        feedbackEl.className =
          "fixed top-4 right-4 bg-teal-500 text-white px-4 py-2 rounded-md z-50 transition-opacity duration-500";
        feedbackEl.textContent = "Converting RTSP stream...";
        document.body.appendChild(feedbackEl);

        // Send the RTSP URL to the backend for conversion
        try {
          const convertedUrl = await convertRTSPToHLS(
            customStreamUrl,
            selectedDog.id
          );
          setHlsUrl(convertedUrl);
          setIsStreaming(true);
          setConnectionStatus("connected");
        } catch (error) {
          console.error("Error converting RTSP to HLS:", error);
          setConnectionStatus("disconnected");
          feedbackEl.textContent = "Failed to convert RTSP stream";
        }
        setTimeout(() => {
          feedbackEl.style.opacity = "0";
          setTimeout(() => document.body.removeChild(feedbackEl), 500);
        }, 2000);
      } else if (customStreamType === "hls") {
        // For HLS streams, we can set the URL directly
        setHlsUrl(customStreamUrl);
        setIsStreaming(true);
        setConnectionStatus("connected");
        // Notify user that the stream is starting
        const feedbackEl = document.createElement("div");
        feedbackEl.className =
          "fixed top-4 right-4 bg-teal-500 text-white px-4 py-2 rounded-md z-50 transition-opacity duration-500";
        feedbackEl.textContent = "Starting HLS stream...";
        document.body.appendChild(feedbackEl);
        setTimeout(() => {
          feedbackEl.style.opacity = "0";
          setTimeout(() => document.body.removeChild(feedbackEl), 500);
        }, 2000);
      } else {
        // Standard HLS stream
        setIsRtspStream(false);
        setHlsUrl(customStreamUrl);
        setStreamType("hls");
        setCustomStreamDialogOpen(false);
      }
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Check className="h-3 w-3 text-green-500" />;
      case "connecting":
        return <Loader2 className="h-3 w-3 text-amber-500 animate-spin" />;
      case "disconnected":
      default:
        return <X className="h-3 w-3 text-red-500" />;
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-amber-500";
      case "disconnected":
      default:
        return "bg-red-500";
    }
  };

  // RTSP Status Indicator to add inside the HLS player
  const renderRtspStatusIndicator = () => {
    if (!isRtspStream) return null;

    return (
      <div className="absolute top-8 right-0 z-10 bg-black/70 text-white text-xs p-1 m-1 rounded flex items-center">
        <svg
          className="animate-spin -ml-1 mr-2 h-3 w-3 text-teal-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>RTSP Stream</span>
      </div>
    );
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
            <div className="bg-teal-900/50 dark:bg-slate-900/50 rounded-lg p-3 flex-1 flex flex-col">
              {/* Dog Info Bar with Stream Selector */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-teal-500">
                    <AvatarImage
                      src={getImageUrl(selectedDog.image)}
                      alt={selectedDog.name}
                    />
                    <AvatarFallback className="bg-teal-700 dark:bg-teal-800 text-white text-xs">
                      {selectedDog.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <h2 className="text-base font-semibold text-white">
                        {selectedDog.name} | {selectedDog.breed}
                      </h2>
                      <div
                        className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}
                      ></div>
                    </div>
                    <p className="text-xs text-teal-100 dark:text-slate-300">
                      ID: {selectedDog.id} • Battery: {batteryLevel}%
                      <span className="inline-block ml-1 w-8 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <span
                          className={`block h-full rounded-full ${
                            batteryLevel > 20 ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{ width: `${batteryLevel}%` }}
                        />
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-teal-600 text-white bg-teal-800/50 hover:bg-teal-700 text-xs h-8 px-2"
                          onClick={() => setCustomStreamDialogOpen(true)}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Custom Stream
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Connect to a custom HLS or RTSP stream</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Select
                    value={streamType}
                    onValueChange={handleStreamTypeChange}
                  >
                    <SelectTrigger className="h-8 w-36 bg-teal-800/50 border-teal-700 text-white">
                      <SelectValue placeholder="Stream Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webcam" className="flex items-center">
                        <CameraIcon className="h-3.5 w-3.5 mr-2" />
                        Webcam
                      </SelectItem>
                      <SelectItem value="hls" className="flex items-center">
                        <VideoIcon className="h-3.5 w-3.5 mr-2" />
                        Live Stream
                      </SelectItem>
                    </SelectContent>
                  </Select>

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

              {/* Status Bar */}
              {streamType === "hls" && (
                <div className="flex items-center justify-between mb-1 px-2 py-1 bg-black/30 rounded text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span className="text-teal-100">Status:</span>
                      <span className="flex items-center gap-1 ml-1">
                        {connectionStatus === "connected"
                          ? "Connected"
                          : connectionStatus === "connecting"
                          ? "Connecting..."
                          : "Disconnected"}
                        {getConnectionStatusIcon()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-teal-100">Source:</span>
                      <span className="ml-1 max-w-md truncate">
                        {hlsUrl || "Not set"}
                      </span>
                    </div>
                  </div>
                  <div className="text-teal-100">
                    {isStreaming ? "Streaming" : "Stream stopped"}
                  </div>
                </div>
              )}

              {/* Video Player */}
              <div className="flex-1 w-full relative rounded-md bg-black overflow-hidden">
                {streamType === "webcam" ? (
                  <WebcamStream isActive={isStreaming} isMuted={isMuted} />
                ) : (
                  <div className="h-full w-full">
                    {isStreaming ? (
                      <>
                        {/* Debug info overlay */}
                        <div className="absolute top-0 right-0 z-10 bg-black/70 text-white text-xs p-1 m-1 rounded">
                          <p>
                            HLS URL:{" "}
                            {hlsUrl
                              ? hlsUrl.length > 30
                                ? hlsUrl.substring(0, 30) + "..."
                                : hlsUrl
                              : "Not set"}
                          </p>
                          <p>Connection: {connectionStatus}</p>
                        </div>

                        {renderRtspStatusIndicator()}

                        <HLSPlayer
                          streamUrl={hlsUrl}
                          isActive={isStreaming}
                          isMuted={isMuted}
                          onError={(message) => {
                            console.error("HLS Error in Dashboard:", message);
                            setConnectionStatus("disconnected");
                          }}
                          onStreamLoaded={() => {
                            console.log("Stream loaded successfully");
                            setConnectionStatus("connected");
                          }}
                        />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-black">
                        <VideoIcon className="h-16 w-16 text-teal-500/50 dark:text-teal-600/50" />
                      </div>
                    )}
                  </div>
                )}

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
                      disabled={streamType === "hls"}
                    >
                      {isMicActive ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <MicOff className="h-4 w-4" />
                      )}
                    </Button>

                    {streamType === "hls" &&
                      connectionStatus === "connected" &&
                      isStreaming && (
                        <Badge className="bg-teal-600 text-white text-xs mr-2">
                          Live Stream
                        </Badge>
                      )}
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-white flex items-center">
                  <DogIcon className="h-4 w-4 mr-1 text-teal-400" />
                  Command Center
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-teal-200 hover:bg-teal-700/50"
                  onClick={toggleCommands}
                >
                  {showCommands ? "Hide" : "Show"}
                </Button>
              </div>

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

      {/* Custom Stream Dialog */}
      <Dialog
        open={customStreamDialogOpen}
        onOpenChange={setCustomStreamDialogOpen}
      >
        <DialogContent className="bg-teal-900 text-white border-teal-700">
          <DialogHeader>
            <DialogTitle>Connect to Custom Stream</DialogTitle>
            <DialogDescription className="text-teal-200">
              Enter the stream URL to connect to your custom stream
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="streamType" className="text-right">
                Stream Type
              </Label>
              <Select
                value={customStreamType}
                onValueChange={setCustomStreamType}
                defaultValue="hls"
              >
                <SelectTrigger
                  id="streamType"
                  className="col-span-3 bg-teal-800 border-teal-700 text-white"
                >
                  <SelectValue placeholder="Select stream type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hls">HLS Stream</SelectItem>
                  <SelectItem value="rtsp">RTSP Stream</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="streamUrl" className="text-right">
                Stream URL
              </Label>
              <Input
                id="streamUrl"
                placeholder={
                  customStreamType === "rtsp"
                    ? "rtsp://username:password@192.168.1.100:554/stream"
                    : "http://localhost:8080/stream/stream.m3u8"
                }
                className="col-span-3 bg-teal-800 border-teal-700 text-white"
                value={customStreamUrl}
                onChange={(e) => setCustomStreamUrl(e.target.value)}
              />
            </div>

            {customStreamType === "rtsp" && (
              <div className="col-span-4 px-2">
                <div className="p-3 rounded bg-teal-800/50 text-teal-200 text-sm">
                  <AlertCircle className="h-4 w-4 inline-block mr-2" />
                  RTSP streams will be converted to HLS format for playback.
                  This may add a slight delay to the stream.
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCustomStreamDialogOpen(false)}
              className="border-teal-600 text-white hover:bg-teal-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCustomStreamSubmit}
              className="bg-teal-600 hover:bg-teal-500"
              disabled={!customStreamUrl}
            >
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

// Loader component for the loading state
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
