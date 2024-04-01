const DogSchema = require('./schema/DogSchema');
const HandlerSchema = require('./schema/HandlerSchema');
const TaskSchema = require('./schema/TaskSchema');

module.exports = function(http) {
  const io = require("socket.io")(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected with socket id: ${socket.id}`);

    // DASHBOARD
    socket.on("newLocation", (location) => {
      console.log("User at location:", location.latitude, location.longitude);
      io.emit("newLocation", location); // broadcast to all clients
    });
    socket.on("command", (command) => {
      console.log(`Received command: ${command}`);
      io.emit("command", command); // broadcast to all clients
    });

    // DOG LIST
    socket.on("dogList", async () => { 
      try {
        const dogList = await DogSchema.find({});
        io.emit("dogList",dogList); // broadcast to all clients
      } catch (error) {
        console.log("Error fetching dog list:", error);
      }
    });

    // HANDLER LIST
    socket.on("handlerList", async () => {
      try {
        const handlerList = await HandlerSchema.find({});
        io.emit("handlerList", handlerList); // broadcast to all clients
      } catch (error) {
        console.log("Error fetching handler list:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected with socket id: ${socket.id}`);
    });
  });

  return io;
}