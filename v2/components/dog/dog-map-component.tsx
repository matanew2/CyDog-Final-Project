"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";

// Fix for Leaflet marker icons in Next.js
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom dog marker icon
const dogIcon = L.icon({
  iconUrl:
    "https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64/1f415.png", // Dog emoji
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Component to update map center when location changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

// Component to simulate dog movement
function DogMovement({
  dogId,
  setPosition,
}: {
  dogId: string;
  setPosition: (pos: [number, number]) => void;
}) {
  useEffect(() => {
    // Simulate dog movement with random walk
    const interval = setInterval(() => {
      setPosition((prev) => {
        const lat = prev[0] + (Math.random() - 0.5) * 0.001;
        const lng = prev[1] + (Math.random() - 0.5) * 0.001;
        return [lat, lng];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [dogId, setPosition]);

  return null;
}

interface DogMapProps {
  dogId: string;
  dogName?: string;
  theme?: string;
}

export default function DogMapComponent({
  dogId,
  dogName,
  theme,
}: DogMapProps) {
  const [userPosition, setUserPosition] = useState<[number, number]>([
    40.7128, -74.006,
  ]); // Default to NYC
  const [dogPosition, setDogPosition] = useState<[number, number]>([
    40.7138, -74.007,
  ]); // Slightly offset from user
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<L.Map | null>(null);

  // Get user's location on component mount
  useEffect(() => {
    // Start with default coordinates
    const defaultCoords = [40.7128, -74.006] as [number, number]; // New York coordinates
    setUserPosition(defaultCoords);
    setDogPosition([defaultCoords[0] + 0.001, defaultCoords[1] + 0.001]); // Place dog nearby
    setIsLoading(false);

    // Try to get user location, but don't block rendering if it fails
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
          setDogPosition([latitude + 0.001, longitude + 0.001]); // Place dog nearby
        },
        (error) => {
          console.error("Error getting location:", error);
          // We already set default coordinates, so no need to do anything here
        },
        { timeout: 5000, maximumAge: 60000 }
      );
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Choose tile layer based on theme
  const tileLayer =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileLayerAttribution =
    theme === "dark"
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <MapContainer
      center={userPosition}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(map) => {
        mapRef.current = map;
      }}
    >
      <TileLayer attribution={tileLayerAttribution} url={tileLayer} />

      {/* User marker */}
      <Marker position={userPosition} icon={markerIcon}>
        <Popup>Your location</Popup>
      </Marker>

      {/* Dog marker */}
      <Marker position={dogPosition} icon={dogIcon || markerIcon}>
        <Popup>{dogName || "Dog"} is here</Popup>
      </Marker>

      {/* Range circle */}
      <Circle
        center={userPosition}
        radius={500}
        pathOptions={{
          color: theme === "dark" ? "#0d9488" : "#14b8a6",
          fillColor: theme === "dark" ? "#0d9488" : "#14b8a6",
          fillOpacity: 0.1,
        }}
      />

      {/* Update map when position changes */}
      <MapUpdater center={dogPosition} />

      {/* Simulate dog movement */}
      <DogMovement dogId={dogId} setPosition={setDogPosition} />
    </MapContainer>
  );
}
