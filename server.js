const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// netlify frontend
const io = new Server(server, {
  cors: {
    origin: "https://spamyourfkey.com"
  }
});

let count = 0;

// socket.io connections
io.on("connection", (socket) => {
  console.log("a user connected");

  // send to client
  socket.emit("countUpdate", count);

  // f pressing
  socket.on("increment", () => {
    count++;
    io.emit("countUpdate", count); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

// bind to 0.0.0.0
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
