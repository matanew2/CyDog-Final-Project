import io from "socket.io-client";

const socket = io
    .connect("http://192.168.1.5:8000")
    .on("connect", () => {  
        console.log("Connected to server");
    })

export default socket;