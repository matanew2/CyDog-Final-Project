import { useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";

const SocketManager = (socket, callback) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Create a new socket connection when the component mounts
    socketRef.current = socket;

    // Listen for the "sound" event from the server
    socketRef.current.on("sound", (data) => {
      callback(data);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socketRef.current.disconnect();
    };
  }, [socket, callback]);

  return socketRef;
};

export default SocketManager;
