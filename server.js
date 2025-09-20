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

const fs = require("fs");
const file = "count.json";

let count = 0;

// Load count from file if exists
if (fs.existsSync(file)) {
  count = JSON.parse(fs.readFileSync(file, "utf-8")).count;
}

// Save every time it changes
function saveCount() {
  fs.writeFileSync(file, JSON.stringify({ count }));
}


// save the counter
io.on("connection", (socket) => {
  socket.emit("countUpdate", count);
  socket.on("increment", () => {
    count++;
    saveCount();
    io.emit("countUpdate", count);
  });
});


// socket.io connections
io.on("connection", (socket) => {
  console.log("connect");

  // send to client
  socket.emit("countUpdate", count);

  // f pressing
  socket.on("increment", () => {
    count++;
    io.emit("countUpdate", count); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});

// bind to 0.0.0.0
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
