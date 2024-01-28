// app.js
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 8000;

io.on("connection", (socket) => {
  console.log(`A user connected with socket id: ${socket.id}`);

  socket.on("newLocation", (location) => {
    console.log("User at location:", location.latitude, location.longitude);
    socket.emit("newLocation", location.latitude, location.longitude); // to desktop
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected with socket id: ${socket.id}`);
  });
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

http.listen(port, () => {
  console.log(`***** Server is running on port ${port}`);
  //   databaseConnection();
});
