// LocationManager.js
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

const LocationManager = ({ onLocationChange }) => {
  
  useEffect(() => {
    (getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          onLocationChange({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          console.log("Location permission denied");
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, [onLocationChange]);

  return null;
};

export default LocationManager;
