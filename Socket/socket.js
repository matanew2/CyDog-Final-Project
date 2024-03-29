const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
const port = 8000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

io.on("connection", (socket) => {
  console.log(`A user connected with socket id: ${socket.id}`);

  socket.on("newLocation", (location) => {
    console.log("User at location:", location.latitude, location.longitude);
    io.emit("newLocation", location); // broadcast to all clients
  });

  socket.on("command", (command) => {
    console.log(`Received command: ${command}`);
    io.emit("command", command); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected with socket id: ${socket.id}`);
  });
});

http.listen(port, () => {
  console.log(`Process is running on port ${port}`);
});
