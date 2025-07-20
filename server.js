require("dotenv").config();
const express = require("express");
const indexRouter = require("./Router/index");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const uploadDir = path.join(__dirname, "uploads");
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("New client connected");

  // Example: Emit a welcome message
  socket.emit("notification", "Welcome to the notification system!");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Check if the uploads directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/", indexRouter);
app.listen(PORT, () => {
  console.log("server started on port 3000");
});
