// SoundPlayer.js
import { Audio } from "expo-av";

export const soundFiles = {
  heel: require("../assets/sounds/heel.wav"),
  bark: require("../assets/sounds/bark.wav"),
  bite: require("../assets/sounds/bite.wav"),
  dont_do: require("../assets/sounds/dont-do.wav"),
  down: require("../assets/sounds/down.wav"),
  eat_food: require("../assets/sounds/eat-food.wav"),
  fetch: require("../assets/sounds/fetch.wav"),
  gaurd: require("../assets/sounds/gaurd.wav"),
  go_ahead: require("../assets/sounds/go-ahead.wav"),
  go_inside: require("../assets/sounds/go-inside.wav"),
  go_out: require("../assets/sounds/go-out.wav"),
  go_outside: require("../assets/sounds/go-outside.wav"),
  jump: require("../assets/sounds/jump.wav"),
  leave_it: require("../assets/sounds/leave-it.wav"),
  find_narcotics: require("../assets/sounds/find-narcotics.wav"),
  ok: require("../assets/sounds/ok.wav"),
  sit: require("../assets/sounds/sit.wav"),
  stand: require("../assets/sounds/stand.wav"),
  stay: require("../assets/sounds/stay.wav"),
  track: require("../assets/sounds/track.wav"),
};

export const playSound = async (soundFileName) => {
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(soundFiles[soundFileName]);
    await soundObject.playAsync();
  } catch (error) {
    console.error("Error playing sound: ", error);
  }
};
