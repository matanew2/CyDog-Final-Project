// LocationManager.js
import { useEffect, useRef } from "react";
import * as Location from "expo-location";

/**
 * LocationManager component
 * Description: Manages location updates
 * @param {object} props - Component props
 * @param {object} props.prevLocation - Previous location
 * @param {function} props.onLocationChange - Location change handler
 * @returns {null} - LocationManager component
 */
const LocationManager = ({ prevLocation, onLocationChange }) => {
  const locationRef = useRef(null);

  /* Get the current location and emit it to the server */
  useEffect(() => {
    let intervalId;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync(); // Request location permission
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({}); // Get the current location
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

    getLocation(); // Get the current location

    intervalId = setInterval(() => {
      if (locationRef.current) { // Check if the location is available
        onLocationChange(locationRef.current); // Emit the location update
      }
    },10000); // Emit location update every 10 seconds

    // Clean up the interval when the component unmounts
    return () => {
      if (intervalId) { // Check if the interval is set
        clearInterval(intervalId); // Clear the interval
      }
    };
  }, [onLocationChange, prevLocation]); // Added prevLocation to the dependency array
};

export default LocationManager;