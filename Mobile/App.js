// App.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { soundFiles, playSound } from "./components/SoundPlayer";
import SocketManager from "./components/SocketManager";
import LocationManager from "./components/LocationManager";

export default function App() {
  const baseUrl =
    "https://34bb-2a06-c701-7436-5900-a809-dc39-3aeb-eb6b.ngrok-free.app";
  const [sound, setSound] = useState(null);
  const [location, setLocation] = useState(null);

  const socketRef = SocketManager(baseUrl, (data) => {
    const nameData = data.split(".")[0];
    if (nameData in soundFiles) {
      setSound(nameData);
      console.log("Prepare sound for playing...");
    } else {
      setSound("empty");
      console.log("SoundName doesn't exist...");
    }
    playSound(nameData);
  });

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    console.log("New location:", newLocation);

    // Check if socketRef.current is defined before emitting
    if (socketRef.current) {
      socketRef.current.emit("newLocation", newLocation);
    }
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
      <LocationManager onLocationChange={handleLocationChange} />
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
