"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";

interface WebcamStreamProps {
  isActive: boolean;
  isMuted: boolean;
}

export function WebcamStream({ isActive, isMuted }: WebcamStreamProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isInitializing, setIsInitializing] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle permission detection
  useEffect(() => {
    if (!isActive) {
      setHasPermission(null);
      return;
    }

    const checkPermissions = async () => {
      setIsInitializing(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: !isMuted,
        });
        stream.getTracks().forEach((track) => track.stop());
        setHasPermission(true);
        setIsInitializing(false);
      } catch (err: any) {
        setIsInitializing(false);
        setHasPermission(false);
        if (err.name === "NotAllowedError") {
          setErrorMessage("Camera access denied. Please allow access.");
        } else if (err.name === "NotFoundError") {
          setErrorMessage("No camera detected.");
        } else {
          setErrorMessage(`Camera error: ${err.message}`);
        }
      }
    };

    checkPermissions();
  }, [isActive, isMuted]);

  // Canvas overlay effect
  const drawOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const video = webcamRef.current?.video;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx || video.readyState < 2) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Vignette effect
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

    // Timestamp
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.font = "16px monospace";
    ctx.fillText(new Date().toLocaleTimeString(), 10, canvas.height - 10);
  }, []);

  // Animation loop
  useEffect(() => {
    let rafId: number;

    const renderLoop = () => {
      drawOverlay();
      rafId = requestAnimationFrame(renderLoop);
    };

    if (isActive && hasPermission) {
      rafId = requestAnimationFrame(renderLoop);
    }

    return () => cancelAnimationFrame(rafId);
  }, [isActive, hasPermission, drawOverlay]);

  return (
    <AnimatePresence>
      {isActive ? (
        isInitializing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full w-full flex-col items-center justify-center bg-black"
          >
            <Loader2 className="h-12 w-12 text-teal-500 animate-spin mb-4" />
            <p className="text-white text-lg">Initializing camera...</p>
          </motion.div>
        ) : hasPermission ? (
          <div className="relative h-full w-full bg-black">
            <Webcam
              ref={webcamRef}
              audio={!isMuted}
              videoConstraints={{ facingMode: "user" }}
              className="absolute inset-0 h-full w-full object-cover opacity-0"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ) : (
          <motion.div
            key="error"
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
          key="inactive"
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
