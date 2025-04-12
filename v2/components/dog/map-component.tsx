"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useApp } from "@/components/app/app-provider";

interface MapComponentProps {
  dogId: string;
  instanceId: string;
}

export default function MapComponent({ dogId, instanceId }: MapComponentProps) {
  const { getDogById } = useApp();
  const { theme } = useTheme();
  const dog = getDogById(dogId);
  const [userPosition, setUserPosition] = useState<[number, number]>([
    40.7128, -74.006,
  ]);
  const [dogPosition, setDogPosition] = useState<[number, number]>([
    40.7138, -74.007,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    setIsLoading(false);

    // Default to New York coordinates
    const defaultCoords: [number, number] = [40.7128, -74.006];
    setUserPosition(defaultCoords);
    setDogPosition([defaultCoords[0] + 0.001, defaultCoords[1] + 0.001]);

    // Create map instance
    mapRef.current = L.map(mapContainerRef.current).setView(defaultCoords, 15);

    // Set up tile layer based on theme
    const tileLayer =
      theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const tileLayerAttribution =
      theme === "dark"
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    L.tileLayer(tileLayer, {
      attribution: tileLayerAttribution,
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Add markers
    const markerIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const dogIcon = L.icon({
      iconUrl:
        "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64/1f415.png",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    // Try to get geolocation if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newUserPos: [number, number] = [latitude, longitude];
          const newDogPos: [number, number] = [
            latitude + 0.001,
            longitude + 0.001,
          ];

          setUserPosition(newUserPos);
          setDogPosition(newDogPos);

          if (mapRef.current) {
            mapRef.current.setView(newDogPos, 15);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    }

    // Clean up function to destroy map when component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [instanceId, theme]);

  // Update markers when positions change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers and circles
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // User marker
    const markerIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const dogIcon = L.icon({
      iconUrl:
        "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64/1f415.png",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    // Add user marker
    L.marker(userPosition, { icon: markerIcon })
      .bindPopup("Your location")
      .addTo(mapRef.current);

    // Add dog marker
    L.marker(dogPosition, { icon: dogIcon })
      .bindPopup(`${dog?.name || "Dog"} is here`)
      .addTo(mapRef.current);

    // Add range circle
    L.circle(userPosition, {
      radius: 500,
      color: theme === "dark" ? "#0d9488" : "#14b8a6",
      fillColor: theme === "dark" ? "#0d9488" : "#14b8a6",
      fillOpacity: 0.1,
    }).addTo(mapRef.current);

    // Center map on dog position
    mapRef.current.setView(dogPosition, mapRef.current.getZoom());
  }, [userPosition, dogPosition, dog, theme]);

  // Simulate dog movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDogPosition((prev) => {
        const lat = prev[0] + (Math.random() - 0.5) * 0.001;
        const lng = prev[1] + (Math.random() - 0.5) * 0.001;
        return [lat, lng];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update tile layer when theme changes
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapRef.current?.removeLayer(layer);
      }
    });

    const tileLayer =
      theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

    const tileLayerAttribution =
      theme === "dark"
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    L.tileLayer(tileLayer, {
      attribution: tileLayerAttribution,
      maxZoom: 19,
    }).addTo(mapRef.current);
  }, [theme]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-teal-900/30 dark:bg-slate-900/30 rounded-lg">
        <div className="animate-pulse text-teal-100 dark:text-slate-300">
          Loading map...
        </div>
      </div>
    );
  }

  return (
    <div id={instanceId} ref={mapContainerRef} className="h-full w-full"></div>
  );
}
