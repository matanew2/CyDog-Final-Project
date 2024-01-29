// LocationManager.js
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

const LocationManager = ({ prevLocation, onLocationChange }) => {
  useEffect(() => {
    (getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          if (
            !prevLocation ||
            prevLocation.latitude !== location.coords.latitude ||
            prevLocation.longitude !== location.coords.longitude
          ) {
            onLocationChange({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        } else {
          console.log("Location permission denied");
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, [onLocationChange, prevLocation]); // Added prevLocation to the dependency array
};

export default LocationManager;
