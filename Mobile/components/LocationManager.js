// LocationManager.js
import React, { useEffect, useRef } from "react";
import * as Location from "expo-location";

const LocationManager = ({ prevLocation, onLocationChange }) => {
  const locationRef = useRef(null);

  useEffect(() => {
    let intervalId;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          locationRef.current = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
        } else {
          console.log("Location permission denied");
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    getLocation();

    intervalId = setInterval(() => {
      if (locationRef.current) {
        onLocationChange(locationRef.current);
      }
    },10000); // Emit location update every 10 seconds

    // Clean up the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [onLocationChange, prevLocation]); // Added prevLocation to the dependency array
};

export default LocationManager;