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
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTask, setCurrentTask] = useState({});
  const [createdTask, setCreatedTask] = useState(() => {
    const storedCreatedTask = localStorage.getItem("createdTask");
    return storedCreatedTask ? JSON.parse(storedCreatedTask) : false;
  });

  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setCreatedTask(true); // Set createdTask to true after successful login
      return true; // return true if sign-in is successful
    } catch (error) {
      setError(error.message);
      return false; // return false if an error occurs
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCreatedTask(false); // Set createdTask to false after logout
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const updateUserProfile = async (user, profile) => {
    try {
      await updateProfile(user, profile);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if( currentTask.videoName != "<no video>") {
      console.log('after recording', currentTask);
      socket.emit("finishTask", currentTask);
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      setCreatedTask(!!user); // Set createdTask based on whether user is authenticated
    });

    return unsubscribe;
  }, [currentTask]);

  useEffect(() => {
    // Save currentUser to localStorage whenever it changes
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    // Save createdTask to localStorage whenever it changes
    localStorage.setItem("createdTask", JSON.stringify(createdTask));
  }, [createdTask]);

  const value = {
    currentUser,
    error,
    setError,
    login,
    register,
    logout,
    updateUserProfile,
    currentTask,
    setCurrentTask,
    createdTask, // Include createdTask in the context value
    setCreatedTask,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
