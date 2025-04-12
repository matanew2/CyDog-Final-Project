const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("./socket")(http);
const Dog = require("./schema/DogSchema");
const Handler = require("./schema/HandlerSchema");
const Task = require("./schema/TaskSchema");
const DatabaseConnection = require("./database");
const port = 8000; // Port number

app.use(cors()); // Enable CORS
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use('/public', express.static(path.join(__dirname, 'public'))); // Serve static files

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage }); // Create a multer instance with the storage configuration

/**
 * Save video
 * @param {string} id - Task ID
 * @param {Object} video - Video file
 * @returns {void}
 * @description Save the video file to the server 
 */
app.post("/save-video/:id", upload.single("video"), (req, res) => {
  const video = req.file;
  const dirPath = path.join(__dirname, "public/videos");
  const filePath = path.join(dirPath, video.originalname);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFile(filePath, video.buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ message: "Video saved successfully!" });
    }
  });
});

/**
 * Create a dog
 * @returns {void}
 * @description Create a dog and save it to the database
 */
app.post("/dogs", async (req, res) => {
  try {
    // create dog
    const dog = new Dog({
      name: "Lex",
      breed: "Labrador",
      age: 4,
      job: "sniffing",
      tasks: [],
    });
    const saveddog = await dog.save();
    res.status(200).send(saveddog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

/**
 * Create a video
 * @returns {void}
 * @description Create a video and save it to the server
 */
app.post("/handlers", async (req, res) => {
  try {
    // create handler
    const handler = new Handler({
      name: "Kim Jong-un",
      job: "dog handler",
      tasks: [],
    });
    const savedHandler = await handler.save();
    res.status(200).send(savedHandler);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});


/**
 * Delete all from the database
 * @returns {void}
 * @description Delete all dogs, handlers and tasks from the database
 */
app.delete("/all", async (req, res) => {
  try {
    // delete dogs
    await Dog.deleteMany({}); 
    // delete handlers
    await Handler.deleteMany({});
    // delete assigned tasks
    await Task.deleteMany({});
    res.status(204).send({ message: "All dogs and handlers deleted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

/**
 * http server
 * @returns {void}
 */
http.listen(port, () => {
  console.log(`Process is running on port ${port}`); // Log the port number
  DatabaseConnection(); // Connect to the database
});
