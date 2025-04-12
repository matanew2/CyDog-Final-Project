import io from "socket.io-client";

/**
 * Socket connection
 * @type {object}
 * @description Socket connection to server
 */
const socket = io
    .connect("http://192.168.1.5:8000")
    .on("connect", () => {  
        console.log("Connected to server");
    })

export default socket;