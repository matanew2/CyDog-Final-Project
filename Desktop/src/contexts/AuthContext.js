import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import auth from "../config/firebase";
import socket from "../utils/utils";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentTask, setCurrentTask] = useState({});
  const [createdTask, setCreatedTask] = useState(false); // Initialize createdTask to false
  const [doubleCheck, setDoubleCheck] = useState(false); // Initialize doubleCheck to false

  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      setMessage(error.message);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true; // return true if sign-in is successful
    } catch (error) {
      setMessage(error.message);
      return false; // return false if an error occurs
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // setCreatedTask(false); // Set createdTask to false after logout
      return true;
    } catch (error) {
      setMessage(error.message);
      return false;
    }
  };

  const updateUserProfile = async (user, profile) => {
    try {
      await updateProfile(user, profile);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (currentTask.videoName !== "<no video>") {
      console.log("after recording", currentTask);
      socket.emit("finishTask", currentTask);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentTask]);

  const value = {
    currentUser,
    message,
    setMessage,
    login,
    register,
    logout,
    updateUserProfile,
    currentTask,
    setCurrentTask,
    createdTask, // Include createdTask in the context value
    setCreatedTask,
    doubleCheck,
    setDoubleCheck,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
