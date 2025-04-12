// SoundPlayer.js
import { Audio } from "expo-av";

/**
 * Sound files
 */
export const soundFiles = {
  bark: require("../assets/sounds/bark.wav"),
  bite: require("../assets/sounds/bite.wav"),
  down: require("../assets/sounds/down.wav"),
  jump: require("../assets/sounds/jump.wav"),
  sit: require("../assets/sounds/sit.wav"),
  stand: require("../assets/sounds/stand.wav"),
  stay: require("../assets/sounds/stay.wav"),
};

/**
 * Play sound
 * @param {string} soundFileName - Sound file name
 * @returns {Promise<void>} - Promise representing the sound playback
 */
export const playSound = async (soundFileName) => {
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(soundFiles[soundFileName]); // Load the sound file
    await soundObject.playAsync(); // Play the sound
  } catch (error) {
    console.error("Error playing sound: ", error);
  }
};
