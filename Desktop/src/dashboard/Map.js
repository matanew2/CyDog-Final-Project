import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ currentTask, setCurrentTask, location }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const locationsRef = useRef([]);

  useEffect(() => {
    const mapOptions = {
      center: [location.latitude, location.longitude],
      zoom: 10,
    };

    mapRef.current = L.map("map", mapOptions);

    const layer = L.tileLayer(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );

    mapRef.current.addLayer(layer);

    var myIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png", // URL to your icon image
      iconSize: [25, 41],
    });

    markerRef.current = L.marker([location.latitude, location.longitude], {
      icon: myIcon,
    }).addTo(mapRef.current);

    // Initialize polyline
    polylineRef.current = L.polyline([], { color: "green", weight: 10 }).addTo(
      mapRef.current
    );

    return () => {
      mapRef.current.remove();
    };
  }, [location]); // This effect runs once after the initial render

  useEffect(() => {
    if (
      markerRef.current &&
      !(location.latitude === 0 && location.longitude === 0)
    ) {
      markerRef.current.setLatLng([location.latitude, location.longitude]);
      mapRef.current.setView([location.latitude, location.longitude], 16); // Adjust the zoom level here

      // Add new location to locations array
      locationsRef.current.push([location.latitude, location.longitude]);

      // Redraw polyline with new locations
      polylineRef.current.setLatLngs(locationsRef.current);

      console.log(locationsRef.current);
      // Update currentTask with new locations
      setCurrentTask({
        ...currentTask,
        locations: locationsRef.current,
      });
    }
  }, [setCurrentTask, currentTask, location.latitude, location.longitude]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid #303030",
        borderRadius: "10px",
      }}
    />
  );
};

export default MapComponent;
