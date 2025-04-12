import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/material";

const MapComponent = ({ setCurrentTask, location }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const locationsRef = useRef([]);
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) {
      const mapOptions = {
        center: [location.latitude, location.longitude],
        zoom: 10,
      };

      mapRef.current = L.map("map", mapOptions);

      const layer = L.tileLayer(
        "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      );

      mapRef.current.addLayer(layer);

      const myIcon = L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png", // URL to your icon image
        iconSize: [25, 41],
      });

      markerRef.current = L.marker([location.latitude, location.longitude], {
        icon: myIcon,
      }).addTo(mapRef.current);

      setLocationLoaded(true);

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [location]);

  useEffect(() => {
    if (locationLoaded) {
      markerRef.current.setLatLng([location.latitude, location.longitude]);
      mapRef.current.setView([location.latitude, location.longitude], 16); // Adjust the zoom level here

      // Add new location to locations array
      locationsRef.current.push([location.latitude, location.longitude]);

      // Update currentTask with new locations
      setCurrentTask((prevTask) => ({
        ...prevTask,
        locations: [...locationsRef.current],
      }));
    }
  }, [location.latitude, location.longitude, locationLoaded, setCurrentTask]);

  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      border={1}
      borderColor="#303030"
      borderRadius="10px"
    >
      <div
        id="map"
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: locationLoaded ? "auto" : "none", // Disable pointer events if location is not loaded
        }}
      />
      {!locationLoaded && ( // Only render CircularProgress and Typography if location is not loaded
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <CircularProgress />
          <Typography variant="h6">Loading Map...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapComponent;