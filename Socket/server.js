const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("./socket")(http);
const DatabaseConnection = require('./database');
const port = 8000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

http.listen(port, () => {
    console.log(`Process is running on port ${port}`);
    DatabaseConnection();
});