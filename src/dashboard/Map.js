import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  useEffect(() => {
    // Creating map options
    const mapOptions = {
      center: [17.385044, 78.486671],
      zoom: 10,
    };

    // Creating a map object
    const map = L.map("map", mapOptions);

    // Creating a Layer object
    const layer = L.tileLayer(
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );

    // Adding layer to the map
    map.addLayer(layer);

    // Clean up function to remove the map when the component is unmounted
    return () => {
      map.remove();
    };
  }, []); // Empty dependency array ensures that this effect runs once after the initial render

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
