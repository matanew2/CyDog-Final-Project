import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import auth from "../config/firebase";
import socket from "../utils/utils";

/**
 * AuthContext
 * @type {object}
 * @description Context for authentication
 * @property {object} currentUser - Current user
 * @property {string} message - Message
 * @property {function} login - Login function
 * @property {function} register - Register function
 * @property {function} logout - Logout function
 * @property {function} updateUserProfile - Update user profile function
 * @property {object} currentTask - Current task
 * @property {function} setCurrentTask - Set current task function
 * @property {boolean} createdTask - Created task
 * @property {function} setCreatedTask - Set created task function
 * @property {boolean} doubleCheck - Double check
 * @property {function} setDoubleCheck - Set double check function
 * @property {function} useAuth - Use auth function
 * @property {function} AuthProvider - Auth provider function
 * @property {function} AuthContext - Auth context function
 * @returns {object} AuthContext
 */
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider
 * @param {object} children - Children
 * @returns {JSX.Element} - AuthProvider component
 * @description Provider for authentication
 * @var {object} currentUser - Current user
 * @var {boolean} loading - Loading state
 * @var {string} message - Message
 * @var {object} currentTask - Current task
 * @var {boolean} createdTask - Created task
 * @var {boolean} doubleCheck - Double check
 * @var {function} register - Register function
 * @var {function} login - Login function
 * @var {function} logout - Logout function
 * @var {function} updateUserProfile - Update user profile function
 * @var {function} value - Value
 * @returns {JSX.Element} - AuthProvider
 * @description Provider for authentication
 */
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
    socket.emit("finishTask", currentTask);
  }, [currentTask]); // Only run when currentTask changes

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []); // Only run once on mount

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
