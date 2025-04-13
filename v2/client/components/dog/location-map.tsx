"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/components/app/app-provider";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Import only CSS during SSR - safer than importing the whole library
import "leaflet/dist/leaflet.css";

// Dynamically import the map component with no SSR
const Map = dynamic(() => import("./dog-map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-teal-900/30 dark:bg-slate-900/30 rounded-lg">
      <div className="animate-pulse text-teal-100 dark:text-slate-300">
        Loading map...
      </div>
    </div>
  ),
});

interface LocationMapProps {
  dogId: string;
}

export function LocationMap({ dogId }: LocationMapProps) {
  const { getDogById } = useApp();
  const { theme } = useTheme();
  const dog = getDogById(dogId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full rounded-lg overflow-hidden"
    >
      <Map dogId={dogId} dogName={dog?.name} theme={theme} />
    </motion.div>
  );
}
