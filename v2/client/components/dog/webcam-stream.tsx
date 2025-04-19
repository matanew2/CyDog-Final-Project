"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";

interface WebcamStreamProps {
  isActive: boolean;
  isMuted: boolean;
}

export function WebcamStream({ isActive, isMuted }: WebcamStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize webcam
  useEffect(() => {
    let animationFrameId: number;

    const setupWebcam = async () => {
      if (!isActive) {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
        return;
      }

      setIsInitializing(true);
      console.log("Starting webcam setup, isMuted:", isMuted);

      try {
        console.log("Requesting user media");
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: !isMuted,
        });

        setStream(mediaStream);
        console.log("Media stream obtained successfully");

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          console.log("Video element assigned stream");

          // Wait a bit to ensure video is set up before marking as initialized
          setTimeout(() => {
            setHasPermission(true);
            setIsInitializing(false);
            console.log("Video initialized with delay");
          }, 1000);
        } else {
          throw new Error("Video element not available");
        }
      } catch (err) {
        console.error("Error setting up webcam:", err);
        setHasPermission(false);
        setIsInitializing(false);

        if (err instanceof DOMException) {
          if (err.name === "NotAllowedError") {
            setErrorMessage(
              "Camera access denied. Please allow camera access."
            );
          } else if (err.name === "NotFoundError") {
            setErrorMessage("No camera detected. Please connect a camera.");
          } else {
            setErrorMessage(`Camera error: ${err.message}`);
          }
        } else {
          setErrorMessage("An error occurred while setting up the camera.");
        }
      }
    };

    // Apply effects to video stream
    const applyEffects = () => {
      if (videoRef.current && canvasRef.current && hasPermission === true) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx && video.readyState >= 2) {
          // Match canvas size to video
          canvas.width = video.videoWidth || canvas.width;
          canvas.height = video.videoHeight || canvas.height;

          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Apply vignette effect
          const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            canvas.height / 3,
            canvas.width / 2,
            canvas.height / 2,
            canvas.height
          );
          gradient.addColorStop(0, "rgba(0,0,0,0)");
          gradient.addColorStop(1, "rgba(0,0,0,0.4)");

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Add timestamp
          const now = new Date();
          const timeString = now.toLocaleTimeString();
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.font = "16px monospace";
          ctx.fillText(timeString, 10, canvas.height - 10);
        }

        // Continue animation loop
        animationFrameId = requestAnimationFrame(applyEffects);
      }
    };

    setupWebcam();

    // Start animation loop if webcam is active and has permission
    if (isActive && hasPermission === true) {
      animationFrameId = requestAnimationFrame(applyEffects);
    }

    // Set timeout to prevent getting stuck in initializing state
    const initTimeout = setTimeout(() => {
      if (isInitializing) {
        console.log("Camera initialization timed out");
        setIsInitializing(false);

        if (videoRef.current && videoRef.current.readyState >= 2) {
          console.log("Video is actually ready despite timeout");
          setHasPermission(true);
        } else {
          setHasPermission(false);
          setErrorMessage(
            "Camera initialization timed out. Please reload the page and try again."
          );
        }
      }
    }, 5000);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      clearTimeout(initTimeout);
    };
  }, [isActive, isMuted, hasPermission]);

  // Handle mute state changes
  useEffect(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, stream]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <AnimatePresence>
      {isActive ? (
        isInitializing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full w-full flex-col items-center justify-center bg-black"
          >
            <Loader2 className="h-12 w-12 text-teal-500 animate-spin mb-4" />
            <p className="text-white text-lg">Initializing camera...</p>
          </motion.div>
        ) : hasPermission === true ? (
          <div className="relative h-full w-full bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: 0 }} // Hide video but keep it active
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full w-full flex-col items-center justify-center bg-black p-4 text-center"
          >
            <Camera className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-white text-lg font-medium">Camera Error</p>
            <p className="text-gray-400 mt-2">
              {errorMessage || "Unable to access camera"}
            </p>
          </motion.div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex h-full w-full items-center justify-center bg-black"
        >
          <Camera className="h-16 w-16 text-teal-500/50 dark:text-teal-600/50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
