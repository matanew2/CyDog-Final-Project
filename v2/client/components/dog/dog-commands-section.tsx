"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Import the toast hook

interface DogCommandsSectionProps {
  dogId: string;
}

export function DogCommandsSection({ dogId }: DogCommandsSectionProps) {
  // Get toast functionality
  const { toast, dismiss } = useToast();

  // Track current toast id to dismiss it when needed
  const currentToastRef = useRef<string | null>(null);

  // Command timeout animation states
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [commandProgress, setCommandProgress] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock commands
  const commands = [
    "Sit",
    "Stay",
    "Come",
    "Down",
    "Search",
    "Track",
    "Find",
    "Jump",
  ];

  // Favorite commands
  const favoriteCommands = ["Sit", "Come", "Stay", "Down"];

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleCommandClick = (command: string) => {
    const now = Date.now();

    // Check if we're clicking on the currently active command
    if (activeCommand === command) {
      // Cancel/deselect the command
      clearInterval(progressIntervalRef.current!);
      progressIntervalRef.current = null;
      setCommandProgress(0);
      setActiveCommand(null);

      // Dismiss current toast if it exists
      if (currentToastRef.current) {
        dismiss(currentToastRef.current);
        currentToastRef.current = null;
      }

      // Show feedback for canceling command using toast
      const { id } = toast({
        title: "Command Canceled",
        description: `${command} command has been canceled`,
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4" />,
        position: "top", // Position toast at the top
      });

      // Store current toast id
      currentToastRef.current = id;

      return;
    }

    setLastClickTime(now);

    // Clear any existing timeouts for other commands
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
      setCommandProgress(0);
    }

    // Start new command
    setActiveCommand(command);

    // Start the progress bar animation - 3 seconds total
    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += 1; // Slower increment for 3 seconds
      setCommandProgress(progress);

      if (progress >= 100) {
        clearInterval(progressIntervalRef.current!);
        progressIntervalRef.current = null;
        setCommandProgress(0);
        executeCommand(command);
      }
    }, 30); // 3 seconds total (30ms * 100 steps)
  };

  const executeCommand = (command: string) => {
    // Show execution feedback
    console.log(`Executing command: ${command}`);

    // Dismiss current toast if it exists
    if (currentToastRef.current) {
      dismiss(currentToastRef.current);
      currentToastRef.current = null;
    }

    // Visual feedback using toast
    const { id } = toast({
      title: "Command Executed",
      description: `${command} command sent to ${dogId}`,
      variant: "default",
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      position: "top", // Position toast at the top
    });

    // Store current toast id
    currentToastRef.current = id;

    // Reset active command
    setActiveCommand(null);
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <AnimatePresence>
        {commands.map((command) => (
          <motion.button
            key={command}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCommandClick(command)}
            animate={
              activeCommand === command
                ? {
                    scale: [1, 1.05, 1],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
                : {}
            }
            className={`relative flex h-12 items-center justify-center rounded-lg p-2 transition-colors bg-teal-900/70 dark:bg-slate-900/70 text-teal-100 dark:text-slate-300 hover:bg-teal-800 dark:hover:bg-slate-800`}
          >
            {isFavorite(command, favoriteCommands) && (
              <Star
                className="absolute right-1 top-1 h-3 w-3 text-yellow-400"
                fill="currentColor"
              />
            )}

            {/* Progress bar for command timeout */}
            {activeCommand === command ? (
              <>
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-teal-400 rounded-b-lg"
                  style={{ width: `${commandProgress}%` }}
                />

                {/* Animated warning text */}
                <div className="absolute bottom-3 left-0 right-0 text-center overflow-hidden text-xs">
                  <motion.span
                    className="text-xs font-bold text-white bg-red-800/70 px-2 py-0.5 rounded-sm inline-block max-w-[90%]"
                    initial={{ opacity: 0.7, scale: 0.9 }}
                    animate={{
                      opacity: [0.7, 1, 0.7],
                      scale: [0.9, 1.05, 0.9],
                      color: ["#fff", "#ff0", "#fff"], // Flashing color
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                    }}
                  >
                    Click to cancel
                  </motion.span>
                </div>
              </>
            ) : (
              command
            )}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Helper function to check if a command is a favorite
function isFavorite(command: string, favorites: string[]): boolean {
  return favorites.includes(command);
}
