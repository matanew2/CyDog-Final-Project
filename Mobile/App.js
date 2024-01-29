// App.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { playSound } from "./components/SoundPlayer";
import LocationManager from "./components/LocationManager";
import io from "socket.io-client";

const socket = io("http://10.0.0.10:8000", {
  transports: ["websocket"],
  forceNew: true,
});

socket.on("connect_error", (err) => {
  console.log(`Connection Error: ${err.message}`);
});

export default function App() {
  const [sound, setSound] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const commandListener = (command) => {
      console.log("Play command:", command);
      setSound(command);
      playSound(command);
    };

    socket.on("command", commandListener);

    return () => {
      socket.off("command", commandListener);
    };
  }, []); // Empty dependency array so this runs only once

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    console.log("New location:", newLocation);

    socket.emit("newLocation", newLocation);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Expo Go App</Text>
      {sound && <Text style={styles.text}>Sound Name: {sound}</Text>}
      {location && (
        <Text style={styles.text}>
          Location: {`${location.latitude}, ${location.longitude}`}
        </Text>
      )}
      <LocationManager
        prevLocation={location}
        onLocationChange={handleLocationChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
