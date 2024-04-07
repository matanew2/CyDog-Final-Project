const express = require("express");
const app = express();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("./socket")(http);
const DatabaseConnection = require('./database');
const port = 8000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

app.post('/save-video', upload.single('video'), (req, res) => {
  const video = req.file;
  const dirPath = path.join(__dirname, 'public/videos');
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
      res.status(200).json({ message: 'Video saved successfully!' });
    }
  });
});

http.listen(port, () => {
    console.log(`Process is running on port ${port}`);
    DatabaseConnection();
});