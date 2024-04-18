const DogSchema = require("./schema/DogSchema");
const HandlerSchema = require("./schema/HandlerSchema");
const TaskSchema = require("./schema/TaskSchema");

module.exports = function (http) {
  const io = require("socket.io")(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
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
    socket.on("command", async (command, taskId) => {
      console.log(`Received command: ${command}`);
      console.log(`Task ID: ${taskId}`);

      // Send the command to the dog
      const task = await TaskSchema.findById(taskId);
      if (!task) {
        console.log("Error: Task not found");
        return;
      }
      console.log(task);
      task.commands.push(command);
      await task.save();
      console.log("task updated with command");

      io.emit("command", command); // broadcast to all clients
    });

    // DOG LIST
    socket.on("dogList", async () => {
      try {
        const dogList = await DogSchema.find({}).populate({
          path: "tasks",
          populate: {
            path: "handler",
          },
        });
        io.emit("dogList", dogList); // broadcast to all clients
      } catch (error) {
        console.log("Error fetching dog list:", error);
      }
    });

    // HANDLER LIST
    socket.on("handlerList", async () => {
      try {
        const handlerList = await HandlerSchema.find({}).populate({
          path: "tasks",
          populate: {
            path: "dog",
          },
        });
        io.emit("handlerList", handlerList); // broadcast to all clients
      } catch (error) {
        console.log("Error fetching handler list:", error);
      }
    });

    // TASK LIST
    socket.on("taskList", async () => {
      try {
        const taskList = await TaskSchema.find({})
          .populate("handler")
          .populate("dog");
        io.emit("taskList", taskList); // broadcast to all clients
      } catch (error) {
        console.log("Error fetching task list:", error);
      }
    });

    socket.on("newTask", async (task) => {
      try {
        console.log(task);
        // create a new task
        const newTask = new TaskSchema(task);
        await newTask.save();

        // update the task list in dog
        const dog = await DogSchema.findById(task.dog);
        dog.tasks.push(newTask._id);
        await dog.save();

        // update the task list in handler
        const handler = await HandlerSchema.findById(task.handler);
        handler.tasks.push(newTask._id);
        await handler.save();

        // populate the task with handler and dog
        const populateTask = await TaskSchema.findById(newTask._id)
          .populate("handler")
          .populate("dog");
        io.emit("newTask", populateTask); // broadcast to all clients
      } catch (error) {
        console.log("Error creating new task:", error);
      }
    });

    socket.on("deleteTask", async (taskId) => {
      try {
        // delete the task
        await TaskSchema.findByIdAndDelete(taskId);

        // update the task list in all dogs that contain the task
        await DogSchema.updateMany(
          { tasks: taskId },
          { $pull: { tasks: taskId } }
        );

        // update the task list in all handlers that contain the task
        await HandlerSchema.updateMany(
          { tasks: taskId },
          { $pull: { tasks: taskId } }
        );

        io.emit("deleteTask", taskId); // broadcast to all clients
      } catch (error) {
        console.log("Error deleting task:", error);
      }
    });

    socket.on("finishTask", async (task) => {
      try {
        console.log(task);
        // finish the task
        if (task && task._id && task.videoName) {
          const finishedTask = await TaskSchema.findByIdAndUpdate(
            task._id,
            { videoName: task.videoName, dueDate: new Date() },
            { new: true } // this option returns the updated document
          );        
          console.log(finishedTask);
          io.emit("finishTask", finishedTask); // broadcast to all clients
        } else {
          console.log("Error: Task not found");
        }      
      } catch (error) {
        console.log("Error finishing task:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected with socket id: ${socket.id}`);
    });
  });

  return io;
};
