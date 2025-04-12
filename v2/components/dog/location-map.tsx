"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Create a placeholder component for when map is loading
function MapPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-teal-900/30 dark:bg-slate-900/30 rounded-lg">
      <div className="animate-pulse text-teal-100 dark:text-slate-300">
        Loading map...
      </div>
    </div>
  );
}

// Dynamically import the map component with no SSR
const MapWithNoSSR = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: MapPlaceholder,
});

export function LocationMap({ dogId }: { dogId: string }) {
  // Generate a unique instance ID for this map to ensure complete isolation
  const [instanceId] = useState(
    `map-${Math.random().toString(36).substring(2, 11)}`
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full rounded-lg overflow-hidden"
    >
      <MapWithNoSSR dogId={dogId} instanceId={instanceId} />
    </motion.div>
  );
}
